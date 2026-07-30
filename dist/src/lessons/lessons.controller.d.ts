import { LessonsService } from './lessons.service';
import { Level } from '@prisma/client';
export declare class LessonsController {
    private lessonsService;
    constructor(lessonsService: LessonsService);
    getLessons(level?: Level): Promise<{
        level: import(".prisma/client").$Enums.Level;
        id: string;
        description: string | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        locationId: string | null;
        topics: string[];
        dialogs: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getLesson(id: string): Promise<{
        level: import(".prisma/client").$Enums.Level;
        id: string;
        description: string | null;
        order: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        locationId: string | null;
        topics: string[];
        dialogs: import("@prisma/client/runtime/client").JsonValue;
    }>;
    completeLesson(req: any, id: string, body: {
        score?: number;
    }): Promise<{
        progress: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            lessonId: string;
            completed: boolean;
            score: number | null;
            completedAt: Date | null;
            userId: string;
        };
        userStats: {
            xp: number;
            coins: number;
            streak: number;
        };
        rewards: {
            xp: number;
            coins: number;
        };
    }>;
}
