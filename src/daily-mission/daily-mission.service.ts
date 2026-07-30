import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class DailyMissionService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(DailyMissionService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // Daily Mission Generator - Unique Daily Tasks
  async generateDailyMission(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if mission already exists for today
    const existingMission = await this.prisma.dailyMission.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });

    if (existingMission) {
      return existingMission;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!this.openai) {
      return this.generateFallbackMission(userId, user.level);
    }

    try {
      const contexts = ['restaurant', 'hotel', 'airport', 'shopping', 'doctor', 'bank', 'taxi'];
      const randomContext = contexts[Math.floor(Math.random() * contexts.length)];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Generate a unique daily mission for Russian language learning.
User level: ${user.level}
Context: ${randomContext}

Return JSON format:
{
  "mission": "Specific mission description in Uzbek",
  "context": "${randomContext}",
  "objectives": ["objective 1", "objective 2"],
  "estimatedMinutes": 15
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');

      const mission = await this.prisma.dailyMission.create({
        data: {
          userId,
          date: today,
          mission: parsed.mission,
          context: parsed.context,
          completed: false,
        },
      });

      return mission;
    } catch (err) {
      this.logger.error('AI mission generation failed, using fallback', err.message);
      return this.generateFallbackMission(userId, user.level);
    }
  }

  private async generateFallbackMission(userId: string, level: string) {
    const missions = [
      {
        mission: 'Bugun restoranda ovqat buyurtma bering. Menyuni o\'qing va 3 ta taom nomini rus tilida ayting.',
        context: 'restaurant',
      },
      {
        mission: 'Bugun mehmonxonada xona bron qiling. Xona turlari va narxlari haqida so\'rang.',
        context: 'hotel',
      },
      {
        mission: 'Bugun aeroportda yo\'l bilan bog\'liq 5 ta savol javobini o\'rganing.',
        context: 'airport',
      },
      {
        mission: 'Bugun do\'konda xarid qiling. Narhlar va to\'lov haqida gapiring.',
        context: 'shopping',
      },
      {
        mission: 'Bugun shifokor bilan tibbiy yordam so\'rang. Simptomlarni tushuntiring.',
        context: 'doctor',
      },
      {
        mission: 'Bugun bankda pul o\'tkazish haqida so\'rang. Hisob raqami va kartalar haqida bilib oling.',
        context: 'bank',
      },
      {
        mission: 'Bugun taksi chaqiring. Manzil va narh haqida gapiring.',
        context: 'taxi',
      },
    ];

    const randomMission = missions[Math.floor(Math.random() * missions.length)];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mission = await this.prisma.dailyMission.create({
      data: {
        userId,
        date: today,
        mission: randomMission.mission,
        context: randomMission.context,
        completed: false,
      },
    });

    return mission;
  }

  async getTodayMission(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.dailyMission.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });
  }

  async completeMission(userId: string, missionId: string, score: number) {
    const mission = await this.prisma.dailyMission.update({
      where: {
        id: missionId,
        userId,
      },
      data: {
        completed: true,
        score,
      },
    });

    // Reward user
    if (score >= 70) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: 20 },
          coins: { increment: 10 },
        },
      });
    }

    return {
      mission,
      passed: score >= 70,
      rewards: score >= 70 ? { xp: 20, coins: 10 } : null,
    };
  }

  async getMissionHistory(userId: string, limit: number = 30) {
    return this.prisma.dailyMission.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }

  async getMissionStats(userId: string) {
    const missions = await this.prisma.dailyMission.findMany({
      where: { userId },
    });

    const total = missions.length;
    const completed = missions.filter((m) => m.completed).length;
    const avgScore = missions
      .filter((m) => m.score !== null)
      .reduce((sum, m) => sum + (m.score || 0), 0) / (missions.filter((m) => m.score !== null).length || 1);

    const contextStats: Record<string, number> = {};
    missions.forEach((m) => {
      contextStats[m.context] = (contextStats[m.context] || 0) + 1;
    });

    return {
      total,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      averageScore: Math.round(avgScore),
      contextStats,
      streak: this.calculateMissionStreak(missions),
    };
  }

  private calculateMissionStreak(missions: any[]): number {
    const sorted = missions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const mission of sorted) {
      const missionDate = new Date(mission.date);
      missionDate.setHours(0, 0, 0, 0);

      const diffDays = Math.floor((currentDate.getTime() - missionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === streak && mission.completed) {
        streak++;
        currentDate = missionDate;
      } else {
        break;
      }
    }

    return streak;
  }
}
