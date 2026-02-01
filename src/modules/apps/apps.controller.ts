import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { AppsService } from './apps.service';

@Controller('admin/apps')
export class AppsController {
    constructor(private apps: AppsService) { }

    @Post()
    create(@Body() body: any) {
        return this.apps.create(body);
    }

    @Get()
    findAll() {
        return this.apps.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.apps.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.apps.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.apps.remove(id);
    }

    @Get(':id/stats')
    getStats(@Param('id') id: string) {
        return this.apps.getStats(id);
    }

    @Get(':id/rules')
    getRules(@Param('id') id: string) {
        return this.apps.getRules(id);
    }

    @Post(':id/rules')
    createRule(@Param('id') id: string, @Body() body: any) {
        return this.apps.createRule(id, body);
    }

    @Get(':id/store-urls')
    getStoreUrls(@Param('id') id: string) {
        return this.apps.getStoreUrls(id);
    }

    @Post(':id/store-urls')
    upsertStoreUrl(@Param('id') id: string, @Body() body: any) {
        return this.apps.upsertStoreUrl(id, body);
    }

    @Delete(':id/store-urls/:platform')
    deleteStoreUrl(@Param('id') id: string, @Param('platform') platform: string) {
        return this.apps.deleteStoreUrl(id, platform);
    }

    @Get(':id/maintenance')
    getMaintenance(@Param('id') id: string) {
        return this.apps.getMaintenance(id);
    }

    @Put(':id/maintenance')
    updateMaintenance(@Param('id') id: string, @Body() body: any) {
        return this.apps.updateMaintenance(id, body);
    }

    @Patch(':id/maintenance/toggle')
    toggleMaintenance(@Param('id') id: string) {
        return this.apps.toggleMaintenance(id);
    }
}