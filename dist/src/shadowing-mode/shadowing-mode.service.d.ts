import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class ShadowingModeService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    createShadowingSession(userId: string, level: string, topic?: string): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        completedAt: Date | null;
        overallScore: number | null;
        topic: string;
        status: string;
        phrases: import("@prisma/client/runtime/client").JsonValue;
        dialog: import("@prisma/client/runtime/client").JsonValue | null;
        recordings: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    private createFallbackShadowingSession;
    submitRecording(userId: string, sessionId: string, phraseId: number, audioUrl: string): Promise<{
        phraseId: number;
        audioUrl: string;
        comparison: any;
        submittedAt: Date;
    }>;
    completeSession(userId: string, sessionId: string): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        completedAt: Date | null;
        overallScore: number | null;
        topic: string;
        status: string;
        phrases: import("@prisma/client/runtime/client").JsonValue;
        dialog: import("@prisma/client/runtime/client").JsonValue | null;
        recordings: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    getSession(sessionId: string): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        completedAt: Date | null;
        overallScore: number | null;
        topic: string;
        status: string;
        phrases: import("@prisma/client/runtime/client").JsonValue;
        dialog: import("@prisma/client/runtime/client").JsonValue | null;
        recordings: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    getUserSessions(userId: string, limit?: number): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        completedAt: Date | null;
        overallScore: number | null;
        topic: string;
        status: string;
        phrases: import("@prisma/client/runtime/client").JsonValue;
        dialog: import("@prisma/client/runtime/client").JsonValue | null;
        recordings: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    getSessionStats(): Promise<{
        total: number;
        completed: number;
        pending: number;
        inProgress: number;
        topicStats: Record<string, number>;
        averageScore: number;
        completionRate: number;
    }>;
}
