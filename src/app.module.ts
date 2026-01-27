import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AppsModule } from './modules/apps/apps.module';
import { RulesModule } from './modules/rules/rules.module';
import { SdkModule } from './modules/sdk/sdk.module';
import { PrismaService } from './database/prisma.service';

@Module({
    imports: [AuthModule, AppsModule, RulesModule, SdkModule],
    providers: [PrismaService],
})
export class AppModule { }
