import { Controller, Get, UseGuards, Request, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId || req.user.id || req.user.sub);
    if (!user) {
      return { error: 'User not found' };
    }
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() body: { name?: string; avatar?: string; level?: any }) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    const updated = await this.usersService.update(userId, body);
    const { password, ...result } = updated;
    return result;
  }
}
