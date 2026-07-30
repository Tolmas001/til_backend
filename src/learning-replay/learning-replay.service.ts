import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class LearningReplayService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(LearningReplayService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // Learning Replay - Weekly video reports
  async generateWeeklyReport(userId: string, startDate: Date, endDate: Date) {
    if (!this.openai) {
      return this.generateFallbackReport(userId, startDate, endDate);
    }

    try {
      // Get user's learning data for the week
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      const lessonProgress = await this.prisma.lessonProgress.findMany({
        where: {
          userId,
          completedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const chatMessages = await this.prisma.chatMessage.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const evaluations = await this.prisma.skillEvaluation.findMany({
        where: {
          userId,
          evaluatedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Generate a weekly learning replay report for Russian language learning.
User: ${user.name}
Level: ${user.level}
XP gained: ${user.xp}
Lessons completed: ${lessonProgress.length}
Chat messages: ${chatMessages.length}
Evaluations: ${evaluations.length}

Return JSON format:
{
  "report": {
    "title": "Weekly Learning Report",
    "period": "Week of ${startDate.toISOString().split('T')[0]}",
    "summary": "Brief summary of the week",
    "highlights": ["highlight 1", "highlight 2"],
    "achievements": ["achievement 1", "achievement 2"],
    "areasToImprove": ["area 1", "area 2"],
    "recommendations": ["recommendation 1", "recommendation 2"],
    "nextWeekGoals": ["goal 1", "goal 2"]
  },
  "stats": {
    "lessonsCompleted": ${lessonProgress.length},
    "chatMessages": ${chatMessages.length},
    "evaluations": ${evaluations.length},
    "averageScore": ${evaluations.length > 0 ? Math.round(evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length) : 0},
    "xpGained": ${user.xp}
  }
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');

      const report = await this.prisma.learningReplay.create({
        data: {
          userId,
          startDate,
          endDate,
          report: parsed.report,
          stats: parsed.stats,
          generatedAt: new Date(),
        },
      });

      return report;
    } catch (err) {
      this.logger.error('AI weekly report generation failed, using fallback', err.message);
      return this.generateFallbackReport(userId, startDate, endDate);
    }
  }

  private async generateFallbackReport(userId: string, startDate: Date, endDate: Date) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const lessonProgress = await this.prisma.lessonProgress.findMany({
      where: {
        userId,
        completedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const fallbackReport = {
      title: 'Weekly Learning Report',
      period: `Week of ${startDate.toISOString().split('T')[0]}`,
      summary: `${user.name} completed ${lessonProgress.length} lessons this week`,
      highlights: [
        `${lessonProgress.length} lessons completed`,
        'Consistent learning activity',
        'Good progress in vocabulary',
      ],
      achievements: [
        'Completed weekly learning goal',
        'Maintained learning streak',
      ],
      areasToImprove: [
        'Practice speaking more',
        'Review grammar rules',
      ],
      recommendations: [
        'Continue daily practice',
        'Focus on pronunciation',
      ],
      nextWeekGoals: [
        'Complete 5 more lessons',
        'Practice speaking exercises',
      ],
    };

    const fallbackStats = {
      lessonsCompleted: lessonProgress.length,
      chatMessages: 0,
      evaluations: 0,
      averageScore: 0,
      xpGained: user.xp,
    };

    const report = await this.prisma.learningReplay.create({
      data: {
        userId,
        startDate,
        endDate,
        report: fallbackReport,
        stats: fallbackStats,
        generatedAt: new Date(),
      },
    });

    return report;
  }

  async getReport(reportId: string) {
    return this.prisma.learningReplay.findUnique({
      where: { id: reportId },
    });
  }

  async getUserReports(userId: string, limit: number = 20) {
    return this.prisma.learningReplay.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
      take: limit,
    });
  }

  async getLatestReport(userId: string) {
    return this.prisma.learningReplay.findFirst({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
    });
  }

  async getReportStats() {
    const reports = await this.prisma.learningReplay.findMany();

    const total = reports.length;
    const uniqueUsers = new Set(reports.map((r) => r.userId)).size;

    return {
      totalReports: total,
      uniqueUsers,
      averageReportsPerUser: uniqueUsers > 0 ? Math.round(total / uniqueUsers) : 0,
    };
  }
}
