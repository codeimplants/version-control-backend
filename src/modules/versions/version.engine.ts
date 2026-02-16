export interface VersionRule {
    killSwitch: boolean;
    blockedVersions: string[];
    latestVersion: string;
    updateType: string;
    messageConfig: any;
    isActive: boolean;
    priority: number;
    rolloutPercentage: number;
    startDate?: Date;
    endDate?: Date;
}

export interface MaintenanceMode {
    isEnabled: boolean;
    title: string;
    message: string;
    estimatedEnd?: Date;
}

interface EvaluationContext {
    currentVersion: string;
    buildNumber?: string;
    deviceId?: string;
}

export class VersionEngine {
    /**
     * Main evaluation method
     */
    static evaluate(
        rule: VersionRule | null,
        context: EvaluationContext,
        maintenanceMode?: MaintenanceMode,
        storeUrl?: string,
    ) {
        // 1. Check Global App Maintenance Mode First
        if (maintenanceMode?.isEnabled) {
            return {
                status: 'MAINTENANCE',
                title: maintenanceMode.title,
                message: maintenanceMode.message,
                estimatedEnd: maintenanceMode.estimatedEnd,
                blockVersion: true,
            };
        }

        // No rule found - allow access
        if (!rule) {
            return { status: 'NONE' };
        }

        // 2. Check Rule Status (Active/Dates/Rollout)
        if (!rule.isActive) {
            return { status: 'NONE' };
        }

        if (!this.isRuleActive(rule)) {
            return { status: 'NONE' };
        }

        if (!this.shouldApplyRule(rule, context.deviceId)) {
            return { status: 'NONE' };
        }

        // 3. Rule-based Maintenance (Matches Update Type 'maintenance')
        // This applies regardless of the user's current version
        if (rule.updateType === 'maintenance') {
            return {
                status: 'MAINTENANCE',
                title: rule.messageConfig?.title || rule.messageConfig?.maintenanceTitle || 'Under Maintenance',
                message: rule.messageConfig?.message || rule.messageConfig?.maintenanceMessage || 'We are currently performing maintenance. Please check back soon.',
                customMessage: rule.messageConfig,
                blockVersion: true,
                storeUrl,
            };
        }

        // 4. Kill Switch (Highest priority rule violation)
        if (rule.killSwitch) {
            return {
                status: 'KILL_SWITCH',
                title: rule.messageConfig?.title || 'App Disabled',
                message: rule.messageConfig?.message || 'This app is currently unavailable.',
                customMessage: rule.messageConfig,
                blockVersion: true,
            };
        }

        // 5. Blocked Versions
        if (rule.blockedVersions?.includes(context.currentVersion)) {
            return {
                status: 'BLOCKED',
                title: rule.messageConfig?.blockedTitle || 'Version Blocked',
                message:
                    rule.messageConfig?.blockedMessage ||
                    'This version is no longer supported. Please update to continue.',
                customMessage: rule.messageConfig,
                blockVersion: true,
                storeUrl,
            };
        }



        // Handle updates when below latest version but above min version
        // Version Range Comparisons
        const isBelowLatest = this.compareVersions(context.currentVersion, rule.latestVersion) < 0;

        // Handle updates when below latest version but above min version
        if (isBelowLatest) {
            if (rule.updateType === 'soft') {
                return {
                    status: 'SOFT_UPDATE',
                    title: rule.messageConfig?.softTitle || 'Update Available',
                    message:
                        rule.messageConfig?.softMessage ||
                        'A new version is available. Update for the best experience.',
                    buttonText: rule.messageConfig?.softButtonText || 'Update',
                    customMessage: rule.messageConfig,
                    latestVersion: rule.latestVersion,
                    blockVersion: false,
                    storeUrl,
                };
            }

            if (rule.updateType === 'force') {
                return {
                    status: 'FORCE_UPDATE',
                    title: rule.messageConfig?.forceTitle || 'Update Required',
                    message:
                        rule.messageConfig?.forceMessage ||
                        'Please update to the latest version to continue.',
                    buttonText: rule.messageConfig?.forceButtonText || 'Update Now',
                    customMessage: rule.messageConfig,
                    latestVersion: rule.latestVersion,
                    blockVersion: true,
                    storeUrl,
                };
            }
        }

        // All checks passed
        return { status: 'NONE' };
    }

    /**
     * Compare two semantic versions
     * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
     */
    static compareVersions(v1: string, v2: string): number {
        if (!v1 || !v2) return 0;
        const v1Parts = v1.split('.').map(Number);
        const v2Parts = v2.split('.').map(Number);
        const maxLength = Math.max(v1Parts.length, v2Parts.length);

        for (let i = 0; i < maxLength; i++) {
            const v1Part = v1Parts[i] || 0;
            const v2Part = v2Parts[i] || 0;

            if (v1Part > v2Part) return 1;
            if (v1Part < v2Part) return -1;
        }

        return 0;
    }

    /**
     * Check if rule is active based on start/end dates
     */
    private static isRuleActive(rule: VersionRule): boolean {
        const now = new Date();

        if (rule.startDate && now < new Date(rule.startDate)) {
            return false;
        }

        if (rule.endDate && now > new Date(rule.endDate)) {
            return false;
        }

        return true;
    }

    /**
     * Gradual rollout logic based on percentage
     * Uses deviceId hash to determine if rule should apply
     */
    private static shouldApplyRule(rule: VersionRule, deviceId?: string): boolean {
        // If 100%, always apply
        if (rule.rolloutPercentage >= 100) {
            return true;
        }

        // If no deviceId, apply based on random chance
        if (!deviceId) {
            return Math.random() * 100 < rule.rolloutPercentage;
        }

        // Hash deviceId to get consistent percentage
        const hash = this.simpleHash(deviceId);
        const devicePercentage = (hash % 100) + 1;

        return devicePercentage <= rule.rolloutPercentage;
    }

    /**
     * Simple string hash function
     */
    private static simpleHash(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    /**
     * Evaluate multiple rules and return highest priority match
     */
    static evaluateMultiple(
        rules: VersionRule[],
        context: EvaluationContext,
        maintenanceMode?: MaintenanceMode,
        storeUrl?: string,
    ) {
        // Sort by priority (descending)
        const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

        // Evaluate each rule in priority order
        for (const rule of sortedRules) {
            const result = this.evaluate(rule, context, maintenanceMode, storeUrl);
            if (result.status !== 'NONE') {
                return result;
            }
        }

        return { status: 'NONE' };
    }
}
