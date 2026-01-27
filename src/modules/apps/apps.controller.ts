import { Body, Controller, Get, Post } from '@nestjs/common';
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
}