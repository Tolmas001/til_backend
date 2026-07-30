import { AiLearningService } from './ai-learning.service';
import { CareerGoal } from '@prisma/client';
export declare class AiLearningController {
    private aiLearningService;
    constructor(aiLearningService: AiLearningService);
    assessUser(req: any): Promise<{
        weakTopics: string[];
        strongTopics: string[];
        topicMastery: {};
        recommendedLevel: import("@prisma/client").$Enums.Level;
    }>;
    getPersonalizedPlan(req: any): Promise<any>;
    setCareerGoal(req: any, body: {
        goal: CareerGoal;
    }): Promise<{
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
    detectLearningStyle(req: any): Promise<{
        style: "AUDITORY" | "READING" | "MIXED";
        recommendations: string[];
    }>;
    getKnowledgeGraph(req: any): Promise<{
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
    updateKnowledgeNode(req: any, topic: string, body: {
        mastery: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        reviewCount: number;
        lastReviewedAt: Date;
        topic: string;
        mastery: number;
    }>;
}
