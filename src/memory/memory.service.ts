import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class MemoryService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(MemoryService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // Memory System - Word-level mistake tracking
  async recordMistake(userId: string, word: string, mistake: string, correction: string, context?: string) {
    const wordMistake = await this.prisma.wordMistake.create({
      data: {
        userId,
        word,
        mistake,
        correction,
        context,
        date: new Date(),
      },
    });

    // Check if this word has been mistaken before
    const previousMistakes = await this.prisma.wordMistake.findMany({
      where: {
        userId,
        word,
        date: {
          lt: new Date(),
        },
      },
      orderBy: { date: 'desc' },
      take: 5,
    });

    // If this is a recurring mistake, generate a reminder
    if (previousMistakes.length >= 2) {
      await this.generateMistakeReminder(userId, word, previousMistakes.length + 1);
    }

    return {
      wordMistake,
      isRecurring: previousMistakes.length >= 2,
      mistakeCount: previousMistakes.length + 1,
    };
  }

  async generateMistakeReminder(userId: string, word: string, mistakeCount: number) {
    const message = `"${word}" so'zida ${mistakeCount} marta xato qilgansiz. Bu so'zni e'tibor bilan o'rganing.`;

    await this.prisma.mentorMessage.create({
      data: {
        userId,
        type: 'correction',
        content: message,
        priority: 7,
      },
    });

    return { message };
  }

  async getWordMistakes(userId: string, word?: string) {
    const where: any = { userId };
    if (word) {
      where.word = word;
    }

    return this.prisma.wordMistake.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 50,
    });
  }

  async getRecurringMistakes(userId: string) {
    const mistakes = await this.prisma.wordMistake.groupBy({
      by: ['word'],
      where: { userId },
      _count: {
        word: true,
      },
      having: {
        word: {
          _count: {
            gt: 2,
          },
        },
      },
      orderBy: {
        _count: {
          word: 'desc',
        },
      },
      take: 10,
    });

    return mistakes.map((m) => ({
      word: m.word,
      count: m._count.word,
    }));
  }

  async getMistakeTimeline(userId: string, word: string) {
    const mistakes = await this.prisma.wordMistake.findMany({
      where: { userId, word },
      orderBy: { date: 'asc' },
    });

    return {
      word,
      mistakes: mistakes.map((m) => ({
        date: m.date,
        mistake: m.mistake,
        correction: m.correction,
        context: m.context,
      })),
      totalMistakes: mistakes.length,
      trend: this.analyzeMistakeTrend(mistakes),
    };
  }

  private analyzeMistakeTrend(mistakes: any[]): 'improving' | 'stable' | 'worsening' {
    if (mistakes.length < 3) return 'stable';

    const recent = mistakes.slice(-3);
    const older = mistakes.slice(0, -3);

    const recentDates = recent.map((m) => new Date(m.date).getTime());
    const olderDates = older.map((m) => new Date(m.date).getTime());

    const recentInterval = recentDates[recentDates.length - 1] - recentDates[0];
    const olderInterval = olderDates[olderDates.length - 1] - olderDates[0];

    if (recentInterval > olderInterval * 1.5) return 'improving';
    if (recentInterval < olderInterval * 0.7) return 'worsening';
    return 'stable';
  }

  async explainMistake(userId: string, original: string, corrected: string) {
    if (!this.openai) {
      return this.generateFallbackMistakeExplanation(original, corrected);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Explain this Russian grammar mistake in detail.
Original: "${original}"
Corrected: "${corrected}"

Return JSON format:
{
  "explanation": "Why it's wrong in Uzbek",
  "rule": "Grammar rule name",
  "examples": ["example 1", "example 2", "example 3"],
  "exercises": [
    {
      "question": "Fill in the blank",
      "answer": "correct answer"
    }
  ]
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');

      // Save explanation
      await this.prisma.mistakeExplanation.create({
        data: {
          userId,
          original,
          corrected,
          explanation: parsed.explanation,
          rule: parsed.rule,
          examples: parsed.examples,
          exercises: parsed.exercises,
        },
      });

      return parsed;
    } catch (err) {
      this.logger.error('AI mistake explanation failed, using fallback', err.message);
      return this.generateFallbackMistakeExplanation(original, corrected);
    }
  }

  private generateFallbackMistakeExplanation(original: string, corrected: string) {
    return {
      explanation: `"${original}" noto'g'ri, "${corrected}" to'g'ri. Bu grammatika qoidasiga amal qiling.`,
      rule: 'Grammatika qoidasi',
      examples: [
        `To'g'ri: ${corrected}`,
        `Xato: ${original}`,
        `Misol: Men kitob o\'qiyman.`,
      ],
      exercises: [
        {
          question: 'To\'g\'ri shaklni tanlang',
          answer: corrected,
        },
      ],
    };
  }

  async getMistakeExplanations(userId: string) {
    return this.prisma.mistakeExplanation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async markExplanationAsReviewed(explanationId: string) {
    return this.prisma.mistakeExplanation.update({
      where: { id: explanationId },
      data: { reviewed: true },
    });
  }

  async generateReviewSession(userId: string, type: 'forgotten_words' | 'difficult_grammar' | 'dialog_review') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        wordMistakes: true,
        chatMessages: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    let content: any = {};

    if (type === 'forgotten_words') {
      const recurringMistakes = await this.getRecurringMistakes(userId);
      content = {
        type,
        words: recurringMistakes.slice(0, 5),
        exercises: recurringMistakes.slice(0, 5).map((m: any) => ({
          word: m.word,
          task: `"${m.word}" so'zini to'g'ri ishlating`,
        })),
      };
    } else if (type === 'difficult_grammar') {
      const explanations = await this.getMistakeExplanations(userId);
      content = {
        type,
        rules: explanations.slice(0, 3).map((e: any) => ({
          rule: e.rule,
          explanation: e.explanation,
        })),
      };
    } else if (type === 'dialog_review') {
      content = {
        type,
        dialogs: user.chatMessages.slice(0, 3).map((m: any) => ({
          content: m.content,
          corrections: m.corrections,
        })),
      };
    }

    const reviewSession = await this.prisma.reviewSession.create({
      data: {
        userId,
        type,
        content,
        generatedAt: new Date(),
      },
    });

    return reviewSession;
  }

  async completeReviewSession(sessionId: string, score: number) {
    return this.prisma.reviewSession.update({
      where: { id: sessionId },
      data: {
        completed: true,
        score,
      },
    });
  }

  async getReviewSessions(userId: string) {
    return this.prisma.reviewSession.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
      take: 20,
    });
  }
}
