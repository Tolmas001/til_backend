import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AiMentorService } from './ai-mentor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai-mentor')
@UseGuards(JwtAuthGuard)
export class AiMentorController {
  constructor(private aiMentorService: AiMentorService) {}

  @Post('message/generate')
  async generateProactiveMessage(@Request() req) {
    return this.aiMentorService.generateProactiveMessage(req.user.id);
  }

  @Get('messages')
  async getMentorMessages(@Request() req, @Body() body: { unreadOnly?: boolean }) {
    return this.aiMentorService.getMentorMessages(req.user.id, body.unreadOnly || false);
  }

  @Put('message/:id/read')
  async markMessageAsRead(@Param('id') id: string) {
    return this.aiMentorService.markMessageAsRead(id);
  }

  @Put('message/:id/action')
  async markMessageAsActionTaken(@Param('id') id: string) {
    return this.aiMentorService.markMessageAsActionTaken(id);
  }

  @Post('emotion/analyze')
  async analyzeEmotion(@Request() req, @Body() body: { speechText: string; speechSpeed: number }) {
    return this.aiMentorService.analyzeUserEmotion(req.user.id, body.speechText, body.speechSpeed);
  }

  @Post('explain')
  async explainLikeIm10(@Request() req, @Body() body: { concept: string; targetAudience?: string }) {
    return this.aiMentorService.explainLikeIm10(req.user.id, body.concept, body.targetAudience);
  }
}
