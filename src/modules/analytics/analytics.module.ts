import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../database/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { AppAccessGuard } from '../../common/guards/app-access.guard';

@Module({
    imports: [AuthModule],
    controllers: [AnalyticsController],
    providers: [AnalyticsService, PrismaService, AppAccessGuard],
})
export class AnalyticsModule { }
