import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { PrismaService } from '../../database/prisma.service';
import { AuditModule } from '../audit/audit.module';

@Module({
    imports: [AuditModule],
    controllers: [RulesController],
    providers: [RulesService, PrismaService],
})
export class RulesModule { }