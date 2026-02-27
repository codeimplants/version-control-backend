import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
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
import { User } from '../../common/decorators/user.decorator';

@Controller('admin/users')
@UseGuards(JwtGuard)
export class UsersController {
    constructor(private users: UsersService) { }

    /** Any authenticated user can update their own profile (name / password) */
    @Patch('me')
    updateSelf(
        @User() user: { id: string },
        @Body() dto: { name?: string; password?: string },
    ) {
        return this.users.updateSelf(user.id, dto);
    }

    // ── Admin-only routes ──────────────────────────────────────────────────

    @Get()
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    findAll() {
        return this.users.findAll();
    }

    @Get(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    findOne(@Param('id') id: string) {
        return this.users.findOne(id);
    }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    create(@Body() dto: CreateUserDto) {
        return this.users.create(dto);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.users.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id') id: string) {
        return this.users.remove(id);
    }

    @Put(':id/deactivate')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    deactivate(@Param('id') id: string) {
        return this.users.deactivate(id);
    }
}
