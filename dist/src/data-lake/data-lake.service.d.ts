import { PrismaService } from '../prisma/prisma.service';
export declare class DataLakeService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    logEvent(userId: string, eventType: string, metadata: any, sessionId?: string, deviceInfo?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }>;
    logLessonStarted(userId: string, lessonId: string, sessionId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }>;
    logLessonCompleted(userId: string, lessonId: string, score: number, sessionId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }>;
    logVoiceAttempt(userId: string, exerciseId: string, duration: number, sessionId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }>;
    logGrammarError(userId: string, word: string, mistake: string, correction: string, sessionId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }>;
    logReview(userId: string, reviewId: string, sessionId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }>;
    logMission(userId: string, missionId: string, completed: boolean, score: number, sessionId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }>;
    logConversation(userId: string, conversationId: string, messageCount: number, sessionId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }>;
    getUserEvents(userId: string, eventType?: string, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }[]>;
    getUserEventsByDateRange(userId: string, startDate: Date, endDate: Date): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }[]>;
    getEventTypeStats(userId: string): Promise<Record<string, number>>;
    getDailyActivity(userId: string, days?: number): Promise<Record<string, number>>;
    getSessionEvents(sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }[]>;
    getGlobalStats(): Promise<{
        totalEvents: number;
        uniqueUsers: number;
        eventTypeStats: Record<string, number>;
        averageEventsPerUser: number;
    }>;
    deleteOldEvents(daysToKeep?: number): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
