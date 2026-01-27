import { Module } from '@nestjs/common';
import { AppsController } from './apps.controller';
import { AppsService } from './apps.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
    controllers: [AppsController],
    providers: [AppsService, PrismaService],
})
export class AppsModule { }
