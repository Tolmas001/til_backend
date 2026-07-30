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
var MemoryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let MemoryService = MemoryService_1 = class MemoryService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = null;
        this.logger = new common_1.Logger(MemoryService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && apiKey !== 'your-openai-api-key') {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async recordMistake(userId, word, mistake, correction, context) {
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
        if (previousMistakes.length >= 2) {
            await this.generateMistakeReminder(userId, word, previousMistakes.length + 1);
        }
        return {
            wordMistake,
            isRecurring: previousMistakes.length >= 2,
            mistakeCount: previousMistakes.length + 1,
        };
    }
    async generateMistakeReminder(userId, word, mistakeCount) {
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
    async getWordMistakes(userId, word) {
        const where = { userId };
        if (word) {
            where.word = word;
        }
        return this.prisma.wordMistake.findMany({
            where,
            orderBy: { date: 'desc' },
            take: 50,
        });
    }
    async getRecurringMistakes(userId) {
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
    async getMistakeTimeline(userId, word) {
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
    analyzeMistakeTrend(mistakes) {
        if (mistakes.length < 3)
            return 'stable';
        const recent = mistakes.slice(-3);
        const older = mistakes.slice(0, -3);
        const recentDates = recent.map((m) => new Date(m.date).getTime());
        const olderDates = older.map((m) => new Date(m.date).getTime());
        const recentInterval = recentDates[recentDates.length - 1] - recentDates[0];
        const olderInterval = olderDates[olderDates.length - 1] - olderDates[0];
        if (recentInterval > olderInterval * 1.5)
            return 'improving';
        if (recentInterval < olderInterval * 0.7)
            return 'worsening';
        return 'stable';
    }
    async explainMistake(userId, original, corrected) {
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
        }
        catch (err) {
            this.logger.error('AI mistake explanation failed, using fallback', err.message);
            return this.generateFallbackMistakeExplanation(original, corrected);
        }
    }
    generateFallbackMistakeExplanation(original, corrected) {
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
    async getMistakeExplanations(userId) {
        return this.prisma.mistakeExplanation.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }
    async markExplanationAsReviewed(explanationId) {
        return this.prisma.mistakeExplanation.update({
            where: { id: explanationId },
            data: { reviewed: true },
        });
    }
    async generateReviewSession(userId, type) {
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
        let content = {};
        if (type === 'forgotten_words') {
            const recurringMistakes = await this.getRecurringMistakes(userId);
            content = {
                type,
                words: recurringMistakes.slice(0, 5),
                exercises: recurringMistakes.slice(0, 5).map((m) => ({
                    word: m.word,
                    task: `"${m.word}" so'zini to'g'ri ishlating`,
                })),
            };
        }
        else if (type === 'difficult_grammar') {
            const explanations = await this.getMistakeExplanations(userId);
            content = {
                type,
                rules: explanations.slice(0, 3).map((e) => ({
                    rule: e.rule,
                    explanation: e.explanation,
                })),
            };
        }
        else if (type === 'dialog_review') {
            content = {
                type,
                dialogs: user.chatMessages.slice(0, 3).map((m) => ({
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
    async completeReviewSession(sessionId, score) {
        return this.prisma.reviewSession.update({
            where: { id: sessionId },
            data: {
                completed: true,
                score,
            },
        });
    }
    async getReviewSessions(userId) {
        return this.prisma.reviewSession.findMany({
            where: { userId },
            orderBy: { generatedAt: 'desc' },
            take: 20,
        });
    }
};
exports.MemoryService = MemoryService;
exports.MemoryService = MemoryService = MemoryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], MemoryService);
//# sourceMappingURL=memory.service.js.map