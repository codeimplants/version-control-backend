import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { PrismaService } from '../../database/prisma.service';
import { AuditModule } from '../audit/audit.module';
import { AuthModule } from '../auth/auth.module';
import { RuleAccessGuard } from '../../common/guards/rule-access.guard';
import { BodyAppAccessGuard } from '../../common/guards/body-app-access.guard';

@Module({
    imports: [AuditModule, AuthModule],
    controllers: [RulesController],
    providers: [RulesService, PrismaService, RuleAccessGuard, BodyAppAccessGuard],
})
export class RulesModule { }