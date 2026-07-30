import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async getUserChats(userId: string) {
    return this.prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          take: 50,
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async getChat(chatId: string, userId: string) {
    return this.prisma.chat.findFirst({
      where: { id: chatId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async createChat(userId: string, title: string = 'Suhbat', aiCharacter: string = 'Анна') {
    return this.prisma.chat.create({
      data: {
        userId,
        title,
        aiCharacter,
      },
    });
  }

  async sendMessage(userId: string, chatId: string, content: string) {
    // 1. Fetch user to know level
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const userLevel = user?.level || 'A0';

    // 2. Save user message
    const userMsg = await this.prisma.chatMessage.create({
      data: {
        chatId,
        userId,
        role: 'user',
        content,
      },
    });

    let aiResponseText = '';
    let corrections: any = null;

    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Ты — дружелюбный репетитор русского языка для узбекоязычных студентов. 
Уровень студента: ${userLevel}. 
Отвечай коротко (2-3 предложения), поддерживай диалог на русском языке.
Также проанализируй текст студента на наличие грамматических ошибок.
Формат ответа обязательно должен быть JSON:
{
  "reply": "Твой ответ на русском языке",
  "corrections": {
    "hasErrors": true/false,
    "original": "текст студента",
    "corrected": "исправленный вариант",
    "explanation": "Объяснение ошибки на узбекском или русском языке"
  }
}`,
            },
            {
              role: 'user',
              content,
            },
          ],
          response_format: { type: 'json_object' },
        });

        const parsed = JSON.parse(response.choices[0].message.content || '{}');
        aiResponseText = parsed.reply || 'Привет! Отлично сказано.';
        corrections = parsed.corrections || null;
      } catch (err) {
        this.logger.error('OpenAI call failed, falling back to rule-based AI:', err.message);
        aiResponseText = this.generateFallbackResponse(content, userLevel);
        corrections = this.generateFallbackCorrections(content);
      }
    } else {
      aiResponseText = this.generateFallbackResponse(content, userLevel);
      corrections = this.generateFallbackCorrections(content);
    }

    // 3. Save AI message
    const aiMsg = await this.prisma.chatMessage.create({
      data: {
        chatId,
        userId,
        role: 'assistant',
        content: aiResponseText,
        corrections: corrections ? JSON.stringify(corrections) : null,
      },
    });

    // 4. Reward user for practicing chat (+5 XP, +2 Coins)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: 5 },
        coins: { increment: 2 },
      },
    });

    return {
      userMessage: userMsg,
      aiMessage: aiMsg,
      corrections,
    };
  }

  private generateFallbackResponse(userText: string, level: string): string {
    const textLower = userText.toLowerCase();
    if (textLower.includes('привет') || textLower.includes('salom')) {
      return 'Привет! Как твои дела сегодня? Готов попрактиковать русский язык?';
    }
    if (textLower.includes('как дела') || textLower.includes('qalay')) {
      return 'У меня всё отлично! Спасибо. Чем ты сегодня занимался?';
    }
    if (textLower.includes('меня зовут') || textLower.includes('ismim')) {
      return 'Очень приятно познакомиться! Я твой AI репетитор. О чём мы поговорим?';
    }
    return `Отлично! Вы сказали: "${userText}". Молодец! Давай продолжим диалог.`;
  }

  private generateFallbackCorrections(userText: string): any {
    // Basic heuristics check for common Uzbek learner mistakes in Russian
    if (userText.toLowerCase().includes('mening ismim')) {
      return {
        hasErrors: true,
        original: userText,
        corrected: 'Меня зовут ...',
        explanation: 'Rus tilida "mening ismim" o\'rniga "Меня зовут" deb aytiladi.',
      };
    }
    return {
      hasErrors: false,
      original: userText,
      corrected: userText,
      explanation: 'Grammatik xatolar topilmadi, barakalla!',
    };
  }
}
