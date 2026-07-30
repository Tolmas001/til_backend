import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class EvaluationService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    evaluateExercise(userId: string, exerciseId: string, exerciseType: string, userResponse: string, expectedResponse?: string): Promise<{
        vocabularyScore: number;
        grammarScore: number;
        pronunciationScore: number;
        confidenceScore: number;
        fluencyScore: number;
        listeningScore: any;
        overallScore: number;
        feedback: string;
    }>;
    private generateFallbackEvaluation;
    getUserEvaluations(userId: string, limit?: number): Promise<{
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
    getAverageScores(userId: string): Promise<{
        vocabulary: number;
        grammar: number;
        pronunciation: number;
        confidence: number;
        fluency: number;
        listening: number;
        overall: number;
    }>;
    mapCefrLevels(userId: string): Promise<{
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
    getCefrLevels(userId: string): Promise<{
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
    trackLearningEvidence(userId: string, level: string, exerciseType: string): Promise<{
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
    getLearningEvidence(userId: string, level?: string): Promise<{
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
    checkLevelCompletion(userId: string, level: string, skill: string): Promise<{
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
