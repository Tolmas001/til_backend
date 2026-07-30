import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class LearningReplayService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    generateWeeklyReport(userId: string, startDate: Date, endDate: Date): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        generatedAt: Date;
        stats: import("@prisma/client/runtime/client").JsonValue;
        startDate: Date;
        endDate: Date;
        report: import("@prisma/client/runtime/client").JsonValue;
    }>;
    private generateFallbackReport;
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
    getUserReports(userId: string, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        generatedAt: Date;
        stats: import("@prisma/client/runtime/client").JsonValue;
        startDate: Date;
        endDate: Date;
        report: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getLatestReport(userId: string): Promise<{
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
