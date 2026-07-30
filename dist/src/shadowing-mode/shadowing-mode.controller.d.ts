import { ShadowingModeService } from './shadowing-mode.service';
export declare class ShadowingModeController {
    private shadowingModeService;
    constructor(shadowingModeService: ShadowingModeService);
    createShadowingSession(req: any, body: {
        level: string;
        topic?: string;
    }): Promise<{
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
    submitRecording(req: any, body: {
        sessionId: string;
        phraseId: number;
        audioUrl: string;
    }): Promise<{
        phraseId: number;
        audioUrl: string;
        comparison: any;
        submittedAt: Date;
    }>;
    completeSession(req: any, body: {
        sessionId: string;
    }): Promise<{
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
    getUserSessions(req: any, body: {
        limit?: number;
    }): Promise<{
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
