import { Injectable, NotFoundException } from '@nestjs/common';
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

    async findOne(id: string) {
        const rule = await this.prisma.versionRule.findUnique({
            where: { id },
            include: { app: true },
        });
        if (!rule) throw new NotFoundException('Rule not found');
        return rule;
    }

    async update(id: string, data: any) {
        return this.prisma.versionRule.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.versionRule.delete({
            where: { id },
        });
    }

    async toggle(id: string) {
        const rule = await this.findOne(id);
        return this.prisma.versionRule.update({
            where: { id },
            data: { isActive: !rule.isActive },
        });
    }
}