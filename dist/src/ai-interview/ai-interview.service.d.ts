import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class AiInterviewService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    generateInterview(userId: string, jobType: string, level: string): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        overallScore: number | null;
        feedback: import("@prisma/client/runtime/client").JsonValue | null;
        jobType: string;
        questions: import("@prisma/client/runtime/client").JsonValue;
        answers: import("@prisma/client/runtime/client").JsonValue | null;
        scoring: import("@prisma/client/runtime/client").JsonValue;
        status: string;
    }>;
    private generateFallbackInterview;
    submitAnswer(userId: string, interviewId: string, questionId: number, answer: string, audioUrl?: string): Promise<{
        questionId: number;
        answer: string;
        audioUrl: string;
        evaluation: any;
        submittedAt: Date;
    }>;
    completeInterview(userId: string, interviewId: string): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        overallScore: number | null;
        feedback: import("@prisma/client/runtime/client").JsonValue | null;
        jobType: string;
        questions: import("@prisma/client/runtime/client").JsonValue;
        answers: import("@prisma/client/runtime/client").JsonValue | null;
        scoring: import("@prisma/client/runtime/client").JsonValue;
        status: string;
    }>;
    getInterview(interviewId: string): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        overallScore: number | null;
        feedback: import("@prisma/client/runtime/client").JsonValue | null;
        jobType: string;
        questions: import("@prisma/client/runtime/client").JsonValue;
        answers: import("@prisma/client/runtime/client").JsonValue | null;
        scoring: import("@prisma/client/runtime/client").JsonValue;
        status: string;
    }>;
    getUserInterviews(userId: string, limit?: number): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        overallScore: number | null;
        feedback: import("@prisma/client/runtime/client").JsonValue | null;
        jobType: string;
        questions: import("@prisma/client/runtime/client").JsonValue;
        answers: import("@prisma/client/runtime/client").JsonValue | null;
        scoring: import("@prisma/client/runtime/client").JsonValue;
        status: string;
    }[]>;
    getInterviewStats(): Promise<{
        total: number;
        completed: number;
        pending: number;
        inProgress: number;
        jobTypeStats: Record<string, number>;
        averageScore: number;
        completionRate: number;
    }>;
}
