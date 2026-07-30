import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class StudyPlannerService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    createStudyPlan(userId: string, goal: string, targetDate: string): Promise<{
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
    private generateFallbackStudyPlan;
    getStudyPlan(userId: string): Promise<{
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
    updateStudyProgress(userId: string, planId: string, progress: number): Promise<{
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
    recalculatePlan(userId: string, planId: string): Promise<{
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
