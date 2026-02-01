import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getOverview() {
        const [totalApps, totalDevices, activeDevices] = await Promise.all([
            this.prisma.app.count(),
            this.prisma.device.count(),
            this.prisma.device.count({
                where: {
                    lastCheckIn: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    },
                },
            }),
        ]);

        return {
            totalApps,
            totalDevices,
            activeDevices,
        };
    }

    async getByApp(appId: string) {
        return this.prisma.appAnalytics.findMany({
            where: { appId },
            orderBy: { date: 'desc' },
            take: 50,
        });
    }

    async getVersionChecks() {
        // Return recent checks for visualization
        // Grouping by day would be better done with raw query, but for now allow fetching raw data
        return this.prisma.appAnalytics.findMany({
            where: { eventType: 'version_check' },
            orderBy: { date: 'desc' },
            take: 100,
        });
    }

    async getPlatformDistribution() {
        const distribution = await this.prisma.device.groupBy({
            by: ['platform'],
            _count: {
                id: true,
            },
        });

        return distribution.map(d => ({
            platform: d.platform,
            count: d._count.id,
        }));
    }
}
