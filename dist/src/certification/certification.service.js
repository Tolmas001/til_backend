"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CertificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
const client_1 = require("@prisma/client");
let CertificationService = CertificationService_1 = class CertificationService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = null;
        this.logger = new common_1.Logger(CertificationService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && apiKey !== 'your-openai-api-key') {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async generateExam(userId, targetLevel) {
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
        }
        catch (err) {
            this.logger.error('AI exam generation failed, using fallback', err.message);
            return this.generateFallbackExam(targetLevel);
        }
    }
    generateFallbackExam(level) {
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
    async submitExam(userId, answers) {
        let correctAnswers = 0;
        let totalQuestions = 0;
        for (const section of answers.sections || []) {
            if (section.type === 'writing' || section.type === 'speaking') {
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
        let certifiedLevel;
        if (score >= 90)
            certifiedLevel = client_1.Level.B2;
        else if (score >= 80)
            certifiedLevel = client_1.Level.B1;
        else if (score >= 70)
            certifiedLevel = client_1.Level.A2;
        else if (score >= 60)
            certifiedLevel = client_1.Level.A1;
        else
            certifiedLevel = client_1.Level.A0;
        const certification = await this.prisma.certification.create({
            data: {
                userId,
                level: certifiedLevel,
                score,
                examDate: new Date(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const levelOrder = [client_1.Level.A0, client_1.Level.A1, client_1.Level.A2, client_1.Level.B1, client_1.Level.B2];
        if (levelOrder.indexOf(certifiedLevel) > levelOrder.indexOf(user?.level || client_1.Level.A0)) {
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
    async getUserCertifications(userId) {
        return this.prisma.certification.findMany({
            where: { userId },
            orderBy: { examDate: 'desc' },
        });
    }
    async generateCertificate(userId, certificationId) {
        const certification = await this.prisma.certification.findFirst({
            where: { id: certificationId, userId },
            include: { user: true },
        });
        if (!certification) {
            throw new Error('Certification not found');
        }
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
};
exports.CertificationService = CertificationService;
exports.CertificationService = CertificationService = CertificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], CertificationService);
//# sourceMappingURL=certification.service.js.map