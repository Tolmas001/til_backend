import { AiInterviewService } from './ai-interview.service';
export declare class AiInterviewController {
    private aiInterviewService;
    constructor(aiInterviewService: AiInterviewService);
    generateInterview(req: any, body: {
        jobType: string;
        level: string;
    }): Promise<{
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
    submitAnswer(req: any, body: {
        interviewId: string;
        questionId: number;
        answer: string;
        audioUrl?: string;
    }): Promise<{
        questionId: number;
        answer: string;
        audioUrl: string;
        evaluation: any;
        submittedAt: Date;
    }>;
    completeInterview(req: any, body: {
        interviewId: string;
    }): Promise<{
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
    getUserInterviews(req: any, body: {
        limit?: number;
    }): Promise<{
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
