import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) { }

    async login(email: string, password: string) {
        const admin = await this.prisma.admin.findUnique({ where: { email } });
        if (!admin) throw new UnauthorizedException('Invalid credentials');

        const match = await bcrypt.compare(password, admin.password);
        if (!match) throw new UnauthorizedException('Invalid credentials');

        const token = this.jwt.sign({ id: admin.id, email: admin.email });

        return {
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name
            }
        };
    }

    async register(data: { email: string; password: string; name?: string }) {
        const exists = await this.prisma.admin.findUnique({
            where: { email: data.email }
        });

        if (exists) {
            throw new ConflictException('Admin already exists');
        }

        const hash = await bcrypt.hash(data.password, 12);

        const admin = await this.prisma.admin.create({
            data: {
                email: data.email,
                password: hash,
                name: data.name || 'Admin'
            }
        });

        const token = this.jwt.sign({ id: admin.id, email: admin.email });

        return {
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name
            }
        };
    }
}
