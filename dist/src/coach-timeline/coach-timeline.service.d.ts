import { PrismaService } from '../prisma/prisma.service';
export declare class CoachTimelineService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createTimelineEvent(userId: string, eventType: string, description: string, metadata: any): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }>;
    logMilestone(userId: string, milestone: string, details: any): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }>;
    logStreak(userId: string, streak: number, details: any): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }>;
    logImprovement(userId: string, skill: string, improvement: number, details: any): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }>;
    logSetback(userId: string, reason: string, details: any): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }>;
    getUserTimeline(userId: string, limit?: number): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getUserTimelineByDateRange(userId: string, startDate: Date, endDate: Date): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getTimelineByEventType(userId: string, eventType: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    analyzeProgress(userId: string, days?: number): Promise<{
        totalEvents: number;
        milestones: number;
        streaks: number;
        improvements: number;
        setbacks: number;
        improvementRate: number;
        dailyActivity: Record<string, number>;
        averageDailyEvents: number;
    }>;
    generateWeeklyReport(userId: string): Promise<{
        weekStart: Date;
        weekEnd: Date;
        totalEvents: number;
        milestones: {
            id: string;
            description: string;
            createdAt: Date;
            userId: string;
            date: Date;
            eventType: string;
            metadata: import("@prisma/client/runtime/client").JsonValue;
        }[];
        improvements: {
            id: string;
            description: string;
            createdAt: Date;
            userId: string;
            date: Date;
            eventType: string;
            metadata: import("@prisma/client/runtime/client").JsonValue;
        }[];
        setbacks: {
            id: string;
            description: string;
            createdAt: Date;
            userId: string;
            date: Date;
            eventType: string;
            metadata: import("@prisma/client/runtime/client").JsonValue;
        }[];
        streaks: {
            id: string;
            description: string;
            createdAt: Date;
            userId: string;
            date: Date;
            eventType: string;
            metadata: import("@prisma/client/runtime/client").JsonValue;
        }[];
        progress: {
            totalEvents: number;
            milestones: number;
            streaks: number;
            improvements: number;
            setbacks: number;
            improvementRate: number;
            dailyActivity: Record<string, number>;
            averageDailyEvents: number;
        };
    }>;
    getTimelineStats(): Promise<{
        totalEvents: number;
        uniqueUsers: number;
        eventTypeStats: Record<string, number>;
        averageEventsPerUser: number;
    }>;
    deleteOldEvents(daysToKeep?: number): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
