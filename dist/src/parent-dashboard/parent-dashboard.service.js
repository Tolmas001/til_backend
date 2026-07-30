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
var ParentDashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentDashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ParentDashboardService = ParentDashboardService_1 = class ParentDashboardService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(ParentDashboardService_1.name);
    }
    async getOrganizationDashboard(organizationId) {
        const organization = await this.prisma.organization.findUnique({
            where: { id: organizationId },
            include: {
                members: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        if (!organization) {
            throw new Error('Organization not found');
        }
        const userIds = organization.members.map((m) => m.userId);
        const users = await this.prisma.user.findMany({
            where: {
                id: { in: userIds },
            },
        });
        const totalUsers = users.length;
        const activeUsers = users.filter((u) => {
            const daysSinceActive = Math.floor((new Date().getTime() - u.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24));
            return daysSinceActive <= 7;
        }).length;
        const totalXP = users.reduce((sum, u) => sum + u.xp, 0);
        const avgXP = totalUsers > 0 ? Math.round(totalXP / totalUsers) : 0;
        const levelDistribution = {};
        users.forEach((u) => {
            levelDistribution[u.level] = (levelDistribution[u.level] || 0) + 1;
        });
        const totalCoins = users.reduce((sum, u) => sum + u.coins, 0);
        return {
            organization: {
                id: organization.id,
                name: organization.name,
                type: organization.type,
                subscription: organization.subscription,
            },
            stats: {
                totalUsers,
                activeUsers,
                inactiveUsers: totalUsers - activeUsers,
                totalXP,
                averageXP: avgXP,
                totalCoins,
                levelDistribution,
                engagementRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
            },
        };
    }
    async getUserDashboard(organizationId, userId) {
        const member = await this.prisma.organizationMember.findUnique({
            where: {
                organizationId_userId: {
                    organizationId,
                    userId,
                },
            },
        });
        if (!member) {
            throw new Error('User not in organization');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        const evaluations = await this.prisma.skillEvaluation.findMany({
            where: { userId },
            take: 10,
            orderBy: { evaluatedAt: 'desc' },
        });
        const lessons = await this.prisma.lessonProgress.findMany({
            where: { userId },
        });
        const missions = await this.prisma.dailyMission.findMany({
            where: { userId },
            take: 30,
            orderBy: { date: 'desc' },
        });
        const mistakes = await this.prisma.wordMistake.findMany({
            where: { userId },
            take: 20,
            orderBy: { createdAt: 'desc' },
        });
        const avgScore = evaluations.length > 0
            ? Math.round(evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length)
            : 0;
        const skillLevels = await this.prisma.skillCefrLevel.findUnique({
            where: { userId },
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                level: user.level,
                xp: user.xp,
                coins: user.coins,
                streak: user.streak,
                lastActive: user.lastActiveAt,
            },
            performance: {
                averageScore: avgScore,
                evaluationsCount: evaluations.length,
                lessonsCompleted: lessons.filter((l) => l.completed).length,
                missionsCompleted: missions.filter((m) => m.completed).length,
                mistakesCount: mistakes.length,
                skillLevels: skillLevels || null,
            },
            recentActivity: {
                evaluations: evaluations.slice(0, 5),
                lessons: lessons.slice(0, 5),
                missions: missions.slice(0, 5),
            },
        };
    }
    async getOrganizationProgress(organizationId) {
        const organization = await this.prisma.organization.findUnique({
            where: { id: organizationId },
        });
        if (!organization) {
            throw new Error('Organization not found');
        }
        const members = await this.prisma.organizationMember.findMany({
            where: { organizationId },
        });
        const userIds = members.map((m) => m.userId);
        const progress = await Promise.all(userIds.map(async (userId) => {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            const evaluations = await this.prisma.skillEvaluation.findMany({
                where: { userId },
                take: 10,
                orderBy: { evaluatedAt: 'desc' },
            });
            const lessons = await this.prisma.lessonProgress.findMany({
                where: { userId },
            });
            const missions = await this.prisma.dailyMission.findMany({
                where: { userId },
                take: 30,
                orderBy: { date: 'desc' },
            });
            return {
                userId,
                name: user.name,
                email: user.email,
                level: user.level,
                xp: user.xp,
                streak: user.streak,
                lastActive: user.lastActiveAt,
                evaluationsCount: evaluations.length,
                lessonsCompleted: lessons.filter((l) => l.completed).length,
                missionsCompleted: missions.filter((m) => m.completed).length,
                averageScore: evaluations.length > 0
                    ? Math.round(evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length)
                    : 0,
            };
        }));
        return progress;
    }
    async getOrganizationLeaderboard(organizationId) {
        const members = await this.prisma.organizationMember.findMany({
            where: { organizationId },
        });
        const userIds = members.map((m) => m.userId);
        const users = await this.prisma.user.findMany({
            where: {
                id: { in: userIds },
            },
            orderBy: {
                xp: 'desc',
            },
        });
        return users.map((user, index) => ({
            rank: index + 1,
            userId: user.id,
            name: user.name,
            level: user.level,
            xp: user.xp,
            streak: user.streak,
        }));
    }
    async getWeeklyReport(organizationId) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const members = await this.prisma.organizationMember.findMany({
            where: { organizationId },
        });
        const userIds = members.map((m) => m.userId);
        const weeklyEvents = await this.prisma.learningEvent.findMany({
            where: {
                userId: { in: userIds },
                createdAt: {
                    gte: oneWeekAgo,
                },
            },
        });
        const eventTypeStats = {};
        weeklyEvents.forEach((e) => {
            eventTypeStats[e.eventType] = (eventTypeStats[e.eventType] || 0) + 1;
        });
        const dailyStats = {};
        weeklyEvents.forEach((e) => {
            const date = e.createdAt.toISOString().split('T')[0];
            dailyStats[date] = (dailyStats[date] || 0) + 1;
        });
        return {
            totalEvents: weeklyEvents.length,
            eventTypeStats,
            dailyStats,
            averageDailyEvents: Math.round(weeklyEvents.length / 7),
        };
    }
    async getChurnRiskReport(organizationId) {
        const members = await this.prisma.organizationMember.findMany({
            where: { organizationId },
        });
        const userIds = members.map((m) => m.userId);
        const churnRisks = await this.prisma.churnRisk.findMany({
            where: {
                userId: { in: userIds },
            },
            include: {
                user: true,
            },
            orderBy: {
                riskScore: 'desc',
            },
        });
        const highRisk = churnRisks.filter((r) => r.riskScore >= 60);
        const critical = churnRisks.filter((r) => r.riskScore >= 80);
        return {
            total: churnRisks.length,
            highRisk: highRisk.length,
            critical: critical.length,
            users: churnRisks.map((r) => ({
                userId: r.user.id,
                name: r.user.name,
                email: r.user.email,
                riskScore: r.riskScore,
                riskLevel: r.riskLevel,
                predictedChurnDate: r.predictedChurnDate,
                interventionSent: r.interventionSent,
            })),
        };
    }
};
exports.ParentDashboardService = ParentDashboardService;
exports.ParentDashboardService = ParentDashboardService = ParentDashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ParentDashboardService);
//# sourceMappingURL=parent-dashboard.service.js.map