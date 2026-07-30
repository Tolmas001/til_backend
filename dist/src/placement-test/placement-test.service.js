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
var PlacementTestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacementTestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let PlacementTestService = PlacementTestService_1 = class PlacementTestService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = null;
        this.logger = new common_1.Logger(PlacementTestService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && apiKey !== 'your-openai-api-key') {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async generatePlacementTest(userId) {
        if (!this.openai) {
            return this.generateFallbackPlacementTest();
        }
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `Generate a 10-minute Russian language placement test.
The test should assess: Grammar, Listening, Speaking, Vocabulary, Pronunciation.

Return JSON format:
{
  "grammar": {
    "question": "Grammar question in Russian",
    "options": ["A", "B", "C", "D"],
    "correct": "A",
    "explanation": "Explanation in Uzbek"
  },
  "listening": {
    "transcript": "Russian text for listening",
    "question": "Question about the text",
    "options": ["A", "B", "C", "D"],
    "correct": "B"
  },
  "speaking": {
    "prompt": "Speaking prompt in Russian",
    "expectedResponse": "Expected response"
  },
  "vocabulary": {
    "words": [
      {"word": "слово", "translation": "translation"},
      {"word": "слово2", "translation": "translation2"}
    ]
  },
  "pronunciation": {
    "phrase": "Phrase to pronounce",
    "transcription": "transcription"
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
            this.logger.error('AI placement test generation failed, using fallback', err.message);
            return this.generateFallbackPlacementTest();
        }
    }
    generateFallbackPlacementTest() {
        return {
            grammar: {
                question: 'Я _____ книгу.',
                options: ['читаю', 'читать', 'читал', 'чтение'],
                correct: 'читаю',
                explanation: 'Men kitob o\'qiyman. Hozirgi zamon fe\'l.',
            },
            listening: {
                transcript: 'Меня зовут Анна. Я из Москвы.',
                question: 'Qayerdan kelgan?',
                options: ['Ташкент', 'Москва', 'Санкт-Петербург', 'Киев'],
                correct: 'Москва',
            },
            speaking: {
                prompt: 'O\'zingiz haqingizda gapiring.',
                expectedResponse: 'Меня зовут...',
            },
            vocabulary: {
                words: [
                    { word: 'книга', translation: 'kitob' },
                    { word: 'стол', translation: 'stol' },
                    { word: 'дом', translation: 'uy' },
                    { word: 'вода', translation: 'suv' },
                    { word: 'друг', translation: 'do\'st' },
                ],
            },
            pronunciation: {
                phrase: 'Здравствуйте',
                transcription: 'Zdravstvuyte',
            },
        };
    }
    async submitPlacementTest(userId, answers) {
        const grammarScore = this.calculateGrammarScore(answers.grammar);
        const listeningScore = this.calculateListeningScore(answers.listening);
        const speakingScore = this.calculateSpeakingScore(answers.speaking);
        const vocabularyScore = answers.vocabulary;
        const pronunciationScore = answers.pronunciation;
        const overallScore = Math.round((grammarScore + listeningScore + speakingScore + vocabularyScore + pronunciationScore) / 5);
        const suggestedLevel = this.determineLevel(overallScore);
        const existing = await this.prisma.placementTest.findUnique({
            where: { userId },
        });
        if (existing) {
            const updated = await this.prisma.placementTest.update({
                where: { userId },
                data: {
                    grammarScore,
                    listeningScore,
                    speakingScore,
                    vocabularyScore,
                    pronunciationScore,
                    overallScore,
                    suggestedLevel: suggestedLevel,
                    completedAt: new Date(),
                },
            });
            await this.prisma.user.update({
                where: { id: userId },
                data: { level: suggestedLevel },
            });
            return updated;
        }
        const placementTest = await this.prisma.placementTest.create({
            data: {
                userId,
                grammarScore,
                listeningScore,
                speakingScore,
                vocabularyScore,
                pronunciationScore,
                overallScore,
                suggestedLevel: suggestedLevel,
                completedAt: new Date(),
            },
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: { level: suggestedLevel },
        });
        return placementTest;
    }
    calculateGrammarScore(answer) {
        const correctAnswers = ['читаю', 'читал', 'читают'];
        if (correctAnswers.includes(answer)) {
            return 85;
        }
        return 60;
    }
    calculateListeningScore(answer) {
        const correctAnswers = ['Москва', 'Москве'];
        if (correctAnswers.includes(answer)) {
            return 90;
        }
        return 55;
    }
    calculateSpeakingScore(answer) {
        const wordCount = answer.split(' ').length;
        if (wordCount >= 5) {
            return 80;
        }
        return 50;
    }
    determineLevel(score) {
        if (score >= 90)
            return 'B2';
        if (score >= 80)
            return 'B1';
        if (score >= 70)
            return 'A2';
        if (score >= 60)
            return 'A1';
        return 'A0';
    }
    async getPlacementTestResult(userId) {
        return this.prisma.placementTest.findUnique({
            where: { userId },
        });
    }
    async retakePlacementTest(userId) {
        await this.prisma.placementTest.delete({
            where: { userId },
        });
        return this.generatePlacementTest(userId);
    }
};
exports.PlacementTestService = PlacementTestService;
exports.PlacementTestService = PlacementTestService = PlacementTestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PlacementTestService);
//# sourceMappingURL=placement-test.service.js.map