import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
    id: string;
    email: string;
    role: string;
}

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private jwt: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const token = req.headers.authorization?.replace(/^Bearer\s+/i, '') || req.headers.authorization?.split(' ')[1];
        if (!token) throw new UnauthorizedException('Missing or invalid token');

        try {
            const decoded = this.jwt.verify<JwtPayload>(token);
            req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}