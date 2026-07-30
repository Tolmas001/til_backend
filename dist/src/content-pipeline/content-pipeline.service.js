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
var ContentPipelineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentPipelineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let ContentPipelineService = ContentPipelineService_1 = class ContentPipelineService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = null;
        this.logger = new common_1.Logger(ContentPipelineService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && apiKey !== 'your-openai-api-key') {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async generateContent(userId, topic, level) {
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
                    level: level,
                    generatedContent: parsed,
                    status: 'completed',
                    generatedAt: new Date(),
                },
            });
            return contentGeneration;
        }
        catch (err) {
            this.logger.error('AI content generation failed, using fallback', err.message);
            return this.generateFallbackContent(topic, level);
        }
    }
    async generateFallbackContent(topic, level) {
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
                level: level,
                generatedContent: fallbackContent,
                status: 'completed',
                generatedAt: new Date(),
            },
        });
        return contentGeneration;
    }
    async getContentGeneration(id) {
        return this.prisma.contentGeneration.findUnique({
            where: { id },
        });
    }
    async getUserContentGenerations(userId, limit = 20) {
        return this.prisma.contentGeneration.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async deleteContentGeneration(id) {
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
        const levelStats = {};
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
};
exports.ContentPipelineService = ContentPipelineService;
exports.ContentPipelineService = ContentPipelineService = ContentPipelineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], ContentPipelineService);
//# sourceMappingURL=content-pipeline.service.js.map