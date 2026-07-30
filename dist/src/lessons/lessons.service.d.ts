import { PrismaService } from '../prisma/prisma.service';
import { Level } from '@prisma/client';
export declare class LessonsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(level?: Level): Promise<{
        level: import("@prisma/client").$Enums.Level;
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
    findOne(id: string): Promise<{
        level: import("@prisma/client").$Enums.Level;
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
    completeLesson(userId: string, lessonId: string, score?: number): Promise<{
        progress: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            lessonId: string;
            score: number | null;
            userId: string;
            completed: boolean;
            completedAt: Date | null;
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
