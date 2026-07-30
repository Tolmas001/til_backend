import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Level } from '@prisma/client';

@Injectable()
export class ScenarioService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(ScenarioService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // Real Scenario Simulation - Dynamic Scenarios
  async generateScenario(userId: string, context: string, level: Level) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        weakTopics: true,
        strongTopics: true,
        careerGoal: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!this.openai) {
      return this.generateFallbackScenario(context, level);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a scenario generator for Russian language learning. Create a dynamic, realistic scenario.
Context: ${context}
User level: ${level}
User's weak topics: ${user.weakTopics?.join(', ') || 'None'}
User's career goal: ${user.careerGoal || 'General'}

Return JSON format:
{
  "scenario": {
    "title": "Scenario title",
    "description": "Brief description",
    "context": "${context}",
    "difficulty": 5,
    "objectives": ["objective 1", "objective 2"],
    "initialSituation": "Starting situation description",
    "dynamicEvents": [
      {
        "trigger": "condition",
        "event": "what happens",
        "requiredResponse": "what user must say/do"
      }
    ],
    "characters": [
      {
        "name": "Character name",
        "role": "role in scenario",
        "personality": "personality traits"
      }
    ],
    "successCriteria": ["criteria 1", "criteria 2"]
  }
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      
      // Save scenario to database
      const scenario = await this.prisma.scenario.create({
        data: {
          title: parsed.scenario.title,
          description: parsed.scenario.description,
          level,
          context,
          difficulty: parsed.scenario.difficulty,
          objectives: parsed.scenario.objectives,
          aiScript: parsed.scenario,
        },
      });

      return { scenario: parsed.scenario, scenarioId: scenario.id };
    } catch (err) {
      this.logger.error('AI scenario generation failed, using fallback', err.message);
      return this.generateFallbackScenario(context, level);
    }
  }

  private generateFallbackScenario(context: string, level: Level) {
    const scenarios: Record<string, any> = {
      airport: {
        title: 'Aeroportda samolyot bekor qilindi',
        description: 'Siz aeroportdasiz. Samolyotingiz bekor qilindi. Yordam so\'rashingiz kerak.',
        context: 'airport',
        difficulty: 3,
        objectives: [
          'Xodim bilan gaplashish',
          'Muammoni tushuntirish',
          'Alternativ yo\'l so\'rash',
        ],
        initialSituation: 'Siz aeroportda kuting zonasidasiz. Ekranda "DELAYED" so\'zi paydo bo\'ldi.',
        dynamicEvents: [
          {
            trigger: 'user asks for help',
            event: 'Xodim keladi va siz bilan gaplashadi',
            requiredResponse: 'Muammoni rus tilida tushuntirish',
          },
          {
            trigger: 'user explains situation',
            event: 'Xodim boshqa reysni taklif qiladi',
            requiredResponse: 'Rozilik yoki rad etish',
          },
        ],
        characters: [
          {
            name: 'Aeroport xodimi',
            role: 'Yordam beruvchi',
            personality: 'Professional, do\'stona',
          },
        ],
        successCriteria: [
          'Muammoni to\'g\'ri tushuntirgan',
          'Alternativ yechim topgan',
          'Muvaffaqiyatli muloqot qilgan',
        ],
      },
      hotel: {
        title: 'Mehmonxonada xona muammosi',
        description: 'Mehmonxonangizda muammo bor. Adminstrator bilan gaplashingiz kerak.',
        context: 'hotel',
        difficulty: 4,
        objectives: [
          'Muammoni bildirish',
          'Yechim so\'rash',
          'Rozilik olish',
        ],
        initialSituation: 'Xonangizda ishlamayapti. Resepsiyonga borishingiz kerak.',
        dynamicEvents: [
          {
            trigger: 'user approaches reception',
            event: 'Adminstrator salomlaydi',
            requiredResponse: 'Muammoni tushuntirish',
          },
          {
            trigger: 'user explains issue',
            event: 'Adminstrator boshqa xona taklif qiladi',
            requiredResponse: 'Qabul qilish yoki rad etish',
          },
        ],
        characters: [
          {
            name: 'Adminstrator',
            role: 'Mehmonxona xodimi',
            personality: 'Hushmuomala, samimiy',
          },
        ],
        successCriteria: [
          'Muammoni aniq bildirgan',
          'Yechim topgan',
          'Muvaffaqiyatli hal qilgan',
        ],
      },
      restaurant: {
        title: 'Restoranda buyurtma muammosi',
        description: 'Buyurtmangiz noto\'g\'ri keldi. Ofitsiant bilan gaplashingiz kerak.',
        context: 'restaurant',
        difficulty: 3,
        objectives: [
          'Xatoni bildirish',
          'To\'g\'ri buyurtma so\'rash',
          'Hisob-kitob qilish',
        ],
        initialSituation: 'Sizning buyurtmangiz emas, boshqa taom keldi.',
        dynamicEvents: [
          {
            trigger: 'user calls waiter',
            event: 'Ofitsiant keladi',
            requiredResponse: 'Xatoni tushuntirish',
          },
          {
            trigger: 'user explains error',
            event: 'Ofitsiant uzr so\'raydi va yangi buyurtma olib keladi',
            requiredResponse: 'Rahmat aytish',
          },
        ],
        characters: [
          {
            name: 'Ofitsiant',
            role: 'Xizmat ko\'rsatuvchi',
            personality: 'Hushmuomala, tezkor',
          },
        ],
        successCriteria: [
          'Xatoni to\'g\'ri bildirgan',
          'Yangi buyurtma olgan',
          'Muvaffaqiyatli tugatgan',
        ],
      },
    };

    const scenario = scenarios[context] || scenarios.airport;
    
    // Save to database
    const dbScenario = await this.prisma.scenario.create({
      data: {
        title: scenario.title,
        description: scenario.description,
        level,
        context,
        difficulty: scenario.difficulty,
        objectives: scenario.objectives,
        aiScript: scenario,
      },
    });

    return { scenario, scenarioId: dbScenario.id };
  }

  async startScenario(userId: string, scenarioId: string) {
    const scenario = await this.prisma.scenario.findUnique({
      where: { id: scenarioId },
    });

    if (!scenario) {
      throw new Error('Scenario not found');
    }

    // Check if user has progress
    const existingProgress = await this.prisma.userScenarioProgress.findUnique({
      where: {
        userId_scenarioId: {
          userId,
          scenarioId,
        },
      },
    });

    if (existingProgress) {
      return {
        scenario,
        progress: existingProgress,
        message: 'Resuming previous attempt',
      };
    }

    // Create new progress
    const progress = await this.prisma.userScenarioProgress.create({
      data: {
        userId,
        scenarioId,
        attempts: 1,
      },
    });

    return {
      scenario,
      progress,
      message: 'Starting new scenario',
    };
  }

  async submitScenarioResponse(
    userId: string,
    scenarioId: string,
    response: string,
    currentEvent: string,
  ) {
    const scenario = await this.prisma.scenario.findUnique({
      where: { id: scenarioId },
    });

    if (!scenario) {
      throw new Error('Scenario not found');
    }

    if (!this.openai) {
      return this.evaluateFallbackResponse(response);
    }

    try {
      const aiScript = scenario.aiScript as any;
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are evaluating a Russian language learner's response in a scenario.
Current event: ${currentEvent}
Required response: ${aiScript.dynamicEvents?.find((e: any) => e.trigger === currentEvent)?.requiredResponse || 'Respond appropriately'}

Return JSON format:
{
  "score": 85,
  "isCorrect": true,
  "feedback": "Good response, clear and appropriate",
  "nextEvent": "next trigger",
  "suggestedImprovement": "Could be more formal"
}`,
          },
          {
            role: 'user',
            content: `User's response: "${response}"`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      
      // Update progress
      await this.prisma.userScenarioProgress.update({
        where: {
          userId_scenarioId: {
            userId,
            scenarioId,
          },
        },
        data: {
          feedback: parsed,
        },
      });

      return parsed;
    } catch (err) {
      this.logger.error('AI evaluation failed, using fallback', err.message);
      return this.evaluateFallbackResponse(response);
    }
  }

  private evaluateFallbackResponse(response: string) {
    const score = response.length > 10 ? 75 : 50;
    
    return {
      score,
      isCorrect: score > 60,
      feedback: 'Basic evaluation - AI analysis not available',
      nextEvent: 'continue',
      suggestedImprovement: 'Practice more complex responses',
    };
  }

  async completeScenario(userId: string, scenarioId: string, finalScore: number) {
    const progress = await this.prisma.userScenarioProgress.update({
      where: {
        userId_scenarioId: {
          userId,
          scenarioId,
        },
      },
      data: {
        completed: true,
        score: finalScore,
      },
    });

    // Reward user
    if (finalScore >= 70) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: 30 },
          coins: { increment: 15 },
        },
      });
    }

    return {
      progress,
      passed: finalScore >= 70,
      rewards: finalScore >= 70 ? { xp: 30, coins: 15 } : null,
    };
  }

  async getAvailableScenarios(level?: Level, context?: string) {
    const where: any = {};
    if (level) where.level = level;
    if (context) where.context = context;

    return this.prisma.scenario.findMany({
      where,
      orderBy: { difficulty: 'asc' },
    });
  }

  async getUserScenarioProgress(userId: string) {
    return this.prisma.userScenarioProgress.findMany({
      where: { userId },
      include: { scenario: true },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
