import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class MemoryService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    recordMistake(userId: string, word: string, mistake: string, correction: string, context?: string): Promise<{
        wordMistake: {
            id: string;
            createdAt: Date;
            userId: string;
            date: Date;
            word: string;
            mistake: string;
            correction: string;
            context: string | null;
        };
        isRecurring: boolean;
        mistakeCount: number;
    }>;
    generateMistakeReminder(userId: string, word: string, mistakeCount: number): Promise<{
        message: string;
    }>;
    getWordMistakes(userId: string, word?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        date: Date;
        word: string;
        mistake: string;
        correction: string;
        context: string | null;
    }[]>;
    getRecurringMistakes(userId: string): Promise<{
        word: string;
        count: number;
    }[]>;
    getMistakeTimeline(userId: string, word: string): Promise<{
        word: string;
        mistakes: {
            date: Date;
            mistake: string;
            correction: string;
            context: string;
        }[];
        totalMistakes: number;
        trend: "improving" | "stable" | "worsening";
    }>;
    private analyzeMistakeTrend;
    explainMistake(userId: string, original: string, corrected: string): Promise<any>;
    private generateFallbackMistakeExplanation;
    getMistakeExplanations(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        original: string;
        corrected: string;
        explanation: string;
        rule: string | null;
        examples: string[];
        exercises: import("@prisma/client/runtime/client").JsonValue;
        reviewed: boolean;
    }[]>;
    markExplanationAsReviewed(explanationId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        original: string;
        corrected: string;
        explanation: string;
        rule: string | null;
        examples: string[];
        exercises: import("@prisma/client/runtime/client").JsonValue;
        reviewed: boolean;
    }>;
    generateReviewSession(userId: string, type: 'forgotten_words' | 'difficult_grammar' | 'dialog_review'): Promise<{
        id: string;
        createdAt: Date;
        score: number | null;
        userId: string;
        completed: boolean;
        content: import("@prisma/client/runtime/client").JsonValue;
        type: string;
        generatedAt: Date;
    }>;
    completeReviewSession(sessionId: string, score: number): Promise<{
        id: string;
        createdAt: Date;
        score: number | null;
        userId: string;
        completed: boolean;
        content: import("@prisma/client/runtime/client").JsonValue;
        type: string;
        generatedAt: Date;
    }>;
    getReviewSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        score: number | null;
        userId: string;
        completed: boolean;
        content: import("@prisma/client/runtime/client").JsonValue;
        type: string;
        generatedAt: Date;
    }[]>;
}
