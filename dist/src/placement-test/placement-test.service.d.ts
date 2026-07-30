import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class PlacementTestService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    generatePlacementTest(userId: string): Promise<any>;
    private generateFallbackPlacementTest;
    submitPlacementTest(userId: string, answers: {
        grammar: string;
        listening: string;
        speaking: string;
        vocabulary: number;
        pronunciation: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        completedAt: Date;
        pronunciationScore: number;
        overallScore: number;
        vocabularyScore: number;
        grammarScore: number;
        listeningScore: number;
        speakingScore: number;
        suggestedLevel: import("@prisma/client").$Enums.Level;
    }>;
    private calculateGrammarScore;
    private calculateListeningScore;
    private calculateSpeakingScore;
    private determineLevel;
    getPlacementTestResult(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        completedAt: Date;
        pronunciationScore: number;
        overallScore: number;
        vocabularyScore: number;
        grammarScore: number;
        listeningScore: number;
        speakingScore: number;
        suggestedLevel: import("@prisma/client").$Enums.Level;
    }>;
    retakePlacementTest(userId: string): Promise<any>;
}
