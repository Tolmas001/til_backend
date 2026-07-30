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
var AiLearningService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiLearningService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
const client_1 = require("@prisma/client");
let AiLearningService = AiLearningService_1 = class AiLearningService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = null;
        this.logger = new common_1.Logger(AiLearningService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && apiKey !== 'your-openai-api-key') {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async assessUserLevel(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                lessons: { include: { lesson: true } },
                chatMessages: { take: 100, orderBy: { createdAt: 'desc' } },
                vocabulary: { include: { vocabulary: true } },
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const topicMastery = {};
        const weakTopics = [];
        const strongTopics = [];
        for (const progress of user.lessons) {
            if (progress.completed && progress.score) {
                const lessonTopics = progress.lesson.topics || [];
                for (const topic of lessonTopics) {
                    if (!topicMastery[topic]) {
                        topicMastery[topic] = [];
                    }
                    topicMastery[topic].push(progress.score);
                }
            }
        }
        for (const [topic, scores] of Object.entries(topicMastery)) {
            const scoreArray = scores;
            const avgScore = scoreArray.reduce((a, b) => a + b, 0) / scoreArray.length;
            if (avgScore < 60) {
                weakTopics.push(topic);
            }
            else if (avgScore > 85) {
                strongTopics.push(topic);
            }
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                weakTopics,
                strongTopics,
            },
        });
        return {
            weakTopics,
            strongTopics,
            topicMastery,
            recommendedLevel: this.calculateRecommendedLevel(user),
        };
    }
    calculateRecommendedLevel(user) {
        const completedLessons = user.lessons.filter((l) => l.completed).length;
        const avgScore = user.lessons.reduce((sum, l) => sum + (l.score || 0), 0) / (user.lessons.length || 1);
        if (completedLessons < 3)
            return client_1.Level.A0;
        if (completedLessons < 8)
            return avgScore > 70 ? client_1.Level.A1 : client_1.Level.A0;
        if (completedLessons < 15)
            return avgScore > 70 ? client_1.Level.A2 : client_1.Level.A1;
        if (completedLessons < 25)
            return avgScore > 70 ? client_1.Level.B1 : client_1.Level.A2;
        return avgScore > 70 ? client_1.Level.B2 : client_1.Level.B1;
    }
    async generatePersonalizedPlan(userId) {
        const assessment = await this.assessUserLevel(userId);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!this.openai) {
            return this.generateFallbackPlan(assessment, user);
        }
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI Russian language tutor. Create a personalized weekly learning plan for a student.
Current level: ${user?.level}
Weak topics: ${assessment.weakTopics.join(', ') || 'None'}
Strong topics: ${assessment.strongTopics.join(', ') || 'None'}
Career goal: ${user?.careerGoal || 'General'}

Return JSON format:
{
  "weeklyPlan": [
    {
      "day": "Monday",
      "focus": "topic to focus on",
      "activities": ["activity 1", "activity 2"],
      "estimatedMinutes": 30
    }
  ],
  "recommendedLessons": ["lesson-id-1", "lesson-id-2"],
  "focusAreas": ["area 1", "area 2"]
}`,
                    },
                ],
                response_format: { type: 'json_object' },
            });
            const parsed = JSON.parse(response.choices[0].message.content || '{}');
            return parsed;
        }
        catch (err) {
            this.logger.error('AI plan generation failed, using fallback', err.message);
            return this.generateFallbackPlan(assessment, user);
        }
    }
    generateFallbackPlan(assessment, user) {
        const focusAreas = assessment.weakTopics.length > 0
            ? assessment.weakTopics
            : ['Salomlashish', 'Asosiy gaplar'];
        return {
            weeklyPlan: [
                {
                    day: 'Monday',
                    focus: focusAreas[0] || 'Salomlashish',
                    activities: ['Darsni o\'rganish', 'AI bilan suhbat'],
                    estimatedMinutes: 30,
                },
                {
                    day: 'Tuesday',
                    focus: focusAreas[1] || 'Sonlar',
                    activities: ['Mashq qilish', 'So\'zlar yodlash'],
                    estimatedMinutes: 25,
                },
                {
                    day: 'Wednesday',
                    focus: 'Gapirish amaliyoti',
                    activities: ['AI suhbat', 'Talaffuz mashqi'],
                    estimatedMinutes: 35,
                },
                {
                    day: 'Thursday',
                    focus: focusAreas[0] || 'Salomlashish',
                    activities: ['Takrorlash', 'Test'],
                    estimatedMinutes: 30,
                },
                {
                    day: 'Friday',
                    focus: 'Grammatika',
                    activities: ['Yangi mavzu', 'Mashq'],
                    estimatedMinutes: 30,
                },
                {
                    day: 'Saturday',
                    focus: 'Hikoya rejimi',
                    activities: ['Ssenariy o\'ynash', 'Dialog'],
                    estimatedMinutes: 40,
                },
                {
                    day: 'Sunday',
                    focus: 'Qayta ko\'rib chiqish',
                    activities: ['Haftalik test', 'Progress ko\'rish'],
                    estimatedMinutes: 25,
                },
            ],
            recommendedLessons: [],
            focusAreas,
        };
    }
    async setCareerGoal(userId, goal) {
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: { careerGoal: goal },
        });
        const recommendations = await this.generateCareerRecommendations(goal, updated.level);
        return { user: updated, recommendations };
    }
    async generateCareerRecommendations(goal, level) {
        const careerContent = {
            [client_1.CareerGoal.WORK_IN_RUSSIA]: {
                focusTopics: ['Ish suhbati', 'CV yozish', 'Professional atamalar'],
                scenarios: ['Ish intervyusi', 'Hamkasblar bilan muloqot'],
                vocabulary: ['rabota', 'zarplata', 'otdel', 'nachalnik'],
            },
            [client_1.CareerGoal.IT_COMPANY]: {
                focusTopics: ['IT terminologiya', 'Texnik hujjatlar', 'Team communication'],
                scenarios: ['Code review', 'Standup meeting', 'Bug reporting'],
                vocabulary: ['programmirovanie', 'komp\'yuter', 'bazadannykh', 'algoritm'],
            },
            [client_1.CareerGoal.UNIVERSITY]: {
                focusTopics: ['Akademik til', 'Lug\'atlar', 'Ilmiy yozuv'],
                scenarios: ['Professor bilan suhbat', 'Seminar', 'Imtihon'],
                vocabulary: ['universitet', 'fakul\'tet', 'lektsiya', 'ekzamen'],
            },
            [client_1.CareerGoal.TRAVEL]: {
                focusTopics: ['Sayohat atamalari', 'Yo\'l yo\'riqnomasi', 'Mehmonxona'],
                scenarios: ['Aeroport', 'Mehmonxona', 'Restoran', 'Savdo'],
                vocabulary: ['puteshestvie', 'otel', 'restoran', 'bilet'],
            },
            [client_1.CareerGoal.BUSINESS]: {
                focusTopics: ['Biznes etiketi', 'Muzokaralar', 'Shartnomalar'],
                scenarios: ['Biznes uchrashuv', 'Muzokara', 'Ta\'dimot'],
                vocabulary: ['biznes', 'kontrakt', 'partner', 'sdelka'],
            },
            [client_1.CareerGoal.GENERAL]: {
                focusTopics: ['Kundalik suhbat', 'Madaniyat', 'Tarix'],
                scenarios: ['Do\'stlar bilan suhbat', 'Telefon', 'Internet'],
                vocabulary: ['privet', 'kak dela', 'spasibo', 'pozhaluysta'],
            },
        };
        return careerContent[goal] || careerContent[client_1.CareerGoal.GENERAL];
    }
    async detectLearningStyle(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                lessons: true,
                chatMessages: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const lessonCompletionRate = user.lessons.filter((l) => l.completed).length / (user.lessons.length || 1);
        const chatActivity = user.chatMessages.length;
        let detectedStyle = client_1.LearningStyle.MIXED;
        if (chatActivity > lessonCompletionRate * 10) {
            detectedStyle = client_1.LearningStyle.AUDITORY;
        }
        else if (lessonCompletionRate > 0.8) {
            detectedStyle = client_1.LearningStyle.READING;
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { learningStyle: detectedStyle },
        });
        return {
            style: detectedStyle,
            recommendations: this.getStyleRecommendations(detectedStyle),
        };
    }
    getStyleRecommendations(style) {
        const recommendations = {
            [client_1.LearningStyle.VISUAL]: [
                'Video darslarni ko\'ring',
                'Infografikalardan foydalaning',
                'Rasmli so\'zlar yodlang',
            ],
            [client_1.LearningStyle.AUDITORY]: [
                'Audio darslarni tinglang',
                'AI bilan ko\'proq suhbatlang',
                'O\'zingiz gapirib yozib oling',
            ],
            [client_1.LearningStyle.KINESTHETIC]: [
                'Amaliy mashqlar qiling',
                'Dialoglarda ishtirok eting',
                'Ssenariylarda o\'ynang',
            ],
            [client_1.LearningStyle.READING]: [
                'Matnlarni o\'qing',
                'Grammatika qoidalarni o\'rganing',
                'Yozma mashqlar qiling',
            ],
            [client_1.LearningStyle.MIXED]: [
                'Barcha usullarni aralashtiring',
                'Turli xil mashqlar qiling',
                'O\'zingizga mos usulni toping',
            ],
        };
        return recommendations[style];
    }
    async updateKnowledgeNode(userId, topic, mastery) {
        const existing = await this.prisma.knowledgeNode.findUnique({
            where: {
                userId_topic: {
                    userId,
                    topic,
                },
            },
        });
        if (existing) {
            return this.prisma.knowledgeNode.update({
                where: { id: existing.id },
                data: {
                    mastery,
                    lastReviewedAt: new Date(),
                    reviewCount: { increment: 1 },
                },
            });
        }
        return this.prisma.knowledgeNode.create({
            data: {
                userId,
                topic,
                mastery,
                lastReviewedAt: new Date(),
                reviewCount: 1,
            },
        });
    }
    async getKnowledgeGraph(userId) {
        const nodes = await this.prisma.knowledgeNode.findMany({
            where: { userId },
            orderBy: { mastery: 'desc' },
        });
        return {
            nodes,
            totalTopics: nodes.length,
            masteredTopics: nodes.filter((n) => n.mastery > 0.8).length,
            weakTopics: nodes.filter((n) => n.mastery < 0.5).map((n) => n.topic),
        };
    }
};
exports.AiLearningService = AiLearningService;
exports.AiLearningService = AiLearningService = AiLearningService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], AiLearningService);
//# sourceMappingURL=ai-learning.service.js.map