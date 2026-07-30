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
var LearningReplayService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningReplayService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let LearningReplayService = LearningReplayService_1 = class LearningReplayService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = null;
        this.logger = new common_1.Logger(LearningReplayService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && apiKey !== 'your-openai-api-key') {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async generateWeeklyReport(userId, startDate, endDate) {
        if (!this.openai) {
            return this.generateFallbackReport(userId, startDate, endDate);
        }
        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });
            const lessonProgress = await this.prisma.lessonProgress.findMany({
                where: {
                    userId,
                    completedAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            const chatMessages = await this.prisma.chatMessage.findMany({
                where: {
                    userId,
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            const evaluations = await this.prisma.skillEvaluation.findMany({
                where: {
                    userId,
                    evaluatedAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: `Generate a weekly learning replay report for Russian language learning.
User: ${user.name}
Level: ${user.level}
XP gained: ${user.xp}
Lessons completed: ${lessonProgress.length}
Chat messages: ${chatMessages.length}
Evaluations: ${evaluations.length}

Return JSON format:
{
  "report": {
    "title": "Weekly Learning Report",
    "period": "Week of ${startDate.toISOString().split('T')[0]}",
    "summary": "Brief summary of the week",
    "highlights": ["highlight 1", "highlight 2"],
    "achievements": ["achievement 1", "achievement 2"],
    "areasToImprove": ["area 1", "area 2"],
    "recommendations": ["recommendation 1", "recommendation 2"],
    "nextWeekGoals": ["goal 1", "goal 2"]
  },
  "stats": {
    "lessonsCompleted": ${lessonProgress.length},
    "chatMessages": ${chatMessages.length},
    "evaluations": ${evaluations.length},
    "averageScore": ${evaluations.length > 0 ? Math.round(evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length) : 0},
    "xpGained": ${user.xp}
  }
}`,
                    },
                ],
                response_format: { type: 'json_object' },
            });
            const parsed = JSON.parse(response.choices[0].message.content || '{}');
            const report = await this.prisma.learningReplay.create({
                data: {
                    userId,
                    startDate,
                    endDate,
                    report: parsed.report,
                    stats: parsed.stats,
                    generatedAt: new Date(),
                },
            });
            return report;
        }
        catch (err) {
            this.logger.error('AI weekly report generation failed, using fallback', err.message);
            return this.generateFallbackReport(userId, startDate, endDate);
        }
    }
    async generateFallbackReport(userId, startDate, endDate) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        const lessonProgress = await this.prisma.lessonProgress.findMany({
            where: {
                userId,
                completedAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const fallbackReport = {
            title: 'Weekly Learning Report',
            period: `Week of ${startDate.toISOString().split('T')[0]}`,
            summary: `${user.name} completed ${lessonProgress.length} lessons this week`,
            highlights: [
                `${lessonProgress.length} lessons completed`,
                'Consistent learning activity',
                'Good progress in vocabulary',
            ],
            achievements: [
                'Completed weekly learning goal',
                'Maintained learning streak',
            ],
            areasToImprove: [
                'Practice speaking more',
                'Review grammar rules',
            ],
            recommendations: [
                'Continue daily practice',
                'Focus on pronunciation',
            ],
            nextWeekGoals: [
                'Complete 5 more lessons',
                'Practice speaking exercises',
            ],
        };
        const fallbackStats = {
            lessonsCompleted: lessonProgress.length,
            chatMessages: 0,
            evaluations: 0,
            averageScore: 0,
            xpGained: user.xp,
        };
        const report = await this.prisma.learningReplay.create({
            data: {
                userId,
                startDate,
                endDate,
                report: fallbackReport,
                stats: fallbackStats,
                generatedAt: new Date(),
            },
        });
        return report;
    }
    async getReport(reportId) {
        return this.prisma.learningReplay.findUnique({
            where: { id: reportId },
        });
    }
    async getUserReports(userId, limit = 20) {
        return this.prisma.learningReplay.findMany({
            where: { userId },
            orderBy: { generatedAt: 'desc' },
            take: limit,
        });
    }
    async getLatestReport(userId) {
        return this.prisma.learningReplay.findFirst({
            where: { userId },
            orderBy: { generatedAt: 'desc' },
        });
    }
    async getReportStats() {
        const reports = await this.prisma.learningReplay.findMany();
        const total = reports.length;
        const uniqueUsers = new Set(reports.map((r) => r.userId)).size;
        return {
            totalReports: total,
            uniqueUsers,
            averageReportsPerUser: uniqueUsers > 0 ? Math.round(total / uniqueUsers) : 0,
        };
    }
};
exports.LearningReplayService = LearningReplayService;
exports.LearningReplayService = LearningReplayService = LearningReplayService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], LearningReplayService);
//# sourceMappingURL=learning-replay.service.js.map