import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { RulesService } from './rules.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RuleAccessGuard } from '../../common/guards/rule-access.guard';
import { BodyAppAccessGuard } from '../../common/guards/body-app-access.guard';
import { User } from '../../common/decorators/user.decorator';

@Controller('admin/rules')
@UseGuards(JwtGuard)
export class RulesController {
    constructor(private rules: RulesService) { }

    @Post()
    @UseGuards(BodyAppAccessGuard)
    create(@Body() body: any) {
        return this.rules.create(body);
    }

    @Get()
    findAll(@User() user: { id: string; role: string }) {
        return this.rules.findAll({ userId: user.id, role: user.role });
    }

    @Get(':id')
    @UseGuards(RuleAccessGuard)
    findOne(@Param('id') id: string) {
        return this.rules.findOne(id);
    }

    @Put(':id')
    @UseGuards(RuleAccessGuard)
    update(@Param('id') id: string, @Body() body: any) {
        return this.rules.update(id, body);
    }

    @Delete(':id')
    @UseGuards(RuleAccessGuard)
    remove(@Param('id') id: string) {
        return this.rules.remove(id);
    }

    @Patch(':id/toggle')
    @UseGuards(RuleAccessGuard)
    toggle(@Param('id') id: string) {
        return this.rules.toggle(id);
    }
}