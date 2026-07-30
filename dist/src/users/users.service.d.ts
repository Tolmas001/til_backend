import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        lessons: ({
            lesson: {
                level: import(".prisma/client").$Enums.Level;
                id: string;
                description: string | null;
                order: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                locationId: string | null;
                topics: string[];
                dialogs: Prisma.JsonValue;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            lessonId: string;
            completed: boolean;
            score: number | null;
            completedAt: Date | null;
            userId: string;
        })[];
        achievements: ({
            achievement: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                icon: string | null;
                condition: string;
                reward: number;
                coinReward: number | null;
            };
        } & {
            id: string;
            unlocked: boolean;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            unlockedAt: Date | null;
            achievementId: string;
        })[];
        dailyQuests: ({
            quest: {
                id: string;
                description: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                coinReward: number;
                type: import(".prisma/client").$Enums.QuestType;
                target: number;
                xpReward: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            progress: number;
            completed: boolean;
            userId: string;
            date: Date;
            questId: string;
        })[];
    } & {
        level: import(".prisma/client").$Enums.Level;
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
        subscription: import(".prisma/client").$Enums.Subscription;
    }>;
    findByEmail(email: string): Promise<{
        level: import(".prisma/client").$Enums.Level;
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
        subscription: import(".prisma/client").$Enums.Subscription;
    }>;
    findByGoogleId(googleId: string): Promise<{
        level: import(".prisma/client").$Enums.Level;
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
        subscription: import(".prisma/client").$Enums.Subscription;
    }>;
    findByAppleId(appleId: string): Promise<{
        level: import(".prisma/client").$Enums.Level;
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
        subscription: import(".prisma/client").$Enums.Subscription;
    }>;
    create(data: Prisma.UserCreateInput): Promise<{
        level: import(".prisma/client").$Enums.Level;
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
        subscription: import(".prisma/client").$Enums.Subscription;
    }>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<{
        level: import(".prisma/client").$Enums.Level;
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
        subscription: import(".prisma/client").$Enums.Subscription;
    }>;
    updateProgressStats(id: string, xpGain: number, coinsGain: number): Promise<{
        level: import(".prisma/client").$Enums.Level;
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
        subscription: import(".prisma/client").$Enums.Subscription;
    }>;
}
