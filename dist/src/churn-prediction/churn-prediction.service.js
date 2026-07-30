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
var ChurnPredictionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChurnPredictionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let ChurnPredictionService = ChurnPredictionService_1 = class ChurnPredictionService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = null;
        this.logger = new common_1.Logger(ChurnPredictionService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && apiKey !== 'your-openai-api-key') {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async predictChurnRisk(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const factors = await this.calculateChurnFactors(userId);
        const riskScore = this.calculateRiskScore(factors);
        const riskLevel = this.getRiskLevel(riskScore);
        const predictedChurnDate = this.predictChurnDate(riskScore, user.lastActiveAt);
        const existing = await this.prisma.churnRisk.findUnique({
            where: { userId },
        });
        if (existing) {
            return this.prisma.churnRisk.update({
                where: { userId },
                data: {
                    riskScore,
                    riskLevel,
                    predictedChurnDate,
                    factors,
                },
            });
        }
        return this.prisma.churnRisk.create({
            data: {
                userId,
                riskScore,
                riskLevel,
                predictedChurnDate,
                factors,
            },
        });
    }
    async calculateChurnFactors(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        const now = new Date();
        const daysSinceLastActive = Math.floor((now.getTime() - user.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24));
        const recentEvaluations = await this.prisma.skillEvaluation.count({
            where: {
                userId,
                evaluatedAt: {
                    gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                },
            },
        });
        const recentMissions = await this.prisma.dailyMission.count({
            where: {
                userId,
                date: {
                    gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                },
            },
        });
        const recentChats = await this.prisma.chat.count({
            where: {
                userId,
                createdAt: {
                    gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
                },
            },
        });
        const engagementScore = (recentEvaluations * 2) + (recentMissions * 3) + (recentChats * 1);
        const streakFactor = user.streak > 0 ? 1 - (user.streak / 100) : 0.5;
        const xpGrowth = user.xp > 0 ? 1 : 0.3;
        return {
            inactivity: Math.min(1, daysSinceLastActive / 30),
            lowEngagement: Math.max(0, 1 - (engagementScore / 20)),
            streak: streakFactor,
            xpGrowth: xpGrowth,
            daysSinceLastActive,
            engagementScore,
            recentEvaluations,
            recentMissions,
            recentChats,
        };
    }
    calculateRiskScore(factors) {
        const weights = {
            inactivity: 0.4,
            lowEngagement: 0.3,
            streak: 0.2,
            xpGrowth: 0.1,
        };
        const riskScore = (factors.inactivity * weights.inactivity) +
            (factors.lowEngagement * weights.lowEngagement) +
            ((1 - factors.streak) * weights.streak) +
            ((1 - factors.xpGrowth) * weights.xpGrowth);
        return Math.round(riskScore * 100);
    }
    getRiskLevel(riskScore) {
        if (riskScore >= 80)
            return 'critical';
        if (riskScore >= 60)
            return 'high';
        if (riskScore >= 40)
            return 'medium';
        return 'low';
    }
    predictChurnDate(riskScore, lastActiveAt) {
        if (riskScore < 50)
            return null;
        const daysToChurn = Math.round((100 - riskScore) / 10);
        const churnDate = new Date(lastActiveAt.getTime() + daysToChurn * 24 * 60 * 60 * 1000);
        return churnDate;
    }
    async getChurnRisk(userId) {
        return this.prisma.churnRisk.findUnique({
            where: { userId },
        });
    }
    async sendIntervention(userId, interventionType) {
        const churnRisk = await this.prisma.churnRisk.findUnique({
            where: { userId },
        });
        if (!churnRisk) {
            throw new Error('Churn risk not found for user');
        }
        switch (interventionType) {
            case 'bonus':
                await this.prisma.user.update({
                    where: { id: userId },
                    data: { coins: { increment: 50 } },
                });
                break;
            case 'mission':
                await this.prisma.mentorMessage.create({
                    data: {
                        userId,
                        type: 'motivation',
                        content: 'Sizni sog\'indik! Maxsus vazifa tayyorladik.',
                        priority: 8,
                    },
                });
                break;
            case 'reminder':
                await this.prisma.mentorMessage.create({
                    data: {
                        userId,
                        type: 'reminder',
                        content: 'Keling, davom etaylik. Siz yaxshi qilyapsiz!',
                        priority: 6,
                    },
                });
                break;
        }
        return this.prisma.churnRisk.update({
            where: { userId },
            data: {
                interventionSent: true,
                interventionType,
            },
        });
    }
    async getHighRiskUsers(threshold = 60) {
        return this.prisma.churnRisk.findMany({
            where: {
                riskScore: { gte: threshold },
                interventionSent: false,
            },
            include: {
                user: true,
            },
            orderBy: {
                riskScore: 'desc',
            },
        });
    }
    async getChurnStats() {
        const allRisks = await this.prisma.churnRisk.findMany();
        const total = allRisks.length;
        const critical = allRisks.filter((r) => r.riskLevel === 'critical').length;
        const high = allRisks.filter((r) => r.riskLevel === 'high').length;
        const medium = allRisks.filter((r) => r.riskLevel === 'medium').length;
        const low = allRisks.filter((r) => r.riskLevel === 'low').length;
        const avgRisk = total > 0 ? allRisks.reduce((sum, r) => sum + r.riskScore, 0) / total : 0;
        return {
            total,
            critical,
            high,
            medium,
            low,
            averageRisk: Math.round(avgRisk),
            distribution: {
                critical: total > 0 ? Math.round((critical / total) * 100) : 0,
                high: total > 0 ? Math.round((high / total) * 100) : 0,
                medium: total > 0 ? Math.round((medium / total) * 100) : 0,
                low: total > 0 ? Math.round((low / total) * 100) : 0,
            },
        };
    }
};
exports.ChurnPredictionService = ChurnPredictionService;
exports.ChurnPredictionService = ChurnPredictionService = ChurnPredictionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], ChurnPredictionService);
//# sourceMappingURL=churn-prediction.service.js.map