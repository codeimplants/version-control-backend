import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('admin/analytics')
export class AnalyticsController {
    constructor(private analytics: AnalyticsService) { }

    @Get('overview')
    getOverview() {
        return this.analytics.getOverview();
    }

    @Get('apps/:appId')
    getByApp(@Param('appId') appId: string) {
        return this.analytics.getByApp(appId);
    }

    @Get('version-checks')
    getVersionChecks() {
        return this.analytics.getVersionChecks();
    }

    @Get('platform-distribution')
    getPlatformDistribution() {
        return this.analytics.getPlatformDistribution();
    }
}
