import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../database/prisma.service';
import { JwtGuard } from '../../common/guards/jwt.guard';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'change-me-in-production',
            signOptions: { expiresIn: '7d' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, JwtGuard],
    exports: [JwtModule, JwtGuard],
})
export class AuthModule { }
