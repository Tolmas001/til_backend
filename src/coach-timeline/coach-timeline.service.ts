import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CoachTimelineService {
  private readonly logger = new Logger(CoachTimelineService.name);

  constructor(private prisma: PrismaService) {}

  // AI Coach Timeline - Time-based progress analysis
  async createTimelineEvent(userId: string, eventType: string, description: string, metadata: any) {
    return this.prisma.timelineEvent.create({
      data: {
        userId,
        eventType,
        description,
        metadata,
        date: new Date(),
      },
    });
  }

  async logMilestone(userId: string, milestone: string, details: any) {
    return this.createTimelineEvent(userId, 'milestone', milestone, details);
  }

  async logStreak(userId: string, streak: number, details: any) {
    return this.createTimelineEvent(userId, 'streak', `${streak} day streak`, { streak, ...details });
  }

  async logImprovement(userId: string, skill: string, improvement: number, details: any) {
    return this.createTimelineEvent(userId, 'improvement', `${skill} improved by ${improvement}%`, { skill, improvement, ...details });
  }

  async logSetback(userId: string, reason: string, details: any) {
    return this.createTimelineEvent(userId, 'setback', reason, details);
  }

  async getUserTimeline(userId: string, limit: number = 50) {
    return this.prisma.timelineEvent.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }

  async getUserTimelineByDateRange(userId: string, startDate: Date, endDate: Date) {
    return this.prisma.timelineEvent.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getTimelineByEventType(userId: string, eventType: string) {
    return this.prisma.timelineEvent.findMany({
      where: {
        userId,
        eventType,
      },
      orderBy: { date: 'desc' },
    });
  }

  async analyzeProgress(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await this.prisma.timelineEvent.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    const milestones = events.filter((e) => e.eventType === 'milestone').length;
    const streaks = events.filter((e) => e.eventType === 'streak').length;
    const improvements = events.filter((e) => e.eventType === 'improvement').length;
    const setbacks = events.filter((e) => e.eventType === 'setback').length;

    const dailyActivity: Record<string, number> = {};
    events.forEach((e) => {
      const date = e.date.toISOString().split('T')[0];
      dailyActivity[date] = (dailyActivity[date] || 0) + 1;
    });

    const improvementRate = improvements > 0 ? Math.round((improvements / (improvements + setbacks)) * 100) : 0;

    return {
      totalEvents: events.length,
      milestones,
      streaks,
      improvements,
      setbacks,
      improvementRate,
      dailyActivity,
      averageDailyEvents: Math.round(events.length / days),
    };
  }

  async generateWeeklyReport(userId: string) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const events = await this.prisma.timelineEvent.findMany({
      where: {
        userId,
        date: {
          gte: oneWeekAgo,
        },
      },
      orderBy: { date: 'asc' },
    });

    const progress = await this.analyzeProgress(userId, 7);

    return {
      weekStart: oneWeekAgo,
      weekEnd: new Date(),
      totalEvents: events.length,
      milestones: events.filter((e) => e.eventType === 'milestone'),
      improvements: events.filter((e) => e.eventType === 'improvement'),
      setbacks: events.filter((e) => e.eventType === 'setback'),
      streaks: events.filter((e) => e.eventType === 'streak'),
      progress,
    };
  }

  async getTimelineStats() {
    const events = await this.prisma.timelineEvent.findMany();

    const total = events.length;
    const eventTypeStats: Record<string, number> = {};
    events.forEach((e) => {
      eventTypeStats[e.eventType] = (eventTypeStats[e.eventType] || 0) + 1;
    });

    const uniqueUsers = new Set(events.map((e) => e.userId)).size;

    return {
      totalEvents: total,
      uniqueUsers,
      eventTypeStats,
      averageEventsPerUser: uniqueUsers > 0 ? Math.round(total / uniqueUsers) : 0,
    };
  }

  async deleteOldEvents(daysToKeep: number = 180) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.prisma.timelineEvent.deleteMany({
      where: {
        date: {
          lt: cutoffDate,
        },
      },
    });

    this.logger.log(`Deleted ${result.count} old timeline events`);
    return result;
  }
}
