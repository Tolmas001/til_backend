import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('gamification')
export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  @Get('leaderboard')
  async getLeaderboard() {
    return this.gamificationService.getLeaderboard();
  }

  @UseGuards(JwtAuthGuard)
  @Get('daily-quests')
  async getDailyQuests(@Request() req) {
    return this.gamificationService.getDailyQuests(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('achievements')
  async getAchievements(@Request() req) {
    return this.gamificationService.getAchievements(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('story-locations')
  async getStoryLocations(@Request() req) {
    return this.gamificationService.getStoryLocations(req.user.id);
  }
}
