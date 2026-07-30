import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiMentorService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(AiMentorService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // AI Mentor - Proactive Coaching System
  async generateProactiveMessage(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        lessons: { where: { completed: true }, take: 5 },
        chatMessages: { take: 10, orderBy: { createdAt: 'desc' } },
        wordMistakes: { take: 5, orderBy: { date: 'desc' } },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Analyze user activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastActivity = user.lastActiveAt;
    const daysSinceLastActivity = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    const recentLessons = user.lessons.filter(l => {
      const lessonDate = new Date(l.completedAt || l.createdAt);
      return lessonDate >= today;
    });

    const recentMistakes = user.wordMistakes.filter(m => {
      const mistakeDate = new Date(m.date);
      return mistakeDate >= today;
    });

    // Determine message type and content
    let messageType = 'motivation';
    let content = '';
    let priority = 5;

    if (daysSinceLastActivity >= 2) {
      messageType = 'reminder';
      priority = 8;
      content = `Bugun dars qilmaganingizni sezdim. ${daysSinceLastActivity} kundir o'qishmabsiz. Keling, 10 daqiqalik mashq qilaylik, chunki kecha kelishiklarda xato qilgandingiz.`;
    } else if (recentMistakes.length > 3) {
      messageType = 'correction';
      priority = 7;
      const mistakeWord = recentMistakes[0].word;
      content = `E'tibor bering, "${mistakeWord}" so'zida ko'p xato qilyapsiz. Keling, birgalikda ishlaymiz.`;
    } else if (recentLessons.length === 0) {
      messageType = 'proactive';
      priority = 6;
      content = 'Bugun yangi darsni boshlaymizmi? Sizning darajangizga mos dars tayyorladim.';
    } else {
      // Generate personalized message with AI
      if (this.openai) {
        try {
          const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a proactive Russian language mentor. Generate a personalized message for the student.
User level: ${user.level}
Recent activity: ${recentLessons.length} lessons today
Recent mistakes: ${recentMistakes.length} mistakes today
Streak: ${user.streak} days

Return JSON format:
{
  "type": "motivation",
  "content": "Personalized message in Uzbek",
  "priority": 5
}`,
              },
            ],
            response_format: { type: 'json_object' },
          });

          const parsed = JSON.parse(response.choices[0].message.content || '{}');
          messageType = parsed.type;
          content = parsed.content;
          priority = parsed.priority;
        } catch (err) {
          this.logger.error('AI message generation failed, using fallback', err.message);
          content = 'Bugun rus tilida o\'rganishda davom etaylik! Siz yaxshi qilyapsiz.';
        }
      } else {
        content = 'Bugun rus tilida o\'rganishda davom etaylik! Siz yaxshi qilyapsiz.';
      }
    }

    // Save mentor message
    const mentorMessage = await this.prisma.mentorMessage.create({
      data: {
        userId,
        type: messageType,
        content,
        priority,
      },
    });

    return mentorMessage;
  }

  async getMentorMessages(userId: string, unreadOnly: boolean = false) {
    const where: any = { userId };
    if (unreadOnly) {
      where.read = false;
    }

    return this.prisma.mentorMessage.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 20,
    });
  }

  async markMessageAsRead(messageId: string) {
    return this.prisma.mentorMessage.update({
      where: { id: messageId },
      data: { read: true },
    });
  }

  async markMessageAsActionTaken(messageId: string) {
    return this.prisma.mentorMessage.update({
      where: { id: messageId },
      data: { actionTaken: true, read: true },
    });
  }

  async analyzeUserEmotion(userId: string, speechText: string, speechSpeed: number) {
    if (!this.openai) {
      return this.generateFallbackEmotionAnalysis(speechSpeed);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Analyze the user's emotional state from their speech.
Speech text: "${speechText}"
Speech speed: ${speechSpeed} words per minute

Return JSON format:
{
  "emotion": "confident" | "anxious" | "hesitant" | "excited" | "neutral",
  "confidence": 0.85,
  "feedback": "You seem confident today!",
  "recommendation": "Try a more challenging exercise"
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      
      // Save to timeline
      await this.prisma.timelineEvent.create({
        data: {
          userId,
          eventType: 'emotion_analysis',
          description: `Emotion detected: ${parsed.emotion}`,
          metadata: parsed,
          date: new Date(),
        },
      });

      return parsed;
    } catch (err) {
      this.logger.error('AI emotion analysis failed, using fallback', err.message);
      return this.generateFallbackEmotionAnalysis(speechSpeed);
    }
  }

  private generateFallbackEmotionAnalysis(speechSpeed: number) {
    let emotion = 'neutral';
    let confidence = 0.5;
    let feedback = 'Continue practicing!';
    let recommendation = 'Keep up the good work';

    if (speechSpeed < 50) {
      emotion = 'hesitant';
      confidence = 0.4;
      feedback = 'Bugun ishonching pasaygan ko\'rinadi.';
      recommendation = 'Avval oson mashq qilamiz';
    } else if (speechSpeed > 120) {
      emotion = 'excited';
      confidence = 0.7;
      feedback = 'Bugun juda hayajonli ko\'rinapsiz!';
      recommendation = 'Ehtiyot bo\'ling, ravon gapiring';
    }

    return {
      emotion,
      confidence,
      feedback,
      recommendation,
    };
  }

  async explainLikeIm10(userId: string, concept: string, targetAudience: string = 'child') {
    if (!this.openai) {
      return this.generateFallbackExplanation(concept, targetAudience);
    }

    try {
      const audienceMap: Record<string, string> = {
        child: '5 yoshli bola',
        it_specialist: 'IT mutaxassisi',
        russian_speaker: 'Rus tilini biladigan o\'zbek',
        general: 'umumiy auditoriya',
      };

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Explain this Russian grammar concept simply for a ${audienceMap[targetAudience] || 'general audience'}.
Concept: ${concept}

Return JSON format:
{
  "explanation": "Simple explanation in Uzbek",
  "examples": ["example 1", "example 2"],
  "keyPoints": ["point 1", "point 2"]
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      return parsed;
    } catch (err) {
      this.logger.error('AI explanation failed, using fallback', err.message);
      return this.generateFallbackExplanation(concept, targetAudience);
    }
  }

  private generateFallbackExplanation(concept: string, targetAudience: string) {
    return {
      explanation: `${concept} - bu rus tilidagi muhim tushuncha. Oddiy qilib aytganda, bu gap tuzish qoidasi.`,
      examples: [
        'Misol 1: Men kitob o\'qiyman.',
        'Misol 2: Siz rus tilida gapirasiz.',
      ],
      keyPoints: [
        'Asosiy qoidani eslab qoling',
        'Mishollar orqali o\'rganing',
        'Amaliyotda qo\'llang',
      ],
    };
  }
}
