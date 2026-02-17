import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) { }

    private normalizeRole(role: string): 'ADMIN' | 'COLLABORATOR' {
        if (role === 'COLLABORATOR') return 'COLLABORATOR';
        return 'ADMIN'; // SUPER_ADMIN or any other -> ADMIN
    }

    private toUserPayload(admin: { id: string; email: string; name: string | null; role: string }) {
        return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: this.normalizeRole(admin.role),
        };
    }

    private signToken(admin: { id: string; email: string; role: string }) {
        return this.jwt.sign({
            id: admin.id,
            email: admin.email,
            role: this.normalizeRole(admin.role),
        });
    }

    async login(email: string, password: string) {
        const admin = await this.prisma.admin.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, password: true, role: true, isActive: true },
        });
        if (!admin) throw new UnauthorizedException('Invalid credentials');
        if (!admin.isActive) throw new UnauthorizedException('Account is deactivated');

        const match = await bcrypt.compare(password, admin.password);
        if (!match) throw new UnauthorizedException('Invalid credentials');

        const token = this.signToken(admin);
        const { password: _, isActive: __, ...rest } = admin;
        return {
            token,
            user: this.toUserPayload(rest),
        };
    }

    async register(data: { email: string; password: string; name?: string }) {
        const exists = await this.prisma.admin.findUnique({
            where: { email: data.email }
        });
        if (exists) throw new ConflictException('User with this email already exists');

        const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
        const admin = await this.prisma.admin.create({
            data: {
                email: data.email,
                password: hash,
                name: data.name ?? 'Admin',
                role: 'ADMIN',
            },
            select: { id: true, email: true, name: true, role: true },
        });

        const token = this.signToken(admin);
        return {
            token,
            user: this.toUserPayload(admin),
        };
    }

    async me(userId: string) {
        const admin = await this.prisma.admin.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, role: true, isActive: true },
        });
        if (!admin || !admin.isActive) throw new UnauthorizedException('User not found or deactivated');
        return this.toUserPayload(admin);
    }
}
