import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin/users')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
    constructor(private users: UsersService) {}

    @Get()
    findAll() {
        return this.users.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.users.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.users.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.users.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.users.remove(id);
    }

    @Put(':id/deactivate')
    deactivate(@Param('id') id: string) {
        return this.users.deactivate(id);
    }
}
