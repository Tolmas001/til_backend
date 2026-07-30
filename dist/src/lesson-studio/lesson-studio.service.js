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
var LessonStudioService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonStudioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let LessonStudioService = LessonStudioService_1 = class LessonStudioService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = null;
        this.logger = new common_1.Logger(LessonStudioService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && apiKey !== 'your-openai-api-key') {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async generateFullLesson(userId, prompt, level) {
        if (!this.openai) {
            return this.generateFallbackLesson(prompt, level);
        }
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert Russian language teacher and content creator.
Generate a complete lesson based on the user's prompt.
Level: ${level}
Prompt: "${prompt}"

Return JSON format with complete lesson content:
{
  "lesson": {
    "title": "Lesson title in Uzbek",
    "description": "Detailed lesson description",
    "objectives": ["objective 1", "objective 2", "objective 3"],
    "duration": "45 minutes",
    "prerequisites": ["prerequisite 1"]
  },
  "vocabulary": {
    "words": [
      {
        "russian": "слово",
        "translation": "translation",
        "partOfSpeech": "noun",
        "example": "Example sentence in Russian",
        "exampleTranslation": "Example translation in Uzbek"
      }
    ]
  },
  "grammar": {
    "topic": "Grammar topic",
    "explanation": "Detailed explanation in Uzbek",
    "rules": ["rule 1", "rule 2"],
    "examples": [
      {"russian": "Example", "translation": "Translation", "explanation": "Why it's correct"}
    ]
  },
  "dialog": {
    "title": "Dialog title",
    "context": "Dialog context",
    "characters": ["Person A", "Person B"],
    "lines": [
      {
        "speaker": "Person A",
        "russian": "Russian text",
        "uzbek": "Uzbek translation",
        "notes": "Pronunciation or cultural notes"
      }
    ]
  },
  "exercises": {
    "fillInBlanks": [
      {
        "sentence": "Sentence with ___",
        "answer": "answer",
        "hint": "hint"
      }
    ],
    "matching": [
      {
        "pairs": [
          {"russian": "word", "uzbek": "translation"}
        ]
      }
    ],
    "multipleChoice": [
      {
        "question": "Question",
        "options": ["A", "B", "C", "D"],
        "correct": "A",
        "explanation": "Explanation"
      }
    ]
  },
  "speaking": {
    "prompts": [
      {
        "prompt": "Speaking prompt",
        "expectedResponse": "Expected response",
        "vocabulary": ["word1", "word2"]
      }
    ]
  },
  "listening": {
    "transcript": "Russian text for listening",
    "questions": [
      {
        "question": "Question",
        "options": ["A", "B", "C", "D"],
        "correct": "A"
      }
    ]
  },
  "homework": {
    "tasks": [
      {
        "task": "Task description",
        "type": "writing",
        "instructions": "Detailed instructions"
      }
    ]
  },
  "assessment": {
    "criteria": [
      {
        "skill": "vocabulary",
        "weight": 0.3,
        "description": "Vocabulary usage"
      }
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
                    topic: prompt,
                    level: level,
                    generatedContent: parsed,
                    status: 'completed',
                    generatedAt: new Date(),
                },
            });
            const lesson = await this.prisma.lesson.create({
                data: {
                    title: parsed.lesson.title,
                    description: parsed.lesson.description,
                    level: level,
                    topics: [prompt],
                    dialogs: parsed.dialog,
                    order: 0,
                },
            });
            return {
                contentGeneration,
                lesson,
            };
        }
        catch (err) {
            this.logger.error('AI lesson studio generation failed, using fallback', err.message);
            return this.generateFallbackLesson(prompt, level);
        }
    }
    async generateFallbackLesson(prompt, level) {
        const fallbackContent = {
            lesson: {
                title: `${prompt} - ${level} darjasi`,
                description: `${prompt} mavzusidagi asosiy dars`,
                objectives: [
                    `${prompt} bilan tanishish`,
                    'Asosiy so\'zlarni o\'rganish',
                    'Oddiy gapirishni o\'rganish',
                ],
                duration: '45 daqiqa',
                prerequisites: [],
            },
            vocabulary: {
                words: [
                    {
                        russian: 'Здравствуйте',
                        translation: 'Salom',
                        partOfSpeech: 'interjection',
                        example: 'Здравствуйте, меня зовут Али',
                        exampleTranslation: 'Salom, mening ismim Ali',
                    },
                ],
            },
            grammar: {
                topic: 'Salomlashish',
                explanation: 'Rus tilida rasmiy salomlashish uchunЗдравствуйте ishlatiladi',
                rules: ['Здравствуйте - rasmiy salomlashish'],
                examples: [
                    {
                        russian: 'Здравствуйте, как дела?',
                        translation: 'Salom, qalay?',
                        explanation: 'Rasmiy salomlashish va hol-ahvol so\'rash',
                    },
                ],
            },
            dialog: {
                title: 'Tanishuv',
                context: 'Yangi odam bilan tanishish',
                characters: ['Ali', 'Anna'],
                lines: [
                    {
                        speaker: 'Ali',
                        russian: 'Здравствуйте!',
                        uzbek: 'Salom!',
                        notes: 'Rasmiy salomlashish',
                    },
                    {
                        speaker: 'Anna',
                        russian: 'Привет! Как дела?',
                        uzbek: 'Salom! Qalay?',
                        notes: 'Do\'stona salomlashish',
                    },
                ],
            },
            exercises: {
                fillInBlanks: [
                    {
                        sentence: 'Здравствуйте, меня зовут ___',
                        answer: 'Али',
                        hint: 'Ism',
                    },
                ],
                matching: [],
                multipleChoice: [
                    {
                        question: 'Здравствуйте nimani anglatadi?',
                        options: ['Salom', 'Xayr', 'Rahmat', 'Qachon'],
                        correct: 'Salom',
                        explanation: 'Здравствуйте - salomlashish uchun ishlatiladi',
                    },
                ],
            },
            speaking: {
                prompts: [
                    {
                        prompt: 'O\'zingizni tanishtiring',
                        expectedResponse: 'Меня зовут...',
                        vocabulary: ['зовут', 'имя'],
                    },
                ],
            },
            listening: {
                transcript: 'Здравствуйте, меня зовут Анна. Я из Москвы.',
                questions: [
                    {
                        question: 'Qayerdan kelgan?',
                        options: ['Ташкент', 'Москва', 'Санкт-Петербург', 'Киев'],
                        correct: 'Москва',
                    },
                ],
            },
            homework: {
                tasks: [
                    {
                        task: '5 ta yangi so\'zni yodlang',
                        type: 'vocabulary',
                        instructions: 'Darsdagi so\'zlarni yodlang va misollar bilan yozing',
                    },
                ],
            },
            assessment: {
                criteria: [
                    {
                        skill: 'vocabulary',
                        weight: 0.3,
                        description: 'Lug\'at bilimi',
                    },
                ],
            },
        };
        const contentGeneration = await this.prisma.contentGeneration.create({
            data: {
                userId: 'system',
                topic: prompt,
                level: level,
                generatedContent: fallbackContent,
                status: 'completed',
                generatedAt: new Date(),
            },
        });
        return {
            contentGeneration,
            lesson: null,
        };
    }
    async getLessonTemplates() {
        return [
            {
                id: 'basic',
                name: 'Asosiy dars',
                description: 'Vocabulary, grammar, dialog, exercises',
                template: 'basic',
            },
            {
                id: 'conversation',
                name: 'Suhbat darsi',
                description: 'Dialog, speaking, listening',
                template: 'conversation',
            },
            {
                id: 'grammar',
                name: 'Grammatika darsi',
                description: 'Grammar focus with examples',
                template: 'grammar',
            },
            {
                id: 'business',
                name: 'Biznes darsi',
                description: 'Business Russian vocabulary',
                template: 'business',
            },
            {
                id: 'travel',
                name: 'Sayohat darsi',
                description: 'Travel scenarios',
                template: 'travel',
            },
        ];
    }
    async getLessonStats() {
        const lessons = await this.prisma.lesson.findMany();
        const contentGenerations = await this.prisma.contentGeneration.findMany();
        return {
            totalLessons: lessons.length,
            totalGenerated: contentGenerations.length,
            byLevel: {
                A0: lessons.filter((l) => l.level === 'A0').length,
                A1: lessons.filter((l) => l.level === 'A1').length,
                A2: lessons.filter((l) => l.level === 'A2').length,
                B1: lessons.filter((l) => l.level === 'B1').length,
                B2: lessons.filter((l) => l.level === 'B2').length,
            },
        };
    }
};
exports.LessonStudioService = LessonStudioService;
exports.LessonStudioService = LessonStudioService = LessonStudioService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], LessonStudioService);
//# sourceMappingURL=lesson-studio.service.js.map