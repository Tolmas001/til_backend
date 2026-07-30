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
var DailyMissionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyMissionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let DailyMissionService = DailyMissionService_1 = class DailyMissionService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = null;
        this.logger = new common_1.Logger(DailyMissionService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && apiKey !== 'your-openai-api-key') {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async generateDailyMission(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const existingMission = await this.prisma.dailyMission.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today,
                },
            },
        });
        if (existingMission) {
            return existingMission;
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (!this.openai) {
            return this.generateFallbackMission(userId, user.level);
        }
        try {
            const contexts = ['restaurant', 'hotel', 'airport', 'shopping', 'doctor', 'bank', 'taxi'];
            const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `Generate a unique daily mission for Russian language learning.
User level: ${user.level}
Context: ${randomContext}

Return JSON format:
{
  "mission": "Specific mission description in Uzbek",
  "context": "${randomContext}",
  "objectives": ["objective 1", "objective 2"],
  "estimatedMinutes": 15
}`,
                    },
                ],
                response_format: { type: 'json_object' },
            });
            const parsed = JSON.parse(response.choices[0].message.content || '{}');
            const mission = await this.prisma.dailyMission.create({
                data: {
                    userId,
                    date: today,
                    mission: parsed.mission,
                    context: parsed.context,
                    completed: false,
                },
            });
            return mission;
        }
        catch (err) {
            this.logger.error('AI mission generation failed, using fallback', err.message);
            return this.generateFallbackMission(userId, user.level);
        }
    }
    async generateFallbackMission(userId, level) {
        const missions = [
            {
                mission: 'Bugun restoranda ovqat buyurtma bering. Menyuni o\'qing va 3 ta taom nomini rus tilida ayting.',
                context: 'restaurant',
            },
            {
                mission: 'Bugun mehmonxonada xona bron qiling. Xona turlari va narxlari haqida so\'rang.',
                context: 'hotel',
            },
            {
                mission: 'Bugun aeroportda yo\'l bilan bog\'liq 5 ta savol javobini o\'rganing.',
                context: 'airport',
            },
            {
                mission: 'Bugun do\'konda xarid qiling. Narhlar va to\'lov haqida gapiring.',
                context: 'shopping',
            },
            {
                mission: 'Bugun shifokor bilan tibbiy yordam so\'rang. Simptomlarni tushuntiring.',
                context: 'doctor',
            },
            {
                mission: 'Bugun bankda pul o\'tkazish haqida so\'rang. Hisob raqami va kartalar haqida bilib oling.',
                context: 'bank',
            },
            {
                mission: 'Bugun taksi chaqiring. Manzil va narh haqida gapiring.',
                context: 'taxi',
            },
        ];
        const randomMission = missions[Math.floor(Math.random() * missions.length)];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const mission = await this.prisma.dailyMission.create({
            data: {
                userId,
                date: today,
                mission: randomMission.mission,
                context: randomMission.context,
                completed: false,
            },
        });
        return mission;
    }
    async getTodayMission(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return this.prisma.dailyMission.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: today,
                },
            },
        });
    }
    async completeMission(userId, missionId, score) {
        const mission = await this.prisma.dailyMission.update({
            where: {
                id: missionId,
                userId,
            },
            data: {
                completed: true,
                score,
            },
        });
        if (score >= 70) {
            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    xp: { increment: 20 },
                    coins: { increment: 10 },
                },
            });
        }
        return {
            mission,
            passed: score >= 70,
            rewards: score >= 70 ? { xp: 20, coins: 10 } : null,
        };
    }
    async getMissionHistory(userId, limit = 30) {
        return this.prisma.dailyMission.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: limit,
        });
    }
    async getMissionStats(userId) {
        const missions = await this.prisma.dailyMission.findMany({
            where: { userId },
        });
        const total = missions.length;
        const completed = missions.filter((m) => m.completed).length;
        const avgScore = missions
            .filter((m) => m.score !== null)
            .reduce((sum, m) => sum + (m.score || 0), 0) / (missions.filter((m) => m.score !== null).length || 1);
        const contextStats = {};
        missions.forEach((m) => {
            contextStats[m.context] = (contextStats[m.context] || 0) + 1;
        });
        return {
            total,
            completed,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            averageScore: Math.round(avgScore),
            contextStats,
            streak: this.calculateMissionStreak(missions),
        };
    }
    calculateMissionStreak(missions) {
        const sorted = missions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        for (const mission of sorted) {
            const missionDate = new Date(mission.date);
            missionDate.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((currentDate.getTime() - missionDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays === streak && mission.completed) {
                streak++;
                currentDate = missionDate;
            }
            else {
                break;
            }
        }
        return streak;
    }
};
exports.DailyMissionService = DailyMissionService;
exports.DailyMissionService = DailyMissionService = DailyMissionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], DailyMissionService);
//# sourceMappingURL=daily-mission.service.js.map