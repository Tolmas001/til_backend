import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { CoachTimelineService } from './coach-timeline.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('coach-timeline')
@UseGuards(JwtAuthGuard)
export class CoachTimelineController {
  constructor(private coachTimelineService: CoachTimelineService) {}

  @Post('event')
  async createTimelineEvent(@Request() req, @Body() body: { eventType: string; description: string; metadata: any }) {
    return this.coachTimelineService.createTimelineEvent(req.user.id, body.eventType, body.description, body.metadata);
  }

  @Post('milestone')
  async logMilestone(@Request() req, @Body() body: { milestone: string; details: any }) {
    return this.coachTimelineService.logMilestone(req.user.id, body.milestone, body.details);
  }

  @Post('streak')
  async logStreak(@Request() req, @Body() body: { streak: number; details: any }) {
    return this.coachTimelineService.logStreak(req.user.id, body.streak, body.details);
  }

  @Post('improvement')
  async logImprovement(@Request() req, @Body() body: { skill: string; improvement: number; details: any }) {
    return this.coachTimelineService.logImprovement(req.user.id, body.skill, body.improvement, body.details);
  }

  @Post('setback')
  async logSetback(@Request() req, @Body() body: { reason: string; details: any }) {
    return this.coachTimelineService.logSetback(req.user.id, body.reason, body.details);
  }

  @Get('timeline')
  async getUserTimeline(@Request() req, @Body() body: { limit?: number }) {
    return this.coachTimelineService.getUserTimeline(req.user.id, body.limit || 50);
  }

  @Post('timeline/range')
  async getUserTimelineByDateRange(@Request() req, @Body() body: { startDate: string; endDate: string }) {
    return this.coachTimelineService.getUserTimelineByDateRange(req.user.id, new Date(body.startDate), new Date(body.endDate));
  }

  @Get('timeline/:eventType')
  async getTimelineByEventType(@Request() req, @Param('eventType') eventType: string) {
    return this.coachTimelineService.getTimelineByEventType(req.user.id, eventType);
  }

  @Get('analysis')
  async analyzeProgress(@Request() req, @Body() body: { days?: number }) {
    return this.coachTimelineService.analyzeProgress(req.user.id, body.days || 30);
  }

  @Get('weekly-report')
  async generateWeeklyReport(@Request() req) {
    return this.coachTimelineService.generateWeeklyReport(req.user.id);
  }

  @Get('stats')
  async getTimelineStats() {
    return this.coachTimelineService.getTimelineStats();
  }

  @Post('cleanup')
  async deleteOldEvents(@Body() body: { daysToKeep?: number }) {
    return this.coachTimelineService.deleteOldEvents(body.daysToKeep || 180);
  }
}
