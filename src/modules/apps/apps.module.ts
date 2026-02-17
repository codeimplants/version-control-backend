import { Module } from '@nestjs/common';
import { AppsController } from './apps.controller';
import { AppsService } from './apps.service';
import { PrismaService } from '../../database/prisma.service';
import { AuditModule } from '../audit/audit.module';
import { AuthModule } from '../auth/auth.module';
import { AppAccessGuard } from '../../common/guards/app-access.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

@Module({
    imports: [AuditModule, AuthModule],
    controllers: [AppsController],
    providers: [AppsService, PrismaService, AppAccessGuard, RolesGuard],
})
export class AppsModule { }
