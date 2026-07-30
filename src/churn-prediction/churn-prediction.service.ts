import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ChurnPredictionService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(ChurnPredictionService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // AI Risk Prediction - Churn Prediction
  async predictChurnRisk(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate factors
    const factors = await this.calculateChurnFactors(userId);

    // Calculate risk score
    const riskScore = this.calculateRiskScore(factors);

    // Determine risk level
    const riskLevel = this.getRiskLevel(riskScore);

    // Predict churn date
    const predictedChurnDate = this.predictChurnDate(riskScore, user.lastActiveAt);

    // Save or update churn risk
    const existing = await this.prisma.churnRisk.findUnique({
      where: { userId },
    });

    if (existing) {
      return this.prisma.churnRisk.update({
        where: { userId },
        data: {
          riskScore,
          riskLevel,
          predictedChurnDate,
          factors,
        },
      });
    }

    return this.prisma.churnRisk.create({
      data: {
        userId,
        riskScore,
        riskLevel,
        predictedChurnDate,
        factors,
      },
    });
  }

  private async calculateChurnFactors(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const now = new Date();
    const daysSinceLastActive = Math.floor((now.getTime() - user.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24));

    // Get recent activity
    const recentEvaluations = await this.prisma.skillEvaluation.count({
      where: {
        userId,
        evaluatedAt: {
          gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const recentMissions = await this.prisma.dailyMission.count({
      where: {
        userId,
        date: {
          gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const recentChats = await this.prisma.chat.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Calculate engagement score
    const engagementScore = (recentEvaluations * 2) + (recentMissions * 3) + (recentChats * 1);

    // Streak factor
    const streakFactor = user.streak > 0 ? 1 - (user.streak / 100) : 0.5;

    // XP growth
    const xpGrowth = user.xp > 0 ? 1 : 0.3;

    return {
      inactivity: Math.min(1, daysSinceLastActive / 30),
      lowEngagement: Math.max(0, 1 - (engagementScore / 20)),
      streak: streakFactor,
      xpGrowth: xpGrowth,
      daysSinceLastActive,
      engagementScore,
      recentEvaluations,
      recentMissions,
      recentChats,
    };
  }

  private calculateRiskScore(factors: any): number {
    const weights = {
      inactivity: 0.4,
      lowEngagement: 0.3,
      streak: 0.2,
      xpGrowth: 0.1,
    };

    const riskScore =
      (factors.inactivity * weights.inactivity) +
      (factors.lowEngagement * weights.lowEngagement) +
      ((1 - factors.streak) * weights.streak) +
      ((1 - factors.xpGrowth) * weights.xpGrowth);

    return Math.round(riskScore * 100);
  }

  private getRiskLevel(riskScore: number): string {
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 40) return 'medium';
    return 'low';
  }

  private predictChurnDate(riskScore: number, lastActiveAt: Date): Date | null {
    if (riskScore < 50) return null;

    const daysToChurn = Math.round((100 - riskScore) / 10);
    const churnDate = new Date(lastActiveAt.getTime() + daysToChurn * 24 * 60 * 60 * 1000);

    return churnDate;
  }

  async getChurnRisk(userId: string) {
    return this.prisma.churnRisk.findUnique({
      where: { userId },
    });
  }

  async sendIntervention(userId: string, interventionType: string) {
    const churnRisk = await this.prisma.churnRisk.findUnique({
      where: { userId },
    });

    if (!churnRisk) {
      throw new Error('Churn risk not found for user');
    }

    // Send intervention based on type
    switch (interventionType) {
      case 'bonus':
        await this.prisma.user.update({
          where: { id: userId },
          data: { coins: { increment: 50 } },
        });
        break;
      case 'mission':
        await this.prisma.mentorMessage.create({
          data: {
            userId,
            type: 'motivation',
            content: 'Sizni sog\'indik! Maxsus vazifa tayyorladik.',
            priority: 8,
          },
        });
        break;
      case 'reminder':
        await this.prisma.mentorMessage.create({
          data: {
            userId,
            type: 'reminder',
            content: 'Keling, davom etaylik. Siz yaxshi qilyapsiz!',
            priority: 6,
          },
        });
        break;
    }

    return this.prisma.churnRisk.update({
      where: { userId },
      data: {
        interventionSent: true,
        interventionType,
      },
    });
  }

  async getHighRiskUsers(threshold: number = 60) {
    return this.prisma.churnRisk.findMany({
      where: {
        riskScore: { gte: threshold },
        interventionSent: false,
      },
      include: {
        user: true,
      },
      orderBy: {
        riskScore: 'desc',
      },
    });
  }

  async getChurnStats() {
    const allRisks = await this.prisma.churnRisk.findMany();

    const total = allRisks.length;
    const critical = allRisks.filter((r) => r.riskLevel === 'critical').length;
    const high = allRisks.filter((r) => r.riskLevel === 'high').length;
    const medium = allRisks.filter((r) => r.riskLevel === 'medium').length;
    const low = allRisks.filter((r) => r.riskLevel === 'low').length;

    const avgRisk = total > 0 ? allRisks.reduce((sum, r) => sum + r.riskScore, 0) / total : 0;

    return {
      total,
      critical,
      high,
      medium,
      low,
      averageRisk: Math.round(avgRisk),
      distribution: {
        critical: total > 0 ? Math.round((critical / total) * 100) : 0,
        high: total > 0 ? Math.round((high / total) * 100) : 0,
        medium: total > 0 ? Math.round((medium / total) * 100) : 0,
        low: total > 0 ? Math.round((low / total) * 100) : 0,
      },
    };
  }
}
