import { ProgressService } from './progress.service';
export declare class ProgressController {
    private progressService;
    constructor(progressService: ProgressService);
    getProgress(req: any): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            level: import("@prisma/client").$Enums.Level;
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            lessonId: string;
            score: number | null;
            userId: string;
            completed: boolean;
            completedAt: Date | null;
        })[];
    }>;
}
