import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Level } from '@prisma/client';

@Injectable()
export class CertificationService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(CertificationService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // CEFR Certification - Monthly Exams
  async generateExam(userId: string, targetLevel: Level) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        lessons: { include: { lesson: true } },
        knowledgeNodes: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!this.openai) {
      return this.generateFallbackExam(targetLevel);
    }

    try {
      const weakTopics = user.weakTopics || [];
      const strongTopics = user.strongTopics || [];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a Russian language examiner. Generate a CEFR ${targetLevel} level exam.
User's current level: ${user.level}
Weak topics: ${weakTopics.join(', ') || 'None'}
Strong topics: ${strongTopics.join(', ') || 'None'}

Return JSON format:
{
  "exam": {
    "title": "CEFR ${targetLevel} Exam",
    "duration": 60,
    "sections": [
      {
        "type": "reading",
        "questions": [
          {
            "id": 1,
            "text": "Russian text",
            "question": "Question in Uzbek",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": "A"
          }
        ]
      },
      {
        "type": "listening",
        "questions": [
          {
            "id": 2,
            "transcript": "Russian audio transcript",
            "question": "Question in Uzbek",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": "B"
          }
        ]
      },
      {
        "type": "grammar",
        "questions": [
          {
            "id": 3,
            "question": "Fill in the blank",
            "sentence": "Я ___ студент.",
            "options": ["есть", "являюсь", "был", "буду"],
            "correctAnswer": "B"
          }
        ]
      },
      {
        "type": "writing",
        "prompt": "Write about your family in Russian (50-100 words)"
      },
      {
        "type": "speaking",
        "prompts": [
          "Introduce yourself in Russian",
          "Describe your daily routine"
        ]
      }
    ],
    "passingScore": 70
  }
}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      return parsed;
    } catch (err) {
      this.logger.error('AI exam generation failed, using fallback', err.message);
      return this.generateFallbackExam(targetLevel);
    }
  }

  private generateFallbackExam(level: Level) {
    return {
      exam: {
        title: `CEFR ${level} Exam`,
        duration: 60,
        sections: [
          {
            type: 'grammar',
            questions: [
              {
                id: 1,
                question: 'To\'g\'ri javobni tanlang:',
                sentence: 'Меня зовут ___',
                options: ['он', 'она', 'они', 'я'],
                correctAnswer: 'D',
              },
              {
                id: 2,
                question: 'To\'g\'ri javobni tanlang:',
                sentence: 'Это ___ книга.',
                options: ['мой', 'моя', 'моё', 'мои'],
                correctAnswer: 'B',
              },
            ],
          },
          {
            type: 'vocabulary',
            questions: [
              {
                id: 3,
                question: '"Salom" so\'zining ruschasini tanlang:',
                options: ['Пока', 'Привет', 'Спасибо', 'Да'],
                correctAnswer: 'B',
              },
            ],
          },
          {
            type: 'writing',
            prompt: 'O\'zingiz haqingizda 50-100 so\'zda rus tilida yozing',
          },
        ],
        passingScore: 70,
      },
    };
  }

  async submitExam(userId: string, answers: any) {
    // Calculate score
    let correctAnswers = 0;
    let totalQuestions = 0;

    for (const section of answers.sections || []) {
      if (section.type === 'writing' || section.type === 'speaking') {
        // These need AI grading
        continue;
      }

      for (const question of section.questions || []) {
        totalQuestions++;
        if (question.userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      }
    }

    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Determine CEFR level based on score
    let certifiedLevel: Level;
    if (score >= 90) certifiedLevel = Level.B2;
    else if (score >= 80) certifiedLevel = Level.B1;
    else if (score >= 70) certifiedLevel = Level.A2;
    else if (score >= 60) certifiedLevel = Level.A1;
    else certifiedLevel = Level.A0;

    // Create certification record
    const certification = await this.prisma.certification.create({
      data: {
        userId,
        level: certifiedLevel,
        score,
        examDate: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Update user level if improved
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const levelOrder = [Level.A0, Level.A1, Level.A2, Level.B1, Level.B2];
    if (levelOrder.indexOf(certifiedLevel) > levelOrder.indexOf(user?.level || Level.A0)) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { level: certifiedLevel },
      });
    }

    return {
      certification,
      passed: score >= 70,
      score,
      certifiedLevel,
    };
  }

  async getUserCertifications(userId: string) {
    return this.prisma.certification.findMany({
      where: { userId },
      orderBy: { examDate: 'desc' },
    });
  }

  async generateCertificate(userId: string, certificationId: string) {
    const certification = await this.prisma.certification.findFirst({
      where: { id: certificationId, userId },
      include: { user: true },
    });

    if (!certification) {
      throw new Error('Certification not found');
    }

    // In production, this would generate a PDF certificate
    // For now, return a mock URL
    const certificateUrl = `https://rustiliai.com/certificates/${certificationId}.pdf`;

    await this.prisma.certification.update({
      where: { id: certificationId },
      data: { certificateUrl },
    });

    return {
      certificateUrl,
      certificate: {
        name: certification.user.name || 'Student',
        level: certification.level,
        score: certification.score,
        date: certification.examDate,
        expiresAt: certification.expiresAt,
      },
    };
  }
}
