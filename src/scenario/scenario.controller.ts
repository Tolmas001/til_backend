import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ScenarioService } from './scenario.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Level } from '@prisma/client';

@Controller('scenario')
@UseGuards(JwtAuthGuard)
export class ScenarioController {
  constructor(private scenarioService: ScenarioService) {}

  @Post('generate')
  async generateScenario(@Request() req, @Body() body: { context: string; level: Level }) {
    return this.scenarioService.generateScenario(req.user.id, body.context, body.level);
  }

  @Post(':id/start')
  async startScenario(@Request() req, @Param('id') id: string) {
    return this.scenarioService.startScenario(req.user.id, id);
  }

  @Post(':id/respond')
  async submitResponse(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { response: string; currentEvent: string },
  ) {
    return this.scenarioService.submitScenarioResponse(req.user.id, id, body.response, body.currentEvent);
  }

  @Put(':id/complete')
  async completeScenario(@Request() req, @Param('id') id: string, @Body() body: { finalScore: number }) {
    return this.scenarioService.completeScenario(req.user.id, id, body.finalScore);
  }

  @Get('available')
  async getAvailableScenarios(@Request() req, @Body() body: { level?: Level; context?: string }) {
    return this.scenarioService.getAvailableScenarios(body.level, body.context);
  }

  @Get('progress')
  async getUserProgress(@Request() req) {
    return this.scenarioService.getUserScenarioProgress(req.user.id);
  }
}
