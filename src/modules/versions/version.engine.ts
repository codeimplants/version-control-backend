export class VersionEngine {
    static evaluate(rule: any, currentVersion: string) {
        if (!rule) return { status: 'NONE' };

        if (rule.killSwitch) {
            return { status: 'KILL_SWITCH', message: rule.messageConfig };
        }

        if (rule.blockedVersions.includes(currentVersion)) {
            return { status: 'BLOCKED', message: rule.messageConfig };
        }

        if (this.compare(currentVersion, rule.minVersion) < 0) {
            return { status: 'FORCE_UPDATE', message: rule.messageConfig };
        }

        if (this.compare(currentVersion, rule.latestVersion) < 0) {
            if (rule.updateType === 'soft') {
                return { status: 'SOFT_UPDATE', message: rule.messageConfig };
            }
            if (rule.updateType === 'force') {
                return { status: 'FORCE_UPDATE', message: rule.messageConfig };
            }
        }

        return { status: 'NONE' };
    }

    static compare(v1: string, v2: string) {
        const a = v1.split('.').map(Number);
        const b = v2.split('.').map(Number);
        for (let i = 0; i < 3; i++) {
            if ((a[i] || 0) > (b[i] || 0)) return 1;
            if ((a[i] || 0) < (b[i] || 0)) return -1;
        }
        return 0;
    }
}
