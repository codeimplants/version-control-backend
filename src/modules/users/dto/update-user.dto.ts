import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from './create-user.dto';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters if provided' })
    password?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEnum(UserRole, { message: 'Role must be ADMIN or COLLABORATOR' })
    role?: UserRole;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
