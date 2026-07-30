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
var TeacherCmsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherCmsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TeacherCmsService = TeacherCmsService_1 = class TeacherCmsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TeacherCmsService_1.name);
    }
    async createOrganization(data) {
        return this.prisma.organization.create({
            data,
        });
    }
    async getOrganization(id) {
        return this.prisma.organization.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }
    async addOrganizationMember(organizationId, userId, role, permissions) {
        return this.prisma.organizationMember.create({
            data: {
                organizationId,
                userId,
                role,
                permissions,
            },
        });
    }
    async getOrganizationMembers(organizationId) {
        return this.prisma.organizationMember.findMany({
            where: { organizationId },
            include: {
                user: true,
            },
        });
    }
    async removeOrganizationMember(organizationId, userId) {
        return this.prisma.organizationMember.delete({
            where: {
                organizationId_userId: {
                    organizationId,
                    userId,
                },
            },
        });
    }
    async getOrganizationUsers(organizationId) {
        const members = await this.prisma.organizationMember.findMany({
            where: { organizationId },
            include: {
                user: true,
            },
        });
        const userIds = members.map((m) => m.userId);
        const users = await this.prisma.user.findMany({
            where: {
                id: { in: userIds },
            },
        });
        return users;
    }
    async getUserProgress(organizationId, userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const evaluations = await this.prisma.skillEvaluation.findMany({
            where: { userId },
        });
        const lessons = await this.prisma.lessonProgress.findMany({
            where: { userId },
        });
        const missions = await this.prisma.dailyMission.findMany({
            where: { userId },
        });
        return {
            user,
            level: user.level,
            xp: user.xp,
            coins: user.coins,
            streak: user.streak,
            evaluationsCount: evaluations.length,
            lessonsCompleted: lessons.filter((l) => l.completed).length,
            missionsCompleted: missions.filter((m) => m.completed).length,
            lastActive: user.lastActiveAt,
        };
    }
    async getOrganizationStats(organizationId) {
        const members = await this.prisma.organizationMember.findMany({
            where: { organizationId },
        });
        const userIds = members.map((m) => m.userId);
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
        return {
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            totalXP,
            averageXP: avgXP,
            levelDistribution,
            engagementRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
        };
    }
    async getOrganizationProgress(organizationId) {
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
                averageScore: evaluations.length > 0
                    ? Math.round(evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length)
                    : 0,
            };
        }));
        return progress;
    }
    async updateOrganization(id, data) {
        return this.prisma.organization.update({
            where: { id },
            data,
        });
    }
    async deleteOrganization(id) {
        await this.prisma.organizationMember.deleteMany({
            where: { organizationId: id },
        });
        return this.prisma.organization.delete({
            where: { id },
        });
    }
    async getAllOrganizations() {
        return this.prisma.organization.findMany({
            include: {
                _count: {
                    select: { members: true },
                },
            },
        });
    }
};
exports.TeacherCmsService = TeacherCmsService;
exports.TeacherCmsService = TeacherCmsService = TeacherCmsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeacherCmsService);
//# sourceMappingURL=teacher-cms.service.js.map