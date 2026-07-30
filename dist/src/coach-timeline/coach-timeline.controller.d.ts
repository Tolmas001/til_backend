import { CoachTimelineService } from './coach-timeline.service';
export declare class CoachTimelineController {
    private coachTimelineService;
    constructor(coachTimelineService: CoachTimelineService);
    createTimelineEvent(req: any, body: {
        eventType: string;
        description: string;
        metadata: any;
    }): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }>;
    logMilestone(req: any, body: {
        milestone: string;
        details: any;
    }): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }>;
    logStreak(req: any, body: {
        streak: number;
        details: any;
    }): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }>;
    logImprovement(req: any, body: {
        skill: string;
        improvement: number;
        details: any;
    }): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }>;
    logSetback(req: any, body: {
        reason: string;
        details: any;
    }): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }>;
    getUserTimeline(req: any, body: {
        limit?: number;
    }): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getUserTimelineByDateRange(req: any, body: {
        startDate: string;
        endDate: string;
    }): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getTimelineByEventType(req: any, eventType: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        userId: string;
        date: Date;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    analyzeProgress(req: any, body: {
        days?: number;
    }): Promise<{
        totalEvents: number;
        milestones: number;
        streaks: number;
        improvements: number;
        setbacks: number;
        improvementRate: number;
        dailyActivity: Record<string, number>;
        averageDailyEvents: number;
    }>;
    generateWeeklyReport(req: any): Promise<{
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
    deleteOldEvents(body: {
        daysToKeep?: number;
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
