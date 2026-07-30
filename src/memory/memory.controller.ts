import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MemoryService } from './memory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('memory')
@UseGuards(JwtAuthGuard)
export class MemoryController {
  constructor(private memoryService: MemoryService) {}

  @Post('mistake')
  async recordMistake(@Request() req, @Body() body: { word: string; mistake: string; correction: string; context?: string }) {
    return this.memoryService.recordMistake(req.user.id, body.word, body.mistake, body.correction, body.context);
  }

  @Get('mistakes')
  async getWordMistakes(@Request() req, @Body() body: { word?: string }) {
    return this.memoryService.getWordMistakes(req.user.id, body.word);
  }

  @Get('mistakes/recurring')
  async getRecurringMistakes(@Request() req) {
    return this.memoryService.getRecurringMistakes(req.user.id);
  }

  @Get('mistakes/:word/timeline')
  async getMistakeTimeline(@Request() req, @Param('word') word: string) {
    return this.memoryService.getMistakeTimeline(req.user.id, word);
  }

  @Post('explain')
  async explainMistake(@Request() req, @Body() body: { original: string; corrected: string }) {
    return this.memoryService.explainMistake(req.user.id, body.original, body.corrected);
  }

  @Get('explanations')
  async getMistakeExplanations(@Request() req) {
    return this.memoryService.getMistakeExplanations(req.user.id);
  }

  @Put('explanation/:id/review')
  async markExplanationAsReviewed(@Param('id') id: string) {
    return this.memoryService.markExplanationAsReviewed(id);
  }

  @Post('review/generate')
  async generateReviewSession(@Request() req, @Body() body: { type: 'forgotten_words' | 'difficult_grammar' | 'dialog_review' }) {
    return this.memoryService.generateReviewSession(req.user.id, body.type);
  }

  @Put('review/:id/complete')
  async completeReviewSession(@Param('id') id: string, @Body() body: { score: number }) {
    return this.memoryService.completeReviewSession(id, body.score);
  }

  @Get('reviews')
  async getReviewSessions(@Request() req) {
    return this.memoryService.getReviewSessions(req.user.id);
  }
}
