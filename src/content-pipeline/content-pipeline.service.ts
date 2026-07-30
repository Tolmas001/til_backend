import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ContentPipelineService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(ContentPipelineService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // AI Content Pipeline - Auto-generate lesson content
  async generateContent(userId: string, topic: string, level: string) {
    if (!this.openai) {
      return this.generateFallbackContent(topic, level);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Generate complete Russian language lesson content for ${level} level.
Topic: ${topic}

Return JSON format:
{
  "lesson": {
    "title": "Lesson title in Uzbek",
    "description": "Lesson description",
    "objectives": ["objective 1", "objective 2"]
  },
  "dialog": {
    "title": "Dialog title",
    "characters": ["Person A", "Person B"],
    "lines": [
      {"speaker": "Person A", "russian": "Russian text", "uzbek": "Uzbek translation"},
      {"speaker": "Person B", "russian": "Russian text", "uzbek": "Uzbek translation"}
    ]
  },
  "quiz": {
    "questions": [
      {
        "question": "Question in Russian",
        "options": ["A", "B", "C", "D"],
        "correct": "A",
        "explanation": "Explanation in Uzbek"
      }
    ]
  },
  "flashcard": {
    "words": [
      {"russian": "слово", "uzbek": "translation", "example": "Example sentence"}
    ]
  },
  "grammar": {
    "topic": "Grammar topic",
    "explanation": "Explanation in Uzbek",
    "examples": ["Example 1", "Example 2"]
  },
  "vocabulary": {
    "words": [
      {"word": "слово", "translation": "translation", "partOfSpeech": "noun"}
    ]
  },
  "roleplay": {
    "scenario": "Scenario description",
    "prompts": ["Prompt 1", "Prompt 2"]
  },
  "homework": {
    "tasks": [
      {"task": "Task description", "type": "writing"}
    ]
  }
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');

      const contentGeneration = await this.prisma.contentGeneration.create({
        data: {
          userId,
          topic,
          level: level as any,
          generatedContent: parsed,
          status: 'completed',
          generatedAt: new Date(),
        },
      });

      return contentGeneration;
    } catch (err) {
      this.logger.error('AI content generation failed, using fallback', err.message);
      return this.generateFallbackContent(topic, level);
    }
  }

  private async generateFallbackContent(topic: string, level: string) {
    const fallbackContent = {
      lesson: {
        title: `${topic} - ${level} darjasi`,
        description: `${topic} mavzusidagi asosiy dars`,
        objectives: [
          `${topic} bilan tanishish`,
          `Asosiy so'zlarni o'rganish`,
          `Oddiy gapirishni o'rganish`,
        ],
      },
      dialog: {
        title: `${topic} dialogi`,
        characters: ['Ali', 'Anna'],
        lines: [
          {
            speaker: 'Ali',
            russian: 'Здравствуйте!',
            uzbek: 'Salom!',
          },
          {
            speaker: 'Anna',
            russian: 'Привет! Как дела?',
            uzbek: 'Salom! Qalay?',
          },
        ],
      },
      quiz: {
        questions: [
          {
            question: 'Здравствуйте nimani anglatadi?',
            options: ['Salom', 'Xayr', 'Rahmat', 'Qachon'],
            correct: 'Salom',
            explanation: 'Здравствуйте - salomlashish uchun ishlatiladi',
          },
        ],
      },
      flashcard: {
        words: [
          {
            russian: 'Здравствуйте',
            uzbek: 'Salom',
            example: 'Здравствуйте, меня зовут Али',
          },
        ],
      },
      grammar: {
        topic: 'Salomlashish',
        explanation: 'Rus tilida rasmiy salomlashish uchunЗдравствуйте ishlatiladi',
        examples: ['Здравствуйте, как дела?', 'Здравствуйте, меня зовут...'],
      },
      vocabulary: {
        words: [
          {
            word: 'Здравствуйте',
            translation: 'Salom',
            partOfSpeech: 'interjection',
          },
        ],
      },
      roleplay: {
        scenario: 'Yangi odam bilan tanishish',
        prompts: ['O\'zingizni tanishtiring', 'Qanday qilib yashaysiz?'],
      },
      homework: {
        tasks: [
          {
            task: '5 ta yangi so\'zni yodlang',
            type: 'vocabulary',
          },
        ],
      },
    };

    const contentGeneration = await this.prisma.contentGeneration.create({
      data: {
        userId: 'system',
        topic,
        level: level as any,
        generatedContent: fallbackContent,
        status: 'completed',
        generatedAt: new Date(),
      },
    });

    return contentGeneration;
  }

  async getContentGeneration(id: string) {
    return this.prisma.contentGeneration.findUnique({
      where: { id },
    });
  }

  async getUserContentGenerations(userId: string, limit: number = 20) {
    return this.prisma.contentGeneration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async deleteContentGeneration(id: string) {
    return this.prisma.contentGeneration.delete({
      where: { id },
    });
  }

  async getContentStats() {
    const allGenerations = await this.prisma.contentGeneration.findMany();

    const total = allGenerations.length;
    const completed = allGenerations.filter((g) => g.status === 'completed').length;
    const failed = allGenerations.filter((g) => g.status === 'failed').length;
    const pending = allGenerations.filter((g) => g.status === 'pending').length;

    const levelStats: Record<string, number> = {};
    allGenerations.forEach((g) => {
      levelStats[g.level] = (levelStats[g.level] || 0) + 1;
    });

    return {
      total,
      completed,
      failed,
      pending,
      successRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      levelStats,
    };
  }
}
