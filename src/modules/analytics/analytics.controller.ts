import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { AppAccessGuard } from '../../common/guards/app-access.guard';
import { User } from '../../common/decorators/user.decorator';

@Controller('admin/analytics')
@UseGuards(JwtGuard)
export class AnalyticsController {
    constructor(private analytics: AnalyticsService) { }

    @Get('overview')
    getOverview(@User() user: { id: string; role: string }) {
        return this.analytics.getOverview({ userId: user.id, role: user.role });
    }

    @Get('apps/:appId')
    @UseGuards(AppAccessGuard)
    getByApp(@Param('appId') appId: string) {
        return this.analytics.getByApp(appId);
    }

    @Get('version-checks')
    getVersionChecks(@User() user: { id: string; role: string }) {
        return this.analytics.getVersionChecks({ userId: user.id, role: user.role });
    }

    @Get('platform-distribution')
    getPlatformDistribution(@User() user: { id: string; role: string }) {
        return this.analytics.getPlatformDistribution({ userId: user.id, role: user.role });
    }
}
