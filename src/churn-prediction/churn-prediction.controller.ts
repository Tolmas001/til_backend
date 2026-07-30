import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ChurnPredictionService } from './churn-prediction.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('churn-prediction')
@UseGuards(JwtAuthGuard)
export class ChurnPredictionController {
  constructor(private churnPredictionService: ChurnPredictionService) {}

  @Post('predict')
  async predictChurnRisk(@Request() req) {
    return this.churnPredictionService.predictChurnRisk(req.user.id);
  }

  @Get()
  async getChurnRisk(@Request() req) {
    return this.churnPredictionService.getChurnRisk(req.user.id);
  }

  @Post('intervention')
  async sendIntervention(@Request() req, @Body() body: { interventionType: string }) {
    return this.churnPredictionService.sendIntervention(req.user.id, body.interventionType);
  }

  @Get('high-risk')
  async getHighRiskUsers(@Body() body: { threshold?: number }) {
    return this.churnPredictionService.getHighRiskUsers(body.threshold || 60);
  }

  @Get('stats')
  async getChurnStats() {
    return this.churnPredictionService.getChurnStats();
  }
}
