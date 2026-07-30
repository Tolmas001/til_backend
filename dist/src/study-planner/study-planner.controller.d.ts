import { StudyPlannerService } from './study-planner.service';
export declare class StudyPlannerController {
    private studyPlannerService;
    constructor(studyPlannerService: StudyPlannerService);
    createStudyPlan(req: any, body: {
        goal: string;
        targetDate: string;
    }): Promise<{
        studyPlan: import("@prisma/client").Prisma.Prisma__StudyPlanClient<{
            id: string;
            createdAt: Date;
            updatedAt: Date;
            progress: number;
            userId: string;
            completed: boolean;
            goal: string;
            targetDate: Date;
            dailyTasks: import("@prisma/client/runtime/client").JsonValue;
            weeklyGoals: import("@prisma/client/runtime/client").JsonValue;
        }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
        recommendations: string[];
    } | {
        studyPlan: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            progress: number;
            userId: string;
            completed: boolean;
            goal: string;
            targetDate: Date;
            dailyTasks: import("@prisma/client/runtime/client").JsonValue;
            weeklyGoals: import("@prisma/client/runtime/client").JsonValue;
        };
        recommendations: any;
    }>;
    getStudyPlan(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        progress: number;
        userId: string;
        completed: boolean;
        goal: string;
        targetDate: Date;
        dailyTasks: import("@prisma/client/runtime/client").JsonValue;
        weeklyGoals: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    updateProgress(req: any, id: string, body: {
        progress: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        progress: number;
        userId: string;
        completed: boolean;
        goal: string;
        targetDate: Date;
        dailyTasks: import("@prisma/client/runtime/client").JsonValue;
        weeklyGoals: import("@prisma/client/runtime/client").JsonValue;
    }>;
    recalculatePlan(req: any, id: string): Promise<{
        plan: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            progress: number;
            userId: string;
            completed: boolean;
            goal: string;
            targetDate: Date;
            dailyTasks: import("@prisma/client/runtime/client").JsonValue;
            weeklyGoals: import("@prisma/client/runtime/client").JsonValue;
        };
        message: string;
    }>;
}
