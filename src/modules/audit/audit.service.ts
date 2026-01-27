import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    log(adminId: string, action: string, entity: string, payload: any) {
        return this.prisma.auditLog.create({
            data: { adminId, action, entity, payload },
        });
    }

    getAll() {
        return this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' } });
    }
}