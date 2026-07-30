import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name?: string }) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user.email, req.user.password);
  }

  @Post('google')
  async googleLogin(@Body() body: { googleId: string; email: string; name?: string; avatar?: string }) {
    return this.authService.googleLogin(body.googleId, body.email, body.name, body.avatar);
  }

  @Post('apple')
  async appleLogin(@Body() body: { appleId: string; email: string; name?: string }) {
    return this.authService.appleLogin(body.appleId, body.email, body.name);
  }
}
