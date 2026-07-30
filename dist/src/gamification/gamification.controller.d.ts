import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private gamificationService;
    constructor(gamificationService: GamificationService);
    getLeaderboard(): Promise<{
        level: import(".prisma/client").$Enums.Level;
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
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        icon: string | null;
        condition: string;
        reward: number;
        coinReward: number | null;
    }[]>;
    getStoryLocations(req: any): Promise<{
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
