import { ContentPipelineService } from './content-pipeline.service';
export declare class ContentPipelineController {
    private contentPipelineService;
    constructor(contentPipelineService: ContentPipelineService);
    generateContent(req: any, body: {
        topic: string;
        level: string;
    }): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        topic: string;
        status: string;
        generatedAt: Date | null;
        generatedContent: import("@prisma/client/runtime/client").JsonValue;
    }>;
    getContentGeneration(id: string): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        topic: string;
        status: string;
        generatedAt: Date | null;
        generatedContent: import("@prisma/client/runtime/client").JsonValue;
    }>;
    getUserContentGenerations(req: any, body: {
        limit?: number;
    }): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        topic: string;
        status: string;
        generatedAt: Date | null;
        generatedContent: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    deleteContentGeneration(id: string): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        topic: string;
        status: string;
        generatedAt: Date | null;
        generatedContent: import("@prisma/client/runtime/client").JsonValue;
    }>;
    getContentStats(): Promise<{
        total: number;
        completed: number;
        failed: number;
        pending: number;
        successRate: number;
        levelStats: Record<string, number>;
    }>;
}
