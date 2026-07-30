import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { LessonStudioService } from './lesson-studio.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('lesson-studio')
@UseGuards(JwtAuthGuard)
export class LessonStudioController {
  constructor(private lessonStudioService: LessonStudioService) {}

  @Post('generate')
  async generateFullLesson(@Request() req, @Body() body: { prompt: string; level: string }) {
    return this.lessonStudioService.generateFullLesson(req.user.id, body.prompt, body.level);
  }

  @Get('templates')
  async getLessonTemplates() {
    return this.lessonStudioService.getLessonTemplates();
  }

  @Get('stats')
  async getLessonStats() {
    return this.lessonStudioService.getLessonStats();
  }
}
