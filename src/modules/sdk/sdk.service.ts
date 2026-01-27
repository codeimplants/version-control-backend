import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { VersionEngine } from '../versions/version.engine';

@Injectable()
export class SdkService {
    constructor(private prisma: PrismaService) { }

    async checkVersion(apiKey: string, data: any) {
        const app = await this.prisma.app.findUnique({ where: { apiKey } });
        if (!app) throw new UnauthorizedException('Invalid API Key');

        const rule = await this.prisma.versionRule.findFirst({
            where: {
                appId: app.id,
                platform: data.platform,
                environment: data.environment,
            },
        });

        return VersionEngine.evaluate(rule, data.version);
    }
}