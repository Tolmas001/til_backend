import { PrismaService } from '../prisma/prisma.service';
export declare class ProgressService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserProgress(userId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            level: import(".prisma/client").$Enums.Level;
            xp: number;
            coins: number;
            streak: number;
            lastActiveAt: Date;
        };
        stats: {
            completedLessonsCount: number;
            totalLessons: number;
            completionPercentage: number;
            vocabularyMasteredCount: number;
        };
        recentLessons: ({
            lesson: {
                level: import(".prisma/client").$Enums.Level;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                description: string | null;
                order: number;
                locationId: string | null;
                topics: string[];
                dialogs: import("@prisma/client/runtime/client").JsonValue;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            lessonId: string;
            completed: boolean;
            score: number | null;
            completedAt: Date | null;
        })[];
    }>;
}
