import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AppsService {
    constructor(private prisma: PrismaService) { }

    create(data: any) {
        return this.prisma.app.create({
            data: {
                ...data,
                apiKey: uuid(),
            },
        });
    }

    async findAll() {
        return this.prisma.app.findMany({
            include: {
                _count: {
                    select: {
                        rules: true,
                        devices: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const app = await this.prisma.app.findUnique({
            where: { id },
            include: {
                rules: true,
                storeUrls: true,
                maintenanceMode: true,
                _count: {
                    select: {
                        rules: true,
                        devices: true,
                    },
                },
            },
        });
        if (!app) throw new NotFoundException('App not found');
        return app;
    }

    async update(id: string, data: any) {
        return this.prisma.app.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.app.delete({
            where: { id },
        });
    }

    async getStats(id: string) {
        const [app, rulesCount, devicesCount, activeDevicesCount] = await Promise.all([
            this.prisma.app.findUnique({ where: { id } }),
            this.prisma.versionRule.count({ where: { appId: id } }),
            this.prisma.device.count({ where: { appId: id } }),
            this.prisma.device.count({
                where: {
                    appId: id,
                    lastCheckIn: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Active in last 30 days
                    },
                },
            }),
        ]);

        if (!app) throw new NotFoundException('App not found');

        return {
            appId: app.appId,
            name: app.name,
            totalRules: rulesCount,
            totalDevices: devicesCount,
            activeDevices: activeDevicesCount,
        };
    }

    async getRules(appId: string) {
        return this.prisma.versionRule.findMany({
            where: { appId },
            orderBy: { priority: 'desc' },
        });
    }

    async createRule(appId: string, data: any) {
        return this.prisma.versionRule.create({
            data: {
                ...data,
                appId,
            },
        });
    }

    async getStoreUrls(appId: string) {
        return this.prisma.storeUrl.findMany({ where: { appId } });
    }

    async upsertStoreUrl(appId: string, data: { platform: string, storeUrl: string }) {
        return this.prisma.storeUrl.upsert({
            where: {
                appId_platform: {
                    appId,
                    platform: data.platform,
                },
            },
            create: { ...data, appId },
            update: { storeUrl: data.storeUrl },
        });
    }

    async deleteStoreUrl(appId: string, platform: string) {
        return this.prisma.storeUrl.delete({
            where: {
                appId_platform: {
                    appId,
                    platform,
                },
            },
        });
    }

    async getMaintenance(appId: string) {
        return this.prisma.maintenanceMode.findUnique({ where: { appId } });
    }

    async updateMaintenance(appId: string, data: any) {
        return this.prisma.maintenanceMode.upsert({
            where: { appId },
            create: { ...data, appId },
            update: data,
        });
    }

    async toggleMaintenance(appId: string) {
        const mode = await this.getMaintenance(appId);
        if (!mode) {
            return this.prisma.maintenanceMode.create({
                data: { appId, isEnabled: true },
            });
        }
        return this.prisma.maintenanceMode.update({
            where: { appId },
            data: { isEnabled: !mode.isEnabled },
        });
    }
}