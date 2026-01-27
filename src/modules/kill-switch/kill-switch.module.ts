import { Module } from '@nestjs/common';
import { KillSwitchController } from './kill-switch.controller';
import { KillSwitchService } from './kill-switch.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
    controllers: [KillSwitchController],
    providers: [KillSwitchService, PrismaService],
})
export class KillSwitchModule { }