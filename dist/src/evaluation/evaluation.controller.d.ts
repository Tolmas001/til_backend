import { EvaluationService } from './evaluation.service';
export declare class EvaluationController {
    private evaluationService;
    constructor(evaluationService: EvaluationService);
    evaluateExercise(req: any, body: {
        exerciseId: string;
        exerciseType: string;
        userResponse: string;
        expectedResponse?: string;
    }): Promise<{
        vocabularyScore: number;
        grammarScore: number;
        pronunciationScore: number;
        confidenceScore: number;
        fluencyScore: number;
        listeningScore: any;
        overallScore: number;
        feedback: string;
    }>;
    getUserEvaluations(req: any, body: {
        limit?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        pronunciationScore: number;
        fluencyScore: number;
        overallScore: number;
        feedback: string | null;
        exerciseId: string | null;
        exerciseType: string;
        vocabularyScore: number;
        grammarScore: number;
        confidenceScore: number;
        listeningScore: number | null;
        evaluatedAt: Date;
    }[]>;
    getAverageScores(req: any): Promise<{
        vocabulary: number;
        grammar: number;
        pronunciation: number;
        confidence: number;
        fluency: number;
        listening: number;
        overall: number;
    }>;
    mapCefrLevels(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        grammarLevel: import("@prisma/client").$Enums.Level;
        listeningLevel: import("@prisma/client").$Enums.Level;
        speakingLevel: import("@prisma/client").$Enums.Level;
        readingLevel: import("@prisma/client").$Enums.Level;
        writingLevel: import("@prisma/client").$Enums.Level;
        overallLevel: import("@prisma/client").$Enums.Level;
        assessedAt: Date;
    }>;
    getCefrLevels(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        grammarLevel: import("@prisma/client").$Enums.Level;
        listeningLevel: import("@prisma/client").$Enums.Level;
        speakingLevel: import("@prisma/client").$Enums.Level;
        readingLevel: import("@prisma/client").$Enums.Level;
        writingLevel: import("@prisma/client").$Enums.Level;
        overallLevel: import("@prisma/client").$Enums.Level;
        assessedAt: Date;
    }>;
    trackLearningEvidence(req: any, body: {
        level: string;
        exerciseType: string;
    }): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        completedAt: Date;
        dialogCount: number;
        quizCount: number;
        speakingCount: number;
        listeningCount: number;
        readingCount: number;
        writingCount: number;
    }>;
    getLearningEvidence(req: any, body: {
        level?: string;
    }): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        completedAt: Date;
        dialogCount: number;
        quizCount: number;
        speakingCount: number;
        listeningCount: number;
        readingCount: number;
        writingCount: number;
    }[]>;
    checkLevelCompletion(req: any, level: string, skill: string): Promise<{
        completed: boolean;
        count: number;
        required: number;
        progress?: undefined;
    } | {
        completed: boolean;
        count: any;
        required: number;
        progress: number;
    }>;
}
