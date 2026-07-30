import { LearningReplayService } from './learning-replay.service';
export declare class LearningReplayController {
    private learningReplayService;
    constructor(learningReplayService: LearningReplayService);
    generateWeeklyReport(req: any, body: {
        startDate: string;
        endDate: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        generatedAt: Date;
        stats: import("@prisma/client/runtime/client").JsonValue;
        startDate: Date;
        endDate: Date;
        report: import("@prisma/client/runtime/client").JsonValue;
    }>;
    getReport(reportId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        generatedAt: Date;
        stats: import("@prisma/client/runtime/client").JsonValue;
        startDate: Date;
        endDate: Date;
        report: import("@prisma/client/runtime/client").JsonValue;
    }>;
    getUserReports(req: any, body: {
        limit?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        generatedAt: Date;
        stats: import("@prisma/client/runtime/client").JsonValue;
        startDate: Date;
        endDate: Date;
        report: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getLatestReport(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        generatedAt: Date;
        stats: import("@prisma/client/runtime/client").JsonValue;
        startDate: Date;
        endDate: Date;
        report: import("@prisma/client/runtime/client").JsonValue;
    }>;
    getReportStats(): Promise<{
        totalReports: number;
        uniqueUsers: number;
        averageReportsPerUser: number;
    }>;
}
