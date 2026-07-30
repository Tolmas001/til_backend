import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AiInterviewService } from './ai-interview.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai-interview')
@UseGuards(JwtAuthGuard)
export class AiInterviewController {
  constructor(private aiInterviewService: AiInterviewService) {}

  @Post('generate')
  async generateInterview(@Request() req, @Body() body: { jobType: string; level: string }) {
    return this.aiInterviewService.generateInterview(req.user.id, body.jobType, body.level);
  }

  @Post('submit-answer')
  async submitAnswer(@Request() req, @Body() body: { interviewId: string; questionId: number; answer: string; audioUrl?: string }) {
    return this.aiInterviewService.submitAnswer(req.user.id, body.interviewId, body.questionId, body.answer, body.audioUrl);
  }

  @Post('complete')
  async completeInterview(@Request() req, @Body() body: { interviewId: string }) {
    return this.aiInterviewService.completeInterview(req.user.id, body.interviewId);
  }

  @Get(':id')
  async getInterview(@Param('id') interviewId: string) {
    return this.aiInterviewService.getInterview(interviewId);
  }

  @Get('my')
  async getUserInterviews(@Request() req, @Body() body: { limit?: number }) {
    return this.aiInterviewService.getUserInterviews(req.user.id, body.limit || 20);
  }

  @Get('stats')
  async getInterviewStats() {
    return this.aiInterviewService.getInterviewStats();
  }
}
