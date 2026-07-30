import { MemoryService } from './memory.service';
export declare class MemoryController {
    private memoryService;
    constructor(memoryService: MemoryService);
    recordMistake(req: any, body: {
        word: string;
        mistake: string;
        correction: string;
        context?: string;
    }): Promise<{
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
    getWordMistakes(req: any, body: {
        word?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        date: Date;
        word: string;
        mistake: string;
        correction: string;
        context: string | null;
    }[]>;
    getRecurringMistakes(req: any): Promise<{
        word: string;
        count: number;
    }[]>;
    getMistakeTimeline(req: any, word: string): Promise<{
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
    explainMistake(req: any, body: {
        original: string;
        corrected: string;
    }): Promise<any>;
    getMistakeExplanations(req: any): Promise<{
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
    markExplanationAsReviewed(id: string): Promise<{
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
    generateReviewSession(req: any, body: {
        type: 'forgotten_words' | 'difficult_grammar' | 'dialog_review';
    }): Promise<{
        id: string;
        createdAt: Date;
        score: number | null;
        userId: string;
        completed: boolean;
        content: import("@prisma/client/runtime/client").JsonValue;
        type: string;
        generatedAt: Date;
    }>;
    completeReviewSession(id: string, body: {
        score: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        score: number | null;
        userId: string;
        completed: boolean;
        content: import("@prisma/client/runtime/client").JsonValue;
        type: string;
        generatedAt: Date;
    }>;
    getReviewSessions(req: any): Promise<{
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
