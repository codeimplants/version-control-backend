import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) { }

    async login(email: string, password: string) {
        const admin = await this.prisma.admin.findUnique({ where: { email } });
        if (!admin) throw new UnauthorizedException('Invalid credentials');

        const match = await bcrypt.compare(password, admin.password);
        if (!match) throw new UnauthorizedException('Invalid credentials');

        const token = this.jwt.sign({ id: admin.id, email: admin.email });
        return { token };
    }
}
