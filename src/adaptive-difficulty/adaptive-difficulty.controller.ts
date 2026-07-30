import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AdaptiveDifficultyService } from './adaptive-difficulty.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('adaptive-difficulty')
@UseGuards(JwtAuthGuard)
export class AdaptiveDifficultyController {
  constructor(private adaptiveDifficultyService: AdaptiveDifficultyService) {}

  @Post('answer')
  async recordAnswer(@Request() req, @Body() body: { isCorrect: boolean }) {
    return this.adaptiveDifficultyService.recordAnswer(req.user.id, body.isCorrect);
  }

  @Get()
  async getUserDifficulty(@Request() req) {
    return this.adaptiveDifficultyService.getUserDifficulty(req.user.id);
  }

  @Post('reset')
  async resetUserDifficulty(@Request() req) {
    return this.adaptiveDifficultyService.resetUserDifficulty(req.user.id);
  }

  @Get('stats')
  async getDifficultyStats(@Request() req) {
    return this.adaptiveDifficultyService.getDifficultyStats(req.user.id);
  }
}
