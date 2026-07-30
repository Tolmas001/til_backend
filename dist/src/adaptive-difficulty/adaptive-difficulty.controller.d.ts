import { AdaptiveDifficultyService } from './adaptive-difficulty.service';
export declare class AdaptiveDifficultyController {
    private adaptiveDifficultyService;
    constructor(adaptiveDifficultyService: AdaptiveDifficultyService);
    recordAnswer(req: any, body: {
        isCorrect: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        currentDifficulty: string;
        consecutiveCorrect: number;
        consecutiveWrong: number;
        lastAdjustedAt: Date;
    }>;
    getUserDifficulty(req: any): Promise<{
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
    resetUserDifficulty(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        currentDifficulty: string;
        consecutiveCorrect: number;
        consecutiveWrong: number;
        lastAdjustedAt: Date;
    }>;
    getDifficultyStats(req: any): Promise<{
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
