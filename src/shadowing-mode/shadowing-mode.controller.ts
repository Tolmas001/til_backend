import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ShadowingModeService } from './shadowing-mode.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('shadowing-mode')
@UseGuards(JwtAuthGuard)
export class ShadowingModeController {
  constructor(private shadowingModeService: ShadowingModeService) {}

  @Post('session')
  async createShadowingSession(@Request() req, @Body() body: { level: string; topic?: string }) {
    return this.shadowingModeService.createShadowingSession(req.user.id, body.level, body.topic);
  }

  @Post('recording')
  async submitRecording(@Request() req, @Body() body: { sessionId: string; phraseId: number; audioUrl: string }) {
    return this.shadowingModeService.submitRecording(req.user.id, body.sessionId, body.phraseId, body.audioUrl);
  }

  @Post('complete')
  async completeSession(@Request() req, @Body() body: { sessionId: string }) {
    return this.shadowingModeService.completeSession(req.user.id, body.sessionId);
  }

  @Get('session/:id')
  async getSession(@Param('id') sessionId: string) {
    return this.shadowingModeService.getSession(sessionId);
  }

  @Get('sessions')
  async getUserSessions(@Request() req, @Body() body: { limit?: number }) {
    return this.shadowingModeService.getUserSessions(req.user.id, body.limit || 20);
  }

  @Get('stats')
  async getSessionStats() {
    return this.shadowingModeService.getSessionStats();
  }
}
