import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CareerGoal, Level } from '@prisma/client';
export declare class AiLearningService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    assessUserLevel(userId: string): Promise<{
        weakTopics: string[];
        strongTopics: string[];
        topicMastery: {};
        recommendedLevel: import("@prisma/client").$Enums.Level;
    }>;
    private calculateRecommendedLevel;
    generatePersonalizedPlan(userId: string): Promise<any>;
    private generateFallbackPlan;
    setCareerGoal(userId: string, goal: CareerGoal): Promise<{
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
        recommendations: any;
    }>;
    generateCareerRecommendations(goal: CareerGoal, level: Level): Promise<any>;
    detectLearningStyle(userId: string): Promise<{
        style: "AUDITORY" | "READING" | "MIXED";
        recommendations: string[];
    }>;
    private getStyleRecommendations;
    updateKnowledgeNode(userId: string, topic: string, mastery: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        reviewCount: number;
        lastReviewedAt: Date;
        topic: string;
        mastery: number;
    }>;
    getKnowledgeGraph(userId: string): Promise<{
        nodes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            reviewCount: number;
            lastReviewedAt: Date;
            topic: string;
            mastery: number;
        }[];
        totalTopics: number;
        masteredTopics: number;
        weakTopics: string[];
    }>;
}
