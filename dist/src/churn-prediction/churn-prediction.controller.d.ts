import { ChurnPredictionService } from './churn-prediction.service';
export declare class ChurnPredictionController {
    private churnPredictionService;
    constructor(churnPredictionService: ChurnPredictionService);
    predictChurnRisk(req: any): Promise<{
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
    getChurnRisk(req: any): Promise<{
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
    sendIntervention(req: any, body: {
        interventionType: string;
    }): Promise<{
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
    getHighRiskUsers(body: {
        threshold?: number;
    }): Promise<({
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
