import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private gamificationService;
    constructor(gamificationService: GamificationService);
    getLeaderboard(): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        name: string;
        avatar: string;
        xp: number;
        coins: number;
        streak: number;
    }[]>;
    getDailyQuests(req: any): Promise<any[]>;
    getAchievements(req: any): Promise<{
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
    getStoryLocations(req: any): Promise<{
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
