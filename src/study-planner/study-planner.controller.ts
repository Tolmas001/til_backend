import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { StudyPlannerService } from './study-planner.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('study-planner')
@UseGuards(JwtAuthGuard)
export class StudyPlannerController {
  constructor(private studyPlannerService: StudyPlannerService) {}

  @Post('create')
  async createStudyPlan(@Request() req, @Body() body: { goal: string; targetDate: string }) {
    return this.studyPlannerService.createStudyPlan(req.user.id, body.goal, body.targetDate);
  }

  @Get()
  async getStudyPlan(@Request() req) {
    return this.studyPlannerService.getStudyPlan(req.user.id);
  }

  @Put(':id/progress')
  async updateProgress(@Request() req, @Param('id') id: string, @Body() body: { progress: number }) {
    return this.studyPlannerService.updateStudyProgress(req.user.id, id, body.progress);
  }

  @Put(':id/recalculate')
  async recalculatePlan(@Request() req, @Param('id') id: string) {
    return this.studyPlannerService.recalculatePlan(req.user.id, id);
  }
}
