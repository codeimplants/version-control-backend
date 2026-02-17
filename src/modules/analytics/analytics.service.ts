import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

export interface AccessContext {
    userId: string;
    role: string;
}

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    private async getAccessibleAppIds(ctx: AccessContext): Promise<string[] | null> {
        if (ctx.role === 'ADMIN') return null;
        const rows = await this.prisma.appCollaborator.findMany({
            where: { adminId: ctx.userId },
            select: { appId: true },
        });
        return rows.map((r) => r.appId);
    }

    async getOverview(ctx: AccessContext) {
        const appIds = await this.getAccessibleAppIds(ctx);
        const appWhere = appIds === null ? {} : { id: { in: appIds } };
        const deviceWhere = appIds === null ? {} : { appId: { in: appIds } };
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const [totalProjects, totalApps, totalRules, totalDevices, activeDevices, versionChecks, forceUpdates] = await Promise.all([
            this.prisma.app.count({ where: appWhere }),
            this.prisma.app.count({ where: appWhere }),
            this.prisma.versionRule.count({ where: { app: appWhere } }),
            this.prisma.device.count({ where: deviceWhere }),
            this.prisma.device.count({
                where: {
                    ...deviceWhere,
                    lastCheckIn: { gte: since },
                },
            }),
            this.prisma.appAnalytics.count({
                where: {
                    ...(appIds === null ? {} : { appId: { in: appIds } }),
                    eventType: 'version_check',
                },
            }),
            this.prisma.appAnalytics.count({
                where: {
                    ...(appIds === null ? {} : { appId: { in: appIds } }),
                    eventType: 'update_force',
                },
            }),
        ]);

        return {
            totalProjects,
            totalApps,
            totalRules,
            totalDevices,
            activeDevices,
            totalChecks: versionChecks,
            forceUpdates,
        };
    }

    async getByApp(appId: string) {
        return this.prisma.appAnalytics.findMany({
            where: { appId },
            orderBy: { date: 'desc' },
            take: 50,
        });
    }

    async getVersionChecks(ctx: AccessContext) {
        const appIds = await this.getAccessibleAppIds(ctx);
        const where: any = { eventType: 'version_check' };
        if (appIds !== null) where.appId = { in: appIds };
        return this.prisma.appAnalytics.findMany({
            where,
            orderBy: { date: 'desc' },
            take: 100,
        });
    }

    async getPlatformDistribution(ctx: AccessContext) {
        const appIds = await this.getAccessibleAppIds(ctx);
        const where = appIds === null ? {} : { appId: { in: appIds } };
        const distribution = await this.prisma.device.groupBy({
            by: ['platform'],
            where,
            _count: { id: true },
        });
        return distribution.map((d) => ({
            platform: d.platform,
            count: d._count.id,
        }));
    }
}
