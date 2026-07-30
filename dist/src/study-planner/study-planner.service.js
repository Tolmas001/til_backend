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
var StudyPlannerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlannerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let StudyPlannerService = StudyPlannerService_1 = class StudyPlannerService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = null;
        this.logger = new common_1.Logger(StudyPlannerService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && apiKey !== 'your-openai-api-key') {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async createStudyPlan(userId, goal, targetDate) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                lessons: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        const target = new Date(targetDate);
        const now = new Date();
        const daysRemaining = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysRemaining <= 0) {
            throw new Error('Target date must be in the future');
        }
        if (!this.openai) {
            return this.generateFallbackStudyPlan(userId, goal, targetDate, daysRemaining, user.level);
        }
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI study planner for Russian language learning. Create a personalized study plan.
User goal: ${goal}
Current level: ${user.level}
Days remaining: ${daysRemaining}

Return JSON format:
{
  "dailyTasks": [
    {
      "day": 1,
      "tasks": ["Task 1", "Task 2"],
      "estimatedMinutes": 30
    }
  ],
  "weeklyGoals": [
    {
      "week": 1,
      "goal": "Weekly goal description",
      "milestones": ["milestone 1", "milestone 2"]
    }
  ],
  "recommendations": ["recommendation 1", "recommendation 2"]
}`,
                    },
                ],
                response_format: { type: 'json_object' },
            });
            const parsed = JSON.parse(response.choices[0].message.content || '{}');
            const studyPlan = await this.prisma.studyPlan.create({
                data: {
                    userId,
                    goal,
                    targetDate: target,
                    dailyTasks: parsed.dailyTasks,
                    weeklyGoals: parsed.weeklyGoals,
                    progress: 0,
                },
            });
            return { studyPlan, recommendations: parsed.recommendations };
        }
        catch (err) {
            this.logger.error('AI study plan generation failed, using fallback', err.message);
            return this.generateFallbackStudyPlan(userId, goal, targetDate, daysRemaining, user.level);
        }
    }
    generateFallbackStudyPlan(userId, goal, targetDate, daysRemaining, level) {
        const dailyTasks = [];
        const weeklyGoals = [];
        const weeks = Math.ceil(daysRemaining / 7);
        for (let week = 1; week <= weeks; week++) {
            weeklyGoals.push({
                week,
                goal: `Hafta ${week}: ${level} darajasini mustahkamlash`,
                milestones: [
                    `${week * 5} ta dars tugatish`,
                    `${week * 3} ta suhbat o'tkazish`,
                    `${week * 2} ta ssenariy yakunlash`,
                ],
            });
        }
        for (let day = 1; day <= daysRemaining; day++) {
            const week = Math.ceil(day / 7);
            dailyTasks.push({
                day,
                tasks: [
                    day % 3 === 0 ? 'Yangi dars o\'rganish' : 'Eski darslarni takrorlash',
                    'AI bilan 5 daqiqalik suhbat',
                    '10 ta yangi so\'z yodlash',
                ],
                estimatedMinutes: 30,
            });
        }
        const studyPlan = this.prisma.studyPlan.create({
            data: {
                userId,
                goal,
                targetDate: new Date(targetDate),
                dailyTasks,
                weeklyGoals,
                progress: 0,
            },
        });
        return {
            studyPlan,
            recommendations: [
                'Har kuni kamida 30 daqiqa o\'qing',
                'AI bilan ko\'proq suhbatlang',
                'Xatolarni tuzatishga e\'tibor bering',
            ],
        };
    }
    async getStudyPlan(userId) {
        return this.prisma.studyPlan.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 1,
        });
    }
    async updateStudyProgress(userId, planId, progress) {
        const plan = await this.prisma.studyPlan.update({
            where: { id: planId, userId },
            data: { progress },
        });
        if (progress >= 100) {
            await this.prisma.studyPlan.update({
                where: { id: planId },
                data: { completed: true },
            });
        }
        return plan;
    }
    async recalculatePlan(userId, planId) {
        const plan = await this.prisma.studyPlan.findUnique({
            where: { id: planId, userId },
        });
        if (!plan) {
            throw new Error('Study plan not found');
        }
        const now = new Date();
        const daysRemaining = Math.ceil((plan.targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysRemaining <= 0) {
            throw new Error('Target date has passed');
        }
        const remainingProgress = 100 - plan.progress;
        const dailyProgressNeeded = remainingProgress / daysRemaining;
        const updatedDailyTasks = plan.dailyTasks.map((task) => ({
            ...task,
            tasks: task.tasks.map((t) => `${t} (${Math.round(dailyProgressNeeded)}% progress needed)`),
        }));
        const updatedPlan = await this.prisma.studyPlan.update({
            where: { id: planId },
            data: {
                dailyTasks: updatedDailyTasks,
            },
        });
        return {
            plan: updatedPlan,
            message: `Plan recalculated. You need ${dailyProgressNeeded.toFixed(1)}% daily progress to reach your goal.`,
        };
    }
};
exports.StudyPlannerService = StudyPlannerService;
exports.StudyPlannerService = StudyPlannerService = StudyPlannerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], StudyPlannerService);
//# sourceMappingURL=study-planner.service.js.map