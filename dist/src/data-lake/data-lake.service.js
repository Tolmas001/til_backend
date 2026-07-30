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
var DataLakeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLakeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DataLakeService = DataLakeService_1 = class DataLakeService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(DataLakeService_1.name);
    }
    async logEvent(userId, eventType, metadata, sessionId, deviceInfo) {
        return this.prisma.learningEvent.create({
            data: {
                userId,
                eventType,
                metadata,
                sessionId,
                deviceInfo,
            },
        });
    }
    async logLessonStarted(userId, lessonId, sessionId) {
        return this.logEvent(userId, 'lesson_started', { lessonId }, sessionId);
    }
    async logLessonCompleted(userId, lessonId, score, sessionId) {
        return this.logEvent(userId, 'lesson_completed', { lessonId, score }, sessionId);
    }
    async logVoiceAttempt(userId, exerciseId, duration, sessionId) {
        return this.logEvent(userId, 'voice_attempt', { exerciseId, duration }, sessionId);
    }
    async logGrammarError(userId, word, mistake, correction, sessionId) {
        return this.logEvent(userId, 'grammar_error', { word, mistake, correction }, sessionId);
    }
    async logReview(userId, reviewId, sessionId) {
        return this.logEvent(userId, 'review', { reviewId }, sessionId);
    }
    async logMission(userId, missionId, completed, score, sessionId) {
        return this.logEvent(userId, 'mission', { missionId, completed, score }, sessionId);
    }
    async logConversation(userId, conversationId, messageCount, sessionId) {
        return this.logEvent(userId, 'conversation', { conversationId, messageCount }, sessionId);
    }
    async getUserEvents(userId, eventType, limit = 100) {
        const where = { userId };
        if (eventType) {
            where.eventType = eventType;
        }
        return this.prisma.learningEvent.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async getUserEventsByDateRange(userId, startDate, endDate) {
        return this.prisma.learningEvent.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async getEventTypeStats(userId) {
        const events = await this.prisma.learningEvent.findMany({
            where: { userId },
        });
        const stats = {};
        events.forEach((e) => {
            stats[e.eventType] = (stats[e.eventType] || 0) + 1;
        });
        return stats;
    }
    async getDailyActivity(userId, days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const events = await this.prisma.learningEvent.findMany({
            where: {
                userId,
                createdAt: {
                    gte: startDate,
                },
            },
            orderBy: { createdAt: 'asc' },
        });
        const dailyStats = {};
        events.forEach((e) => {
            const date = e.createdAt.toISOString().split('T')[0];
            dailyStats[date] = (dailyStats[date] || 0) + 1;
        });
        return dailyStats;
    }
    async getSessionEvents(sessionId) {
        return this.prisma.learningEvent.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async getGlobalStats() {
        const events = await this.prisma.learningEvent.findMany();
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
    async deleteOldEvents(daysToKeep = 90) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        const result = await this.prisma.learningEvent.deleteMany({
            where: {
                createdAt: {
                    lt: cutoffDate,
                },
            },
        });
        this.logger.log(`Deleted ${result.count} old events`);
        return result;
    }
};
exports.DataLakeService = DataLakeService;
exports.DataLakeService = DataLakeService = DataLakeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DataLakeService);
//# sourceMappingURL=data-lake.service.js.map