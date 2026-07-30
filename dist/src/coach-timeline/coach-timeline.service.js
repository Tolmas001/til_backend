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
var CoachTimelineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachTimelineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CoachTimelineService = CoachTimelineService_1 = class CoachTimelineService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(CoachTimelineService_1.name);
    }
    async createTimelineEvent(userId, eventType, description, metadata) {
        return this.prisma.timelineEvent.create({
            data: {
                userId,
                eventType,
                description,
                metadata,
                date: new Date(),
            },
        });
    }
    async logMilestone(userId, milestone, details) {
        return this.createTimelineEvent(userId, 'milestone', milestone, details);
    }
    async logStreak(userId, streak, details) {
        return this.createTimelineEvent(userId, 'streak', `${streak} day streak`, { streak, ...details });
    }
    async logImprovement(userId, skill, improvement, details) {
        return this.createTimelineEvent(userId, 'improvement', `${skill} improved by ${improvement}%`, { skill, improvement, ...details });
    }
    async logSetback(userId, reason, details) {
        return this.createTimelineEvent(userId, 'setback', reason, details);
    }
    async getUserTimeline(userId, limit = 50) {
        return this.prisma.timelineEvent.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: limit,
        });
    }
    async getUserTimelineByDateRange(userId, startDate, endDate) {
        return this.prisma.timelineEvent.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { date: 'asc' },
        });
    }
    async getTimelineByEventType(userId, eventType) {
        return this.prisma.timelineEvent.findMany({
            where: {
                userId,
                eventType,
            },
            orderBy: { date: 'desc' },
        });
    }
    async analyzeProgress(userId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const events = await this.prisma.timelineEvent.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                },
            },
            orderBy: { date: 'asc' },
        });
        const milestones = events.filter((e) => e.eventType === 'milestone').length;
        const streaks = events.filter((e) => e.eventType === 'streak').length;
        const improvements = events.filter((e) => e.eventType === 'improvement').length;
        const setbacks = events.filter((e) => e.eventType === 'setback').length;
        const dailyActivity = {};
        events.forEach((e) => {
            const date = e.date.toISOString().split('T')[0];
            dailyActivity[date] = (dailyActivity[date] || 0) + 1;
        });
        const improvementRate = improvements > 0 ? Math.round((improvements / (improvements + setbacks)) * 100) : 0;
        return {
            totalEvents: events.length,
            milestones,
            streaks,
            improvements,
            setbacks,
            improvementRate,
            dailyActivity,
            averageDailyEvents: Math.round(events.length / days),
        };
    }
    async generateWeeklyReport(userId) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const events = await this.prisma.timelineEvent.findMany({
            where: {
                userId,
                date: {
                    gte: oneWeekAgo,
                },
            },
            orderBy: { date: 'asc' },
        });
        const progress = await this.analyzeProgress(userId, 7);
        return {
            weekStart: oneWeekAgo,
            weekEnd: new Date(),
            totalEvents: events.length,
            milestones: events.filter((e) => e.eventType === 'milestone'),
            improvements: events.filter((e) => e.eventType === 'improvement'),
            setbacks: events.filter((e) => e.eventType === 'setback'),
            streaks: events.filter((e) => e.eventType === 'streak'),
            progress,
        };
    }
    async getTimelineStats() {
        const events = await this.prisma.timelineEvent.findMany();
        const total = events.length;
        const eventTypeStats = {};
        events.forEach((e) => {
            eventTypeStats[e.eventType] = (eventTypeStats[e.eventType] || 0) + 1;
        });
        const uniqueUsers = new Set(events.map((e) => e.userId)).size;
        return {
            totalEvents: total,
            uniqueUsers,
            eventTypeStats,
            averageEventsPerUser: uniqueUsers > 0 ? Math.round(total / uniqueUsers) : 0,
        };
    }
    async deleteOldEvents(daysToKeep = 180) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const result = await this.prisma.timelineEvent.deleteMany({
            where: {
                date: {
                    lt: cutoffDate,
                },
            },
        });
        this.logger.log(`Deleted ${result.count} old timeline events`);
        return result;
    }
};
exports.CoachTimelineService = CoachTimelineService;
exports.CoachTimelineService = CoachTimelineService = CoachTimelineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoachTimelineService);
//# sourceMappingURL=coach-timeline.service.js.map