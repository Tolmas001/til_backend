import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DailyMissionService } from './daily-mission.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('daily-mission')
@UseGuards(JwtAuthGuard)
export class DailyMissionController {
  constructor(private dailyMissionService: DailyMissionService) {}

  @Post('generate')
  async generateDailyMission(@Request() req) {
    return this.dailyMissionService.generateDailyMission(req.user.id);
  }

  @Get('today')
  async getTodayMission(@Request() req) {
    return this.dailyMissionService.getTodayMission(req.user.id);
  }

  @Put(':id/complete')
  async completeMission(@Request() req, @Param('id') id: string, @Body() body: { score: number }) {
    return this.dailyMissionService.completeMission(req.user.id, id, body.score);
  }

  @Get('history')
  async getMissionHistory(@Request() req, @Body() body: { limit?: number }) {
    return this.dailyMissionService.getMissionHistory(req.user.id, body.limit || 30);
  }

  @Get('stats')
  async getMissionStats(@Request() req) {
    return this.dailyMissionService.getMissionStats(req.user.id);
  }
}
