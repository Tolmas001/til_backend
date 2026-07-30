import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class DailyMissionService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    generateDailyMission(userId: string): Promise<{
        id: string;
        createdAt: Date;
        score: number | null;
        userId: string;
        completed: boolean;
        date: Date;
        context: string;
        mission: string;
    }>;
    private generateFallbackMission;
    getTodayMission(userId: string): Promise<{
        id: string;
        createdAt: Date;
        score: number | null;
        userId: string;
        completed: boolean;
        date: Date;
        context: string;
        mission: string;
    }>;
    completeMission(userId: string, missionId: string, score: number): Promise<{
        mission: {
            id: string;
            createdAt: Date;
            score: number | null;
            userId: string;
            completed: boolean;
            date: Date;
            context: string;
            mission: string;
        };
        passed: boolean;
        rewards: {
            xp: number;
            coins: number;
        };
    }>;
    getMissionHistory(userId: string, limit?: number): Promise<{
        id: string;
        createdAt: Date;
        score: number | null;
        userId: string;
        completed: boolean;
        date: Date;
        context: string;
        mission: string;
    }[]>;
    getMissionStats(userId: string): Promise<{
        total: number;
        completed: number;
        completionRate: number;
        averageScore: number;
        contextStats: Record<string, number>;
        streak: number;
    }>;
    private calculateMissionStreak;
}
