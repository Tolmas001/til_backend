import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AiLearningService } from './ai-learning.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CareerGoal } from '@prisma/client';

@Controller('ai-learning')
@UseGuards(JwtAuthGuard)
export class AiLearningController {
  constructor(private aiLearningService: AiLearningService) {}

  @Get('assessment')
  async assessUser(@Request() req) {
    return this.aiLearningService.assessUserLevel(req.user.id);
  }

  @Get('plan')
  async getPersonalizedPlan(@Request() req) {
    return this.aiLearningService.generatePersonalizedPlan(req.user.id);
  }

  @Put('career-goal')
  async setCareerGoal(@Request() req, @Body() body: { goal: CareerGoal }) {
    return this.aiLearningService.setCareerGoal(req.user.id, body.goal);
  }

  @Get('learning-style')
  async detectLearningStyle(@Request() req) {
    return this.aiLearningService.detectLearningStyle(req.user.id);
  }

  @Get('knowledge-graph')
  async getKnowledgeGraph(@Request() req) {
    return this.aiLearningService.getKnowledgeGraph(req.user.id);
  }

  @Post('knowledge/:topic')
  async updateKnowledgeNode(
    @Request() req,
    @Param('topic') topic: string,
    @Body() body: { mastery: number },
  ) {
    return this.aiLearningService.updateKnowledgeNode(req.user.id, topic, body.mastery);
  }
}
