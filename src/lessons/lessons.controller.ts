import { Controller, Get, Post, Param, Query, UseGuards, Request, Body } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Level } from '@prisma/client';

@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get()
  async getLessons(@Query('level') level?: Level) {
    return this.lessonsService.findAll(level);
  }

  @Get(':id')
  async getLesson(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  async completeLesson(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { score?: number },
  ) {
    const userId = req.user.id;
    return this.lessonsService.completeLesson(userId, id, body?.score || 100);
  }
}
