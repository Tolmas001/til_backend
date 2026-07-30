import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { CareerGoal, LearningStyle, Level } from '@prisma/client';

@Injectable()
export class AiLearningService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(AiLearningService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // 1. AI Learning Engine - Personalized Learning Paths
  async assessUserLevel(userId: string) {
   const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        lessons: { include: { lesson: true } },
        chatMessages: { take: 100, orderBy: { createdAt: 'desc' } },
        vocabulary: { include: { vocabulary: true } },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate mastery scores for different topics
    const topicMastery = {};
    const weakTopics: string[] = [];
    const strongTopics: string[] = [];

    // Analyze lesson performance
    for (const progress of user.lessons) {
      if (progress.completed && progress.score) {
        const lessonTopics = progress.lesson.topics || [];
        for (const topic of lessonTopics) {
          if (!topicMastery[topic]) {
            topicMastery[topic] = [];
          }
          topicMastery[topic].push(progress.score);
        }
      }
    }

    // Calculate average mastery per topic
    for (const [topic, scores] of Object.entries(topicMastery)) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avgScore < 60) {
        weakTopics.push(topic);
      } else if (avgScore > 85) {
        strongTopics.push(topic);
      }
    }

    // Update user with AI assessment
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        weakTopics,
        strongTopics,
      },
    });

    return {
      weakTopics,
      strongTopics,
      topicMastery,
      recommendedLevel: this.calculateRecommendedLevel(user),
    };
  }

  private calculateRecommendedLevel(user: any): Level {
    const completedLessons = user.lessons.filter((l: any) => l.completed).length;
    const avgScore = user.lessons.reduce((sum: number, l: any) => sum + (l.score || 0), 0) / (user.lessons.length || 1);

    if (completedLessons < 3) return Level.A0;
    if (completedLessons < 8) return avgScore > 70 ? Level.A1 : Level.A0;
    if (completedLessons < 15) return avgScore > 70 ? Level.A2 : Level.A1;
    if (completedLessons < 25) return avgScore > 70 ? Level.B1 : Level.A2;
    return avgScore > 70 ? Level.B2 : Level.B1;
  }

  async generatePersonalizedPlan(userId: string) {
    const assessment = await this.assessUserLevel(userId);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!this.openai) {
      return this.generateFallbackPlan(assessment, user);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an AI Russian language tutor. Create a personalized weekly learning plan for a student.
Current level: ${user?.level}
Weak topics: ${assessment.weakTopics.join(', ') || 'None'}
Strong topics: ${assessment.strongTopics.join(', ') || 'None'}
Career goal: ${user?.careerGoal || 'General'}

Return JSON format:
{
  "weeklyPlan": [
    {
      "day": "Monday",
      "focus": "topic to focus on",
      "activities": ["activity 1", "activity 2"],
      "estimatedMinutes": 30
    }
  ],
  "recommendedLessons": ["lesson-id-1", "lesson-id-2"],
  "focusAreas": ["area 1", "area 2"]
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      return parsed;
    } catch (err) {
      this.logger.error('AI plan generation failed, using fallback', err.message);
      return this.generateFallbackPlan(assessment, user);
    }
  }

  private generateFallbackPlan(assessment: any, user: any) {
    const focusAreas = assessment.weakTopics.length > 0 
      ? assessment.weakTopics 
      : ['Salomlashish', 'Asosiy gaplar'];

    return {
      weeklyPlan: [
        {
          day: 'Monday',
          focus: focusAreas[0] || 'Salomlashish',
          activities: ['Darsni o\'rganish', 'AI bilan suhbat'],
          estimatedMinutes: 30,
        },
        {
          day: 'Tuesday',
          focus: focusAreas[1] || 'Sonlar',
          activities: ['Mashq qilish', 'So\'zlar yodlash'],
          estimatedMinutes: 25,
        },
        {
          day: 'Wednesday',
          focus: 'Gapirish amaliyoti',
          activities: ['AI suhbat', 'Talaffuz mashqi'],
          estimatedMinutes: 35,
        },
        {
          day: 'Thursday',
          focus: focusAreas[0] || 'Salomlashish',
          activities: ['Takrorlash', 'Test'],
          estimatedMinutes: 30,
        },
        {
          day: 'Friday',
          focus: 'Grammatika',
          activities: ['Yangi mavzu', 'Mashq'],
          estimatedMinutes: 30,
        },
        {
          day: 'Saturday',
          focus: 'Hikoya rejimi',
          activities: ['Ssenariy o\'ynash', 'Dialog'],
          estimatedMinutes: 40,
        },
        {
          day: 'Sunday',
          focus: 'Qayta ko\'rib chiqish',
          activities: ['Haftalik test', 'Progress ko\'rish'],
          estimatedMinutes: 25,
        },
      ],
      recommendedLessons: [],
      focusAreas,
    };
  }

  // 2. Career Mode - Goal-based Learning
  async setCareerGoal(userId: string, goal: CareerGoal) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { careerGoal: goal },
    });

    // Generate career-specific recommendations
    const recommendations = await this.generateCareerRecommendations(goal, updated.level);
    
    return { user: updated, recommendations };
  }

  async generateCareerRecommendations(goal: CareerGoal, level: Level) {
    const careerContent: Record<CareerGoal, any> = {
      [CareerGoal.WORK_IN_RUSSIA]: {
        focusTopics: ['Ish suhbati', 'CV yozish', 'Professional atamalar'],
        scenarios: ['Ish intervyusi', 'Hamkasblar bilan muloqot'],
        vocabulary: ['rabota', 'zarplata', 'otdel', 'nachalnik'],
      },
      [CareerGoal.IT_COMPANY]: {
        focusTopics: ['IT terminologiya', 'Texnik hujjatlar', 'Team communication'],
        scenarios: ['Code review', 'Standup meeting', 'Bug reporting'],
        vocabulary: ['programmirovanie', 'komp\'yuter', 'bazadannykh', 'algoritm'],
      },
      [CareerGoal.UNIVERSITY]: {
        focusTopics: ['Akademik til', 'Lug\'atlar', 'Ilmiy yozuv'],
        scenarios: ['Professor bilan suhbat', 'Seminar', 'Imtihon'],
        vocabulary: ['universitet', 'fakul\'tet', 'lektsiya', 'ekzamen'],
      },
      [CareerGoal.TRAVEL]: {
        focusTopics: ['Sayohat atamalari', 'Yo\'l yo\'riqnomasi', 'Mehmonxona'],
        scenarios: ['Aeroport', 'Mehmonxona', 'Restoran', 'Savdo'],
        vocabulary: ['puteshestvie', 'otel', 'restoran', 'bilet'],
      },
      [CareerGoal.BUSINESS]: {
        focusTopics: ['Biznes etiketi', 'Muzokaralar', 'Shartnomalar'],
        scenarios: ['Biznes uchrashuv', 'Muzokara', 'Ta\'dimot'],
        vocabulary: ['biznes', 'kontrakt', 'partner', 'sdelka'],
      },
      [CareerGoal.GENERAL]: {
        focusTopics: ['Kundalik suhbat', 'Madaniyat', 'Tarix'],
        scenarios: ['Do\'stlar bilan suhbat', 'Telefon', 'Internet'],
        vocabulary: ['privet', 'kak dela', 'spasibo', 'pozhaluysta'],
      },
    };

    return careerContent[goal] || careerContent[CareerGoal.GENERAL];
  }

  // 3. Learning Style Detection
  async detectLearningStyle(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        lessons: true,
        chatMessages: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Analyze user behavior to detect learning style
    const lessonCompletionRate = user.lessons.filter((l) => l.completed).length / (user.lessons.length || 1);
    const chatActivity = user.chatMessages.length;

    let detectedStyle: LearningStyle = LearningStyle.MIXED;

    if (chatActivity > lessonCompletionRate * 10) {
      detectedStyle = LearningStyle.AUDITORY;
    } else if (lessonCompletionRate > 0.8) {
      detectedStyle = LearningStyle.READING;
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { learningStyle: detectedStyle },
    });

    return {
      style: detectedStyle,
      recommendations: this.getStyleRecommendations(detectedStyle),
    };
  }

  private getStyleRecommendations(style: LearningStyle) {
    const recommendations: Record<LearningStyle, string[]> = {
      [LearningStyle.VISUAL]: [
        'Video darslarni ko\'ring',
        'Infografikalardan foydalaning',
        'Rasmli so\'zlar yodlang',
      ],
      [LearningStyle.AUDITORY]: [
        'Audio darslarni tinglang',
        'AI bilan ko\'proq suhbatlang',
        'O\'zingiz gapirib yozib oling',
      ],
      [LearningStyle.KINESTHETIC]: [
        'Amaliy mashqlar qiling',
        'Dialoglarda ishtirok eting',
        'Ssenariylarda o\'ynang',
      ],
      [LearningStyle.READING]: [
        'Matnlarni o\'qing',
        'Grammatika qoidalarni o\'rganing',
        'Yozma mashqlar qiling',
      ],
      [LearningStyle.MIXED]: [
        'Barcha usullarni aralashtiring',
        'Turli xil mashqlar qiling',
        'O\'zingizga mos usulni toping',
      ],
    };

    return recommendations[style];
  }

  // 4. Knowledge Graph Updates
  async updateKnowledgeNode(userId: string, topic: string, mastery: number) {
    const existing = await this.prisma.knowledgeNode.findUnique({
      where: {
        userId_topic: {
          userId,
          topic,
        },
      },
    });

    if (existing) {
      return this.prisma.knowledgeNode.update({
        where: { id: existing.id },
        data: {
          mastery,
          lastReviewedAt: new Date(),
          reviewCount: { increment: 1 },
        },
      });
    }

    return this.prisma.knowledgeNode.create({
      data: {
        userId,
        topic,
        mastery,
        lastReviewedAt: new Date(),
        reviewCount: 1,
      },
    });
  }

  async getKnowledgeGraph(userId: string) {
    const nodes = await this.prisma.knowledgeNode.findMany({
      where: { userId },
      orderBy: { mastery: 'desc' },
    });

    return {
      nodes,
      totalTopics: nodes.length,
      masteredTopics: nodes.filter((n) => n.mastery > 0.8).length,
      weakTopics: nodes.filter((n) => n.mastery < 0.5).map((n) => n.topic),
    };
  }
}
