import { Body, Controller, Get, Post } from '@nestjs/common';
import { RulesService } from './rules.service';

@Controller('admin/rules')
export class RulesController {
    constructor(private rules: RulesService) { }

    @Post()
    create(@Body() body: any) {
        return this.rules.create(body);
    }

    @Get()
    findAll() {
        return this.rules.findAll();
    }
}