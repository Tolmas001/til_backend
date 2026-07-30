import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PlacementTestService } from './placement-test.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('placement-test')
@UseGuards(JwtAuthGuard)
export class PlacementTestController {
  constructor(private placementTestService: PlacementTestService) {}

  @Post('generate')
  async generatePlacementTest(@Request() req) {
    return this.placementTestService.generatePlacementTest(req.user.id);
  }

  @Post('submit')
  async submitPlacementTest(@Request() req, @Body() body: { grammar: string; listening: string; speaking: string; vocabulary: number; pronunciation: number }) {
    return this.placementTestService.submitPlacementTest(req.user.id, body);
  }

  @Get()
  async getPlacementTestResult(@Request() req) {
    return this.placementTestService.getPlacementTestResult(req.user.id);
  }

  @Post('retake')
  async retakePlacementTest(@Request() req) {
    return this.placementTestService.retakePlacementTest(req.user.id);
  }
}
