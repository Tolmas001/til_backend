import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DataLakeService {
  private readonly logger = new Logger(DataLakeService.name);

  constructor(private prisma: PrismaService) {}

  // Learning Data Lake - Action Logging
  async logEvent(userId: string, eventType: string, metadata: any, sessionId?: string, deviceInfo?: string) {
    return this.prisma.learningEvent.create({
      data: {
        userId,
        eventType,
        metadata,
        sessionId,
        deviceInfo,
      },
    });
  }

  async logLessonStarted(userId: string, lessonId: string, sessionId?: string) {
    return this.logEvent(userId, 'lesson_started', { lessonId }, sessionId);
  }

  async logLessonCompleted(userId: string, lessonId: string, score: number, sessionId?: string) {
    return this.logEvent(userId, 'lesson_completed', { lessonId, score }, sessionId);
  }

  async logVoiceAttempt(userId: string, exerciseId: string, duration: number, sessionId?: string) {
    return this.logEvent(userId, 'voice_attempt', { exerciseId, duration }, sessionId);
  }

  async logGrammarError(userId: string, word: string, mistake: string, correction: string, sessionId?: string) {
    return this.logEvent(userId, 'grammar_error', { word, mistake, correction }, sessionId);
  }

  async logReview(userId: string, reviewId: string, sessionId?: string) {
    return this.logEvent(userId, 'review', { reviewId }, sessionId);
  }

  async logMission(userId: string, missionId: string, completed: boolean, score: number, sessionId?: string) {
    return this.logEvent(userId, 'mission', { missionId, completed, score }, sessionId);
  }

  async logConversation(userId: string, conversationId: string, messageCount: number, sessionId?: string) {
    return this.logEvent(userId, 'conversation', { conversationId, messageCount }, sessionId);
  }

  async getUserEvents(userId: string, eventType?: string, limit: number = 100) {
    const where: any = { userId };
    if (eventType) {
      where.eventType = eventType;
    }

    return this.prisma.learningEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getUserEventsByDateRange(userId: string, startDate: Date, endDate: Date) {
    return this.prisma.learningEvent.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getEventTypeStats(userId: string) {
    const events = await this.prisma.learningEvent.findMany({
      where: { userId },
    });

    const stats: Record<string, number> = {};
    events.forEach((e) => {
      stats[e.eventType] = (stats[e.eventType] || 0) + 1;
    });

    return stats;
  }

  async getDailyActivity(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const events = await this.prisma.learningEvent.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const dailyStats: Record<string, number> = {};
    events.forEach((e) => {
      const date = e.createdAt.toISOString().split('T')[0];
      dailyStats[date] = (dailyStats[date] || 0) + 1;
    });

    return dailyStats;
  }

  async getSessionEvents(sessionId: string) {
    return this.prisma.learningEvent.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getGlobalStats() {
    const events = await this.prisma.learningEvent.findMany();

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

  async deleteOldEvents(daysToKeep: number = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.prisma.learningEvent.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    this.logger.log(`Deleted ${result.count} old events`);
    return result;
  }
}
