import { ScenarioService } from './scenario.service';
import { Level } from '@prisma/client';
export declare class ScenarioController {
    private scenarioService;
    constructor(scenarioService: ScenarioService);
    generateScenario(req: any, body: {
        context: string;
        level: Level;
    }): Promise<{
        scenario: any;
        scenarioId: string;
    }>;
    startScenario(req: any, id: string): Promise<{
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
    submitResponse(req: any, id: string, body: {
        response: string;
        currentEvent: string;
    }): Promise<any>;
    completeScenario(req: any, id: string, body: {
        finalScore: number;
    }): Promise<{
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
    getAvailableScenarios(req: any, body: {
        level?: Level;
        context?: string;
    }): Promise<{
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
    getUserProgress(req: any): Promise<({
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
