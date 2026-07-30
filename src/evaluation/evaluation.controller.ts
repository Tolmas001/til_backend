import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('evaluation')
@UseGuards(JwtAuthGuard)
export class EvaluationController {
  constructor(private evaluationService: EvaluationService) {}

  @Post('exercise')
  async evaluateExercise(@Request() req, @Body() body: { exerciseId: string; exerciseType: string; userResponse: string; expectedResponse?: string }) {
    return this.evaluationService.evaluateExercise(req.user.id, body.exerciseId, body.exerciseType, body.userResponse, body.expectedResponse);
  }

  @Get('history')
  async getUserEvaluations(@Request() req, @Body() body: { limit?: number }) {
    return this.evaluationService.getUserEvaluations(req.user.id, body.limit || 20);
  }

  @Get('average')
  async getAverageScores(@Request() req) {
    return this.evaluationService.getAverageScores(req.user.id);
  }

  @Post('cefr/map')
  async mapCefrLevels(@Request() req) {
    return this.evaluationService.mapCefrLevels(req.user.id);
  }

  @Get('cefr')
  async getCefrLevels(@Request() req) {
    return this.evaluationService.getCefrLevels(req.user.id);
  }

  @Post('evidence/track')
  async trackLearningEvidence(@Request() req, @Body() body: { level: string; exerciseType: string }) {
    return this.evaluationService.trackLearningEvidence(req.user.id, body.level, body.exerciseType);
  }

  @Get('evidence')
  async getLearningEvidence(@Request() req, @Body() body: { level?: string }) {
    return this.evaluationService.getLearningEvidence(req.user.id, body.level);
  }

  @Get('evidence/:level/:skill/check')
  async checkLevelCompletion(@Request() req, @Param('level') level: string, @Param('skill') skill: string) {
    return this.evaluationService.checkLevelCompletion(req.user.id, level, skill);
  }
}
