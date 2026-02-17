import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { User } from '../../common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) { }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.auth.login(body.email, body.password);
  }

  @Post('register')
  register(@Body() body: { email: string; password: string; name?: string }) {
    return this.auth.register(body);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  me(@User() user: { id: string }) {
    return this.auth.me(user.id);
  }
}