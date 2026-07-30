import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiInterviewService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(AiInterviewService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // AI Interview - HR Simulation
  async generateInterview(userId: string, jobType: string, level: string) {
    if (!this.openai) {
      return this.generateFallbackInterview(jobType, level);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Generate a realistic HR interview simulation for Russian language practice.
Job Type: ${jobType}
Level: ${level}

Return JSON format:
{
  "interview": {
    "title": "Interview title",
    "description": "Interview description",
    "jobType": "${jobType}",
    "level": "${level}",
    "duration": "15 minutes"
  },
  "questions": [
    {
      "id": 1,
      "question": "Question in Russian",
      "translation": "Question translation in Uzbek",
      "type": "introduction|experience|behavioral|technical|closing",
      "expectedKeywords": ["keyword1", "keyword2"],
      "sampleAnswer": "Sample answer in Russian",
      "tips": "Tips for answering"
    }
  ],
  "scoring": {
    "criteria": [
      {
        "skill": "fluency",
        "weight": 0.3,
        "description": "Speaking fluency and confidence"
      },
      {
        "skill": "vocabulary",
        "weight": 0.25,
        "description": "Job-related vocabulary usage"
      },
      {
        "skill": "grammar",
        "weight": 0.25,
        "description": "Grammar accuracy"
      },
      {
        "skill": "content",
        "weight": 0.2,
        "description": "Content quality and relevance"
      }
    ]
  }
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');

      const interview = await this.prisma.interview.create({
        data: {
          userId,
          jobType,
          level: level as any,
          questions: parsed.questions,
          scoring: parsed.scoring,
          status: 'pending',
          createdAt: new Date(),
        },
      });

      return interview;
    } catch (err) {
      this.logger.error('AI interview generation failed, using fallback', err.message);
      return this.generateFallbackInterview(jobType, level);
    }
  }

  private async generateFallbackInterview(jobType: string, level: string) {
    const fallbackQuestions = [
      {
        id: 1,
        question: 'Расскажите о себе',
        translation: 'O\'zingiz haqida gapiring',
        type: 'introduction',
        expectedKeywords: ['имя', 'опыт', 'работа'],
        sampleAnswer: 'Меня зовут Али, я работаю программистом уже 3 года',
        tips: 'Ismingiz, tajribangiz va ish haqida gapiring',
      },
      {
        id: 2,
        question: 'Почему вы хотите работать у нас?',
        translation: 'Nega bizda ishlamoqchisiz?',
        type: 'behavioral',
        expectedKeywords: ['компания', 'цели', 'развитие'],
        sampleAnswer: 'Мне нравится ваша компания и её цели',
        tips: 'Kompaniya va maqsadlari haqida gapiring',
      },
      {
        id: 3,
        question: 'Какие у вас сильные стороны?',
        translation: 'Sizning kuchli tomonlaringiz nimalar?',
        type: 'behavioral',
        expectedKeywords: ['навыки', 'опыт', 'знания'],
        sampleAnswer: 'У меня хорошие навыки программирования',
        tips: 'Ko\'nikmalaringiz va tajribangiz haqida gapiring',
      },
    ];

    const fallbackScoring = {
      criteria: [
        {
          skill: 'fluency',
          weight: 0.3,
          description: 'Gapirish ravonligi va ishonch',
        },
        {
          skill: 'vocabulary',
          weight: 0.25,
          description: 'Ishga oid so\'zlar ishlatish',
        },
        {
          skill: 'grammar',
          weight: 0.25,
          description: 'Grammatika to\'g\'riligi',
        },
        {
          skill: 'content',
          weight: 0.2,
          description: 'Mazmun sifati va dolzarblik',
        },
      ],
    };

    const interview = await this.prisma.interview.create({
      data: {
        userId: 'system',
        jobType,
        level: level as any,
        questions: fallbackQuestions,
        scoring: fallbackScoring,
        status: 'pending',
        createdAt: new Date(),
      },
    });

    return interview;
  }

  async submitAnswer(userId: string, interviewId: string, questionId: number, answer: string, audioUrl?: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview) {
      throw new Error('Interview not found');
    }

    const question = (interview.questions as any[]).find((q) => q.id === questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // AI-powered answer evaluation
    let evaluation = null;
    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Evaluate the Russian language answer for an HR interview.
Question: ${question.question}
Answer: ${answer}
Expected keywords: ${question.expectedKeywords.join(', ')}

Return JSON format:
{
  "score": 85,
  "feedback": "Good answer, but could improve vocabulary",
  "keywordsUsed": ["keyword1", "keyword2"],
  "grammarErrors": [],
  "fluencyScore": 80,
  "vocabularyScore": 85,
  "grammarScore": 90
}`,
            },
          ],
          response_format: { type: 'json_object' },
        });

        evaluation = JSON.parse(response.choices[0].message.content || '{}');
      } catch (err) {
        this.logger.error('AI answer evaluation failed', err.message);
      }
    }

    const answerData = {
      questionId,
      answer,
      audioUrl,
      evaluation,
      submittedAt: new Date(),
    };

    const updatedAnswers = [...((interview.answers as any[]) || []), answerData];

    await this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        answers: updatedAnswers,
        status: 'in_progress',
      },
    });

    return answerData;
  }

  async completeInterview(userId: string, interviewId: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id: interviewId },
    });

    if (!interview) {
      throw new Error('Interview not found');
    }

    // Calculate overall score
    let totalScore = 0;
    let totalWeight = 0;

    if (interview.answers && (interview.answers as any[]).length > 0) {
      (interview.answers as any[]).forEach((answer) => {
        if (answer.evaluation && answer.evaluation.score) {
          totalScore += answer.evaluation.score;
          totalWeight += 1;
        }
      });
    }

    const overallScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

    const updatedInterview = await this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: 'completed',
        overallScore,
      },
    });

    return updatedInterview;
  }

  async getInterview(interviewId: string) {
    return this.prisma.interview.findUnique({
      where: { id: interviewId },
    });
  }

  async getUserInterviews(userId: string, limit: number = 20) {
    return this.prisma.interview.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getInterviewStats() {
    const interviews = await this.prisma.interview.findMany();

    const total = interviews.length;
    const completed = interviews.filter((i) => i.status === 'completed').length;
    const pending = interviews.filter((i) => i.status === 'pending').length;
    const inProgress = interviews.filter((i) => i.status === 'in_progress').length;

    const jobTypeStats: Record<string, number> = {};
    interviews.forEach((i) => {
      jobTypeStats[i.jobType] = (jobTypeStats[i.jobType] || 0) + 1;
    });

    const avgScore =
      completed > 0
        ? Math.round(
            interviews
              .filter((i) => i.overallScore !== null)
              .reduce((sum, i) => sum + (i.overallScore || 0), 0) /
              interviews.filter((i) => i.overallScore !== null).length,
          )
        : 0;

    return {
      total,
      completed,
      pending,
      inProgress,
      jobTypeStats,
      averageScore: avgScore,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}
