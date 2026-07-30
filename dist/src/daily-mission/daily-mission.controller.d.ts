import { DailyMissionService } from './daily-mission.service';
export declare class DailyMissionController {
    private dailyMissionService;
    constructor(dailyMissionService: DailyMissionService);
    generateDailyMission(req: any): Promise<{
        id: string;
        createdAt: Date;
        score: number | null;
        userId: string;
        completed: boolean;
        date: Date;
        context: string;
        mission: string;
    }>;
    getTodayMission(req: any): Promise<{
        id: string;
        createdAt: Date;
        score: number | null;
        userId: string;
        completed: boolean;
        date: Date;
        context: string;
        mission: string;
    }>;
    completeMission(req: any, id: string, body: {
        score: number;
    }): Promise<{
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
    getMissionHistory(req: any, body: {
        limit?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        score: number | null;
        userId: string;
        completed: boolean;
        date: Date;
        context: string;
        mission: string;
    }[]>;
    getMissionStats(req: any): Promise<{
        total: number;
        completed: number;
        completionRate: number;
        averageScore: number;
        contextStats: Record<string, number>;
        streak: number;
    }>;
}
