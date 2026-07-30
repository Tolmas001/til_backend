import { PrismaService } from '../prisma/prisma.service';
export declare class TeacherCmsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createOrganization(data: {
        name: string;
        type: string;
        email: string;
        phone?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        subscription: import("@prisma/client").$Enums.Subscription;
        type: string;
        phone: string | null;
    }>;
    getOrganization(id: string): Promise<{
        members: ({
            user: {
                level: import("@prisma/client").$Enums.Level;
                id: string;
                name: string | null;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                googleId: string | null;
                appleId: string | null;
                password: string | null;
                avatar: string | null;
                xp: number;
                coins: number;
                streak: number;
                lastActiveAt: Date;
                subscription: import("@prisma/client").$Enums.Subscription;
                careerGoal: import("@prisma/client").$Enums.CareerGoal | null;
                learningStyle: import("@prisma/client").$Enums.LearningStyle | null;
                weakTopics: string[];
                strongTopics: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: string;
            permissions: import("@prisma/client/runtime/client").JsonValue | null;
            organizationId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        subscription: import("@prisma/client").$Enums.Subscription;
        type: string;
        phone: string | null;
    }>;
    addOrganizationMember(organizationId: string, userId: string, role: string, permissions?: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        role: string;
        permissions: import("@prisma/client/runtime/client").JsonValue | null;
        organizationId: string;
    }>;
    getOrganizationMembers(organizationId: string): Promise<({
        user: {
            level: import("@prisma/client").$Enums.Level;
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            googleId: string | null;
            appleId: string | null;
            password: string | null;
            avatar: string | null;
            xp: number;
            coins: number;
            streak: number;
            lastActiveAt: Date;
            subscription: import("@prisma/client").$Enums.Subscription;
            careerGoal: import("@prisma/client").$Enums.CareerGoal | null;
            learningStyle: import("@prisma/client").$Enums.LearningStyle | null;
            weakTopics: string[];
            strongTopics: string[];
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        role: string;
        permissions: import("@prisma/client/runtime/client").JsonValue | null;
        organizationId: string;
    })[]>;
    removeOrganizationMember(organizationId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        role: string;
        permissions: import("@prisma/client/runtime/client").JsonValue | null;
        organizationId: string;
    }>;
    getOrganizationUsers(organizationId: string): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        googleId: string | null;
        appleId: string | null;
        password: string | null;
        avatar: string | null;
        xp: number;
        coins: number;
        streak: number;
        lastActiveAt: Date;
        subscription: import("@prisma/client").$Enums.Subscription;
        careerGoal: import("@prisma/client").$Enums.CareerGoal | null;
        learningStyle: import("@prisma/client").$Enums.LearningStyle | null;
        weakTopics: string[];
        strongTopics: string[];
    }[]>;
    getUserProgress(organizationId: string, userId: string): Promise<{
        user: {
            level: import("@prisma/client").$Enums.Level;
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            googleId: string | null;
            appleId: string | null;
            password: string | null;
            avatar: string | null;
            xp: number;
            coins: number;
            streak: number;
            lastActiveAt: Date;
            subscription: import("@prisma/client").$Enums.Subscription;
            careerGoal: import("@prisma/client").$Enums.CareerGoal | null;
            learningStyle: import("@prisma/client").$Enums.LearningStyle | null;
            weakTopics: string[];
            strongTopics: string[];
        };
        level: import("@prisma/client").$Enums.Level;
        xp: number;
        coins: number;
        streak: number;
        evaluationsCount: number;
        lessonsCompleted: number;
        missionsCompleted: number;
        lastActive: Date;
    }>;
    getOrganizationStats(organizationId: string): Promise<{
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        totalXP: number;
        averageXP: number;
        levelDistribution: Record<string, number>;
        engagementRate: number;
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
        averageScore: number;
    }[]>;
    updateOrganization(id: string, data: {
        name?: string;
        email?: string;
        phone?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        subscription: import("@prisma/client").$Enums.Subscription;
        type: string;
        phone: string | null;
    }>;
    deleteOrganization(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        subscription: import("@prisma/client").$Enums.Subscription;
        type: string;
        phone: string | null;
    }>;
    getAllOrganizations(): Promise<({
        _count: {
            members: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        subscription: import("@prisma/client").$Enums.Subscription;
        type: string;
        phone: string | null;
    })[]>;
}
