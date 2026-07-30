import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SpeechAnalyticsService } from './speech-analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('speech-analytics')
@UseGuards(JwtAuthGuard)
export class SpeechAnalyticsController {
  constructor(private speechAnalyticsService: SpeechAnalyticsService) {}

  @Post('analyze')
  async analyzeSpeech(@Request() req, @Body() body: { audioUrl: string; transcript: string }) {
    return this.speechAnalyticsService.analyzeSpeech(req.user.id, body.audioUrl, body.transcript);
  }

  @Get('history')
  async getSpeechHistory(@Request() req, @Body() body: { limit?: number }) {
    return this.speechAnalyticsService.getUserSpeechHistory(req.user.id, body.limit || 20);
  }

  @Get('weekly-report')
  async getWeeklyReport(@Request() req) {
    return this.speechAnalyticsService.getWeeklySpeechReport(req.user.id);
  }

  @Post('compare')
  async compareWithNative(@Request() req, @Body() body: { userTranscript: string; nativeTranscript: string }) {
    return this.speechAnalyticsService.compareWithNative(req.user.id, body.userTranscript, body.nativeTranscript);
  }
}
