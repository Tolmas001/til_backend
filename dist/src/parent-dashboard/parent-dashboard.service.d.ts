import { PrismaService } from '../prisma/prisma.service';
export declare class ParentDashboardService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getOrganizationDashboard(organizationId: string): Promise<{
        organization: {
            id: string;
            name: string;
            type: string;
            subscription: import("@prisma/client").$Enums.Subscription;
        };
        stats: {
            totalUsers: number;
            activeUsers: number;
            inactiveUsers: number;
            totalXP: number;
            averageXP: number;
            totalCoins: number;
            levelDistribution: Record<string, number>;
            engagementRate: number;
        };
    }>;
    getUserDashboard(organizationId: string, userId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            level: import("@prisma/client").$Enums.Level;
            xp: number;
            coins: number;
            streak: number;
            lastActive: Date;
        };
        performance: {
            averageScore: number;
            evaluationsCount: number;
            lessonsCompleted: number;
            missionsCompleted: number;
            mistakesCount: number;
            skillLevels: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                grammarLevel: import("@prisma/client").$Enums.Level;
                listeningLevel: import("@prisma/client").$Enums.Level;
                speakingLevel: import("@prisma/client").$Enums.Level;
                readingLevel: import("@prisma/client").$Enums.Level;
                writingLevel: import("@prisma/client").$Enums.Level;
                overallLevel: import("@prisma/client").$Enums.Level;
                assessedAt: Date;
            };
        };
        recentActivity: {
            evaluations: {
                id: string;
                createdAt: Date;
                userId: string;
                pronunciationScore: number;
                fluencyScore: number;
                overallScore: number;
                feedback: string | null;
                exerciseId: string | null;
                exerciseType: string;
                vocabularyScore: number;
                grammarScore: number;
                confidenceScore: number;
                listeningScore: number | null;
                evaluatedAt: Date;
            }[];
            lessons: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                lessonId: string;
                score: number | null;
                userId: string;
                completed: boolean;
                completedAt: Date | null;
            }[];
            missions: {
                id: string;
                createdAt: Date;
                score: number | null;
                userId: string;
                completed: boolean;
                date: Date;
                context: string;
                mission: string;
            }[];
        };
    }>;
    getOrganizationProgress(organizationId: string): Promise<{
        userId: string;
        name: string;
        email: string;
        level: import("@prisma/client").$Enums.Level;
        xp: number;
        streak: number;
        lastActive: Date;
        evaluationsCount: number;
        lessonsCompleted: number;
        missionsCompleted: number;
        averageScore: number;
    }[]>;
    getOrganizationLeaderboard(organizationId: string): Promise<{
        rank: number;
        userId: string;
        name: string;
        level: import("@prisma/client").$Enums.Level;
        xp: number;
        streak: number;
    }[]>;
    getWeeklyReport(organizationId: string): Promise<{
        totalEvents: number;
        eventTypeStats: Record<string, number>;
        dailyStats: Record<string, number>;
        averageDailyEvents: number;
    }>;
    getChurnRiskReport(organizationId: string): Promise<{
        total: number;
        highRisk: number;
        critical: number;
        users: {
            userId: string;
            name: string;
            email: string;
            riskScore: number;
            riskLevel: string;
            predictedChurnDate: Date;
            interventionSent: boolean;
        }[];
    }>;
}
