import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(private prisma: PrismaService) { }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) throw new UnauthorizedException('API Key missing');

        const app = await this.prisma.app.findUnique({ where: { apiKey } });
        if (!app) throw new UnauthorizedException('Invalid API Key');

        req.app = app;
        return true;
    }
}