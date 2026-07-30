import { PrismaService } from '../prisma/prisma.service';
export declare class GamificationService {
    private prisma;
    constructor(prisma: PrismaService);
    getLeaderboard(limit?: number): Promise<{
        level: import(".prisma/client").$Enums.Level;
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
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        icon: string | null;
        condition: string;
        reward: number;
        coinReward: number | null;
    }[]>;
    getStoryLocations(userId: string): Promise<{
        unlocked: boolean;
        completed: boolean;
        level: import(".prisma/client").$Enums.Level;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        order: number;
    }[]>;
}
