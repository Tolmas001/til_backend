import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class ChurnPredictionService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    predictChurnRisk(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        riskScore: number;
        riskLevel: string;
        predictedChurnDate: Date | null;
        factors: import("@prisma/client/runtime/client").JsonValue;
        interventionSent: boolean;
        interventionType: string | null;
    }>;
    private calculateChurnFactors;
    private calculateRiskScore;
    private getRiskLevel;
    private predictChurnDate;
    getChurnRisk(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        riskScore: number;
        riskLevel: string;
        predictedChurnDate: Date | null;
        factors: import("@prisma/client/runtime/client").JsonValue;
        interventionSent: boolean;
        interventionType: string | null;
    }>;
    sendIntervention(userId: string, interventionType: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        riskScore: number;
        riskLevel: string;
        predictedChurnDate: Date | null;
        factors: import("@prisma/client/runtime/client").JsonValue;
        interventionSent: boolean;
        interventionType: string | null;
    }>;
    getHighRiskUsers(threshold?: number): Promise<({
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
        updatedAt: Date;
        userId: string;
        riskScore: number;
        riskLevel: string;
        predictedChurnDate: Date | null;
        factors: import("@prisma/client/runtime/client").JsonValue;
        interventionSent: boolean;
        interventionType: string | null;
    })[]>;
    getChurnStats(): Promise<{
        total: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        averageRisk: number;
        distribution: {
            critical: number;
            high: number;
            medium: number;
            low: number;
        };
    }>;
}
