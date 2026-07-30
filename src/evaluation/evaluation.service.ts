import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class EvaluationService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(EvaluationService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // AI Evaluation Engine - Structured Scoring per Skill
  async evaluateExercise(
    userId: string,
    exerciseId: string,
    exerciseType: string,
    userResponse: string,
    expectedResponse?: string,
  ) {
    if (!this.openai) {
      return this.generateFallbackEvaluation(userResponse);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Evaluate this Russian language exercise response.
Exercise type: ${exerciseType}
User response: "${userResponse}"
Expected response: "${expectedResponse || 'N/A'}"

Return JSON format:
{
  "vocabularyScore": 82,
  "grammarScore": 71,
  "pronunciationScore": 90,
  "confidenceScore": 64,
  "fluencyScore": 76,
  "listeningScore": 58,
  "overallScore": 75,
  "feedback": "Detailed feedback in Uzbek",
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"]
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');

      const evaluation = await this.prisma.skillEvaluation.create({
        data: {
          userId,
          exerciseId,
          exerciseType,
          vocabularyScore: parsed.vocabularyScore,
          grammarScore: parsed.grammarScore,
          pronunciationScore: parsed.pronunciationScore,
          confidenceScore: parsed.confidenceScore,
          fluencyScore: parsed.fluencyScore,
          listeningScore: parsed.listeningScore,
          overallScore: parsed.overallScore,
          feedback: parsed.feedback,
          evaluatedAt: new Date(),
        },
      });

      // Log learning event
      await this.prisma.learningEvent.create({
        data: {
          userId,
          eventType: 'exercise_completed',
          metadata: {
            exerciseId,
            exerciseType,
            scores: parsed,
          },
        },
      });

      return evaluation;
    } catch (err) {
      this.logger.error('AI evaluation failed, using fallback', err.message);
      return this.generateFallbackEvaluation(userResponse);
    }
  }

  private async generateFallbackEvaluation(userResponse: string) {
    const wordCount = userResponse.split(' ').length;
    const baseScore = Math.min(95, 60 + wordCount * 2);

    const evaluation = {
      vocabularyScore: baseScore - 5,
      grammarScore: baseScore - 10,
      pronunciationScore: baseScore,
      confidenceScore: baseScore - 15,
      fluencyScore: baseScore - 8,
      listeningScore: null,
      overallScore: baseScore - 5,
      feedback: 'Basic evaluation - AI analysis not available',
    };

    return evaluation;
  }

  async getUserEvaluations(userId: string, limit: number = 20) {
    return this.prisma.skillEvaluation.findMany({
      where: { userId },
      orderBy: { evaluatedAt: 'desc' },
      take: limit,
    });
  }

  async getAverageScores(userId: string) {
    const evaluations = await this.prisma.skillEvaluation.findMany({
      where: { userId },
    });

    if (evaluations.length === 0) {
      return null;
    }

    const avgVocabulary = evaluations.reduce((sum, e) => sum + e.vocabularyScore, 0) / evaluations.length;
    const avgGrammar = evaluations.reduce((sum, e) => sum + e.grammarScore, 0) / evaluations.length;
    const avgPronunciation = evaluations.reduce((sum, e) => sum + e.pronunciationScore, 0) / evaluations.length;
    const avgConfidence = evaluations.reduce((sum, e) => sum + e.confidenceScore, 0) / evaluations.length;
    const avgFluency = evaluations.reduce((sum, e) => sum + e.fluencyScore, 0) / evaluations.length;
    const avgListening = evaluations
      .filter((e) => e.listeningScore !== null)
      .reduce((sum, e) => sum + (e.listeningScore || 0), 0) / (evaluations.filter((e) => e.listeningScore !== null).length || 1);
    const avgOverall = evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length;

    return {
      vocabulary: Math.round(avgVocabulary),
      grammar: Math.round(avgGrammar),
      pronunciation: Math.round(avgPronunciation),
      confidence: Math.round(avgConfidence),
      fluency: Math.round(avgFluency),
      listening: Math.round(avgListening),
      overall: Math.round(avgOverall),
    };
  }

  // CEFR Mapping Engine - Skill-based CEFR Levels
  async mapCefrLevels(userId: string) {
    const avgScores = await this.getAverageScores(userId);

    if (!avgScores) {
      throw new Error('No evaluations found for user');
    }

    const scoreToLevel = (score: number): string => {
      if (score >= 90) return 'B2';
      if (score >= 80) return 'B1';
      if (score >= 70) return 'A2';
      if (score >= 60) return 'A1';
      return 'A0';
    };

    const skillLevels = {
      grammarLevel: scoreToLevel(avgScores.grammar) as any,
      listeningLevel: scoreToLevel(avgScores.listening) as any,
      speakingLevel: scoreToLevel(avgScores.pronunciation) as any,
      readingLevel: scoreToLevel(avgScores.vocabulary) as any,
      writingLevel: scoreToLevel(avgScores.grammar) as any,
      overallLevel: scoreToLevel(avgScores.overall) as any,
    };

    const existing = await this.prisma.skillCefrLevel.findUnique({
      where: { userId },
    });

    if (existing) {
      return this.prisma.skillCefrLevel.update({
        where: { userId },
        data: {
          ...skillLevels,
          assessedAt: new Date(),
        },
      });
    }

    return this.prisma.skillCefrLevel.create({
      data: {
        userId,
        ...skillLevels,
        assessedAt: new Date(),
      },
    });
  }

  async getCefrLevels(userId: string) {
    return this.prisma.skillCefrLevel.findUnique({
      where: { userId },
    });
  }

  // Learning Evidence - Track Completed Exercises per Level
  async trackLearningEvidence(userId: string, level: string, exerciseType: string) {
    const evidence = await this.prisma.learningEvidence.findUnique({
      where: { userId_level: { userId, level: level as any } },
    });

    if (evidence) {
      const updateData: any = { completedAt: new Date() };
      
      switch (exerciseType) {
        case 'dialog':
          updateData.dialogCount = { increment: 1 };
          break;
        case 'quiz':
          updateData.quizCount = { increment: 1 };
          break;
        case 'speaking':
          updateData.speakingCount = { increment: 1 };
          break;
        case 'listening':
          updateData.listeningCount = { increment: 1 };
          break;
        case 'reading':
          updateData.readingCount = { increment: 1 };
          break;
        case 'writing':
          updateData.writingCount = { increment: 1 };
          break;
      }

      return this.prisma.learningEvidence.update({
        where: { userId_level: { userId, level: level as any } },
        data: updateData,
      });
    }

    const initialData: any = {
      userId,
      level: level as any,
      completedAt: new Date(),
    };

    switch (exerciseType) {
      case 'dialog':
        initialData.dialogCount = 1;
        break;
      case 'quiz':
        initialData.quizCount = 1;
        break;
      case 'speaking':
        initialData.speakingCount = 1;
        break;
      case 'listening':
        initialData.listeningCount = 1;
        break;
      case 'reading':
        initialData.readingCount = 1;
        break;
      case 'writing':
        initialData.writingCount = 1;
        break;
    }

    return this.prisma.learningEvidence.create({
      data: initialData,
    });
  }

  async getLearningEvidence(userId: string, level?: string) {
    const where: any = { userId };
    if (level) {
      where.level = level;
    }

    return this.prisma.learningEvidence.findMany({
      where,
      orderBy: { level: 'asc' },
    });
  }

  async checkLevelCompletion(userId: string, level: string, skill: string) {
    const evidence = await this.prisma.learningEvidence.findUnique({
      where: { userId_level: { userId, level: level as any } },
    });

    if (!evidence) {
      return { completed: false, count: 0, required: 10 };
    }

    const requiredCount = 10;
    const count = (evidence as any)[`${skill}Count`] || 0;

    return {
      completed: count >= requiredCount,
      count,
      required: requiredCount,
      progress: Math.min(100, Math.round((count / requiredCount) * 100)),
    };
  }
}
