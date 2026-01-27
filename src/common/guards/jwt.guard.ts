import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private jwt: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new UnauthorizedException();

        try {
            const decoded = this.jwt.verify(token);
            req.user = decoded;
            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }
}