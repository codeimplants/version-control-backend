import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AppsService {
    constructor(private prisma: PrismaService) { }

    create(data: any) {
        return this.prisma.app.create({
            data: {
                ...data,
                apiKey: uuid(),
            },
        });
    }

    findAll() {
        return this.prisma.app.findMany();
    }
}