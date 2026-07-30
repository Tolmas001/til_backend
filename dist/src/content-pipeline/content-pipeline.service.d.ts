import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class ContentPipelineService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    generateContent(userId: string, topic: string, level: string): Promise<{
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
    private generateFallbackContent;
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
    getUserContentGenerations(userId: string, limit?: number): Promise<{
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
