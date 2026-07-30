import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DataLakeService } from './data-lake.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('data-lake')
@UseGuards(JwtAuthGuard)
export class DataLakeController {
  constructor(private dataLakeService: DataLakeService) {}

  @Post('log')
  async logEvent(@Request() req, @Body() body: { eventType: string; metadata: any; sessionId?: string; deviceInfo?: string }) {
    return this.dataLakeService.logEvent(req.user.id, body.eventType, body.metadata, body.sessionId, body.deviceInfo);
  }

  @Get('events')
  async getUserEvents(@Request() req, @Body() body: { eventType?: string; limit?: number }) {
    return this.dataLakeService.getUserEvents(req.user.id, body.eventType, body.limit || 100);
  }

  @Post('events/range')
  async getUserEventsByDateRange(@Request() req, @Body() body: { startDate: string; endDate: string }) {
    return this.dataLakeService.getUserEventsByDateRange(req.user.id, new Date(body.startDate), new Date(body.endDate));
  }

  @Get('stats')
  async getEventTypeStats(@Request() req) {
    return this.dataLakeService.getEventTypeStats(req.user.id);
  }

  @Get('daily-activity')
  async getDailyActivity(@Request() req, @Body() body: { days?: number }) {
    return this.dataLakeService.getDailyActivity(req.user.id, body.days || 30);
  }

  @Get('session/:sessionId')
  async getSessionEvents(@Param('sessionId') sessionId: string) {
    return this.dataLakeService.getSessionEvents(sessionId);
  }

  @Get('global-stats')
  async getGlobalStats() {
    return this.dataLakeService.getGlobalStats();
  }

  @Post('cleanup')
  async deleteOldEvents(@Body() body: { daysToKeep?: number }) {
    return this.dataLakeService.deleteOldEvents(body.daysToKeep || 90);
  }
}
