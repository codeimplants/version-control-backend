import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class KillSwitchService {
    constructor(private prisma: PrismaService) { }

    toggle(ruleId: string, status: boolean) {
        return this.prisma.versionRule.update({
            where: { id: ruleId },
            data: { killSwitch: status },
        });
    }
}