import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RulesService {
    constructor(private prisma: PrismaService) { }

    create(data: any) {
        return this.prisma.versionRule.create({ data });
    }

    findAll() {
        return this.prisma.versionRule.findMany({ include: { app: true } });
    }
}