import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Level } from '@prisma/client';
export declare class ScenarioService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    generateScenario(userId: string, context: string, level: Level): Promise<{
        scenario: any;
        scenarioId: string;
    }>;
    private generateFallbackScenario;
    startScenario(userId: string, scenarioId: string): Promise<{
        scenario: {
            level: import("@prisma/client").$Enums.Level;
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            context: string;
            difficulty: number;
            objectives: string[];
            aiScript: import("@prisma/client/runtime/client").JsonValue | null;
        };
        progress: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            userId: string;
            completed: boolean;
            feedback: import("@prisma/client/runtime/client").JsonValue | null;
            scenarioId: string;
            attempts: number;
        };
        message: string;
    }>;
    submitScenarioResponse(userId: string, scenarioId: string, response: string, currentEvent: string): Promise<any>;
    private evaluateFallbackResponse;
    completeScenario(userId: string, scenarioId: string, finalScore: number): Promise<{
        progress: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            score: number | null;
            userId: string;
            completed: boolean;
            feedback: import("@prisma/client/runtime/client").JsonValue | null;
            scenarioId: string;
            attempts: number;
        };
        passed: boolean;
        rewards: {
            xp: number;
            coins: number;
        };
    }>;
    getAvailableScenarios(level?: Level, context?: string): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        context: string;
        difficulty: number;
        objectives: string[];
        aiScript: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    getUserScenarioProgress(userId: string): Promise<({
        scenario: {
            level: import("@prisma/client").$Enums.Level;
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            context: string;
            difficulty: number;
            objectives: string[];
            aiScript: import("@prisma/client/runtime/client").JsonValue | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        score: number | null;
        userId: string;
        completed: boolean;
        feedback: import("@prisma/client/runtime/client").JsonValue | null;
        scenarioId: string;
        attempts: number;
    })[]>;
}
