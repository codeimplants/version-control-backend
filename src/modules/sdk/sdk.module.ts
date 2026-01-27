import { Module } from '@nestjs/common';
import { SdkController } from './sdk.controller';
import { SdkService } from './sdk.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
    controllers: [SdkController],
    providers: [SdkService, PrismaService],
})
export class SdkModule { }
