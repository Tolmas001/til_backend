import { PrismaService } from '../prisma/prisma.service';
export declare class GamificationService {
    private prisma;
    constructor(prisma: PrismaService);
    getLeaderboard(limit?: number): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        name: string;
        avatar: string;
        xp: number;
        coins: number;
        streak: number;
    }[]>;
    getDailyQuests(userId: string): Promise<any[]>;
    getAchievements(userId: string): Promise<{
        unlocked: boolean;
        unlockedAt: Date;
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        coinReward: number | null;
        icon: string | null;
        condition: string;
        reward: number;
    }[]>;
    getStoryLocations(userId: string): Promise<{
        unlocked: boolean;
        completed: boolean;
        level: import("@prisma/client").$Enums.Level;
        id: string;
        name: string;
        description: string;
        order: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
