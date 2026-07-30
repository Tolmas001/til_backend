import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LearningReplayService } from './learning-replay.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('learning-replay')
@UseGuards(JwtAuthGuard)
export class LearningReplayController {
  constructor(private learningReplayService: LearningReplayService) {}

  @Post('generate')
  async generateWeeklyReport(@Request() req, @Body() body: { startDate: string; endDate: string }) {
    return this.learningReplayService.generateWeeklyReport(req.user.id, new Date(body.startDate), new Date(body.endDate));
  }

  @Get(':id')
  async getReport(@Param('id') reportId: string) {
    return this.learningReplayService.getReport(reportId);
  }

  @Get('my')
  async getUserReports(@Request() req, @Body() body: { limit?: number }) {
    return this.learningReplayService.getUserReports(req.user.id, body.limit || 20);
  }

  @Get('latest')
  async getLatestReport(@Request() req) {
    return this.learningReplayService.getLatestReport(req.user.id);
  }

  @Get('stats')
  async getReportStats() {
    return this.learningReplayService.getReportStats();
  }
}
