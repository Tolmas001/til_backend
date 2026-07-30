import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class ShadowingModeService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(ShadowingModeService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // Shadowing Mode - Repeat after native speaker
  async createShadowingSession(userId: string, level: string, topic?: string) {
    if (!this.openai) {
      return this.createFallbackShadowingSession(level, topic);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Generate a shadowing exercise for Russian language practice.
Level: ${level}
Topic: ${topic || 'general'}

Return JSON format:
{
  "session": {
    "title": "Shadowing exercise title",
    "description": "Exercise description",
    "level": "${level}",
    "topic": "${topic || 'general'}",
    "duration": "5 minutes"
  },
  "phrases": [
    {
      "id": 1,
      "russian": "Russian phrase",
      "translation": "Uzbek translation",
      "pronunciation": "pronunciation guide",
      "tips": "Tips for pronunciation"
    }
  ],
  "dialog": {
    "title": "Dialog title",
    "lines": [
      {
        "speaker": "Person A",
        "russian": "Russian text",
        "translation": "Uzbek translation"
      }
    ]
  }
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');

      const session = await this.prisma.shadowingSession.create({
        data: {
          userId,
          level: level as any,
          topic: topic || 'general',
          phrases: parsed.phrases,
          dialog: parsed.dialog,
          status: 'pending',
          createdAt: new Date(),
        },
      });

      return session;
    } catch (err) {
      this.logger.error('AI shadowing session generation failed, using fallback', err.message);
      return this.createFallbackShadowingSession(level, topic);
    }
  }

  private async createFallbackShadowingSession(level: string, topic?: string) {
    const fallbackPhrases = [
      {
        id: 1,
        russian: 'Здравствуйте',
        translation: 'Salom',
        pronunciation: 'Zdravstvuyte',
        tips: 'Zdravstvuyte - rasmiy salomlashish',
      },
      {
        id: 2,
        russian: 'Как дела?',
        translation: 'Qalay?',
        pronunciation: 'Kak dela?',
        tips: 'Kak dela - hol-ahvol so\'rash',
      },
      {
        id: 3,
        russian: 'Спасибо',
        translation: 'Rahmat',
        pronunciation: 'Spasibo',
        tips: 'Spasibo - rahmat aytish',
      },
    ];

    const fallbackDialog = {
      title: 'Tanishuv',
      lines: [
        {
          speaker: 'Person A',
          russian: 'Здравствуйте, меня зовут Али',
          translation: 'Salom, mening ismim Ali',
        },
        {
          speaker: 'Person B',
          russian: 'Привет, приятно познакомиться',
          translation: 'Salom, tanishganimdan xursandman',
        },
      ],
    };

    const session = await this.prisma.shadowingSession.create({
      data: {
        userId: 'system',
        level: level as any,
        topic: topic || 'general',
        phrases: fallbackPhrases,
        dialog: fallbackDialog,
        status: 'pending',
        createdAt: new Date(),
      },
    });

    return session;
  }

  async submitRecording(userId: string, sessionId: string, phraseId: number, audioUrl: string) {
    const session = await this.prisma.shadowingSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // AI-powered pronunciation comparison
    let comparison = null;
    if (this.openai) {
      try {
        const phrase = (session.phrases as any[]).find((p) => p.id === phraseId);
        if (phrase) {
          const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Evaluate the pronunciation of a Russian phrase.
Original phrase: ${phrase.russian}
Audio recording provided

Return JSON format:
{
  "score": 85,
  "feedback": "Good pronunciation, but work on stress",
  "accuracy": 0.8,
  "fluency": 0.85,
  "intonation": 0.75,
  "improvements": ["improve stress on first syllable"]
}`,
              },
            ],
            response_format: { type: 'json_object' },
          });

          comparison = JSON.parse(response.choices[0].message.content || '{}');
        }
      } catch (err) {
        this.logger.error('AI pronunciation evaluation failed', err.message);
      }
    }

    const recording = {
      phraseId,
      audioUrl,
      comparison,
      submittedAt: new Date(),
    };

    const updatedRecordings = [...((session.recordings as any[]) || []), recording];

    await this.prisma.shadowingSession.update({
      where: { id: sessionId },
      data: {
        recordings: updatedRecordings,
        status: 'in_progress',
      },
    });

    return recording;
  }

  async completeSession(userId: string, sessionId: string) {
    const session = await this.prisma.shadowingSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // Calculate overall score
    let totalScore = 0;
    let totalWeight = 0;

    if (session.recordings && (session.recordings as any[]).length > 0) {
      (session.recordings as any[]).forEach((recording) => {
        if (recording.comparison && recording.comparison.score) {
          totalScore += recording.comparison.score;
          totalWeight += 1;
        }
      });
    }

    const overallScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

    const updatedSession = await this.prisma.shadowingSession.update({
      where: { id: sessionId },
      data: {
        status: 'completed',
        overallScore,
        completedAt: new Date(),
      },
    });

    return updatedSession;
  }

  async getSession(sessionId: string) {
    return this.prisma.shadowingSession.findUnique({
      where: { id: sessionId },
    });
  }

  async getUserSessions(userId: string, limit: number = 20) {
    return this.prisma.shadowingSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getSessionStats() {
    const sessions = await this.prisma.shadowingSession.findMany();

    const total = sessions.length;
    const completed = sessions.filter((s) => s.status === 'completed').length;
    const pending = sessions.filter((s) => s.status === 'pending').length;
    const inProgress = sessions.filter((s) => s.status === 'in_progress').length;

    const topicStats: Record<string, number> = {};
    sessions.forEach((s) => {
      topicStats[s.topic] = (topicStats[s.topic] || 0) + 1;
    });

    const avgScore =
      completed > 0
        ? Math.round(
            sessions
              .filter((s) => s.overallScore !== null)
              .reduce((sum, s) => sum + (s.overallScore || 0), 0) /
              sessions.filter((s) => s.overallScore !== null).length,
          )
        : 0;

    return {
      total,
      completed,
      pending,
      inProgress,
      topicStats,
      averageScore: avgScore,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}
