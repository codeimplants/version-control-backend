import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
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

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rules.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.rules.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.rules.remove(id);
    }

    @Patch(':id/toggle')
    toggle(@Param('id') id: string) {
        return this.rules.toggle(id);
    }
}