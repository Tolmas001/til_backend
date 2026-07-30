import { PrismaService } from '../prisma/prisma.service';
export declare class AdaptiveDifficultyService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    recordAnswer(userId: string, isCorrect: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        currentDifficulty: string;
        consecutiveCorrect: number;
        consecutiveWrong: number;
        lastAdjustedAt: Date;
    }>;
    private increaseDifficulty;
    private decreaseDifficulty;
    getUserDifficulty(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        currentDifficulty: string;
        consecutiveCorrect: number;
        consecutiveWrong: number;
        lastAdjustedAt: Date;
    } | {
        currentDifficulty: string;
        consecutiveCorrect: number;
        consecutiveWrong: number;
    }>;
    resetUserDifficulty(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        currentDifficulty: string;
        consecutiveCorrect: number;
        consecutiveWrong: number;
        lastAdjustedAt: Date;
    }>;
    getDifficultyStats(userId: string): Promise<{
        currentDifficulty: string;
        progressToNext: number;
        progressFromPrevious: number;
        streak: number;
        consecutiveWrong?: undefined;
    } | {
        currentDifficulty: string;
        progressToNext: number;
        progressFromPrevious: number;
        streak: number;
        consecutiveWrong: number;
    }>;
}
