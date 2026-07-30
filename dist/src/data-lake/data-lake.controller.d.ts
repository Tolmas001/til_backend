import { DataLakeService } from './data-lake.service';
export declare class DataLakeController {
    private dataLakeService;
    constructor(dataLakeService: DataLakeService);
    logEvent(req: any, body: {
        eventType: string;
        metadata: any;
        sessionId?: string;
        deviceInfo?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }>;
    getUserEvents(req: any, body: {
        eventType?: string;
        limit?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }[]>;
    getUserEventsByDateRange(req: any, body: {
        startDate: string;
        endDate: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        eventType: string;
        metadata: import("@prisma/client/runtime/client").JsonValue;
        sessionId: string | null;
        deviceInfo: string | null;
    }[]>;
    getEventTypeStats(req: any): Promise<Record<string, number>>;
    getDailyActivity(req: any, body: {
        days?: number;
    }): Promise<Record<string, number>>;
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
    deleteOldEvents(body: {
        daysToKeep?: number;
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
