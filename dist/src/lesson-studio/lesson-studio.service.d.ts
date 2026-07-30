import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class LessonStudioService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    generateFullLesson(userId: string, prompt: string, level: string): Promise<{
        contentGeneration: {
            level: import("@prisma/client").$Enums.Level;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            topic: string;
            status: string;
            generatedAt: Date | null;
            generatedContent: import("@prisma/client/runtime/client").JsonValue;
        };
        lesson: any;
    }>;
    private generateFallbackLesson;
    getLessonTemplates(): Promise<{
        id: string;
        name: string;
        description: string;
        template: string;
    }[]>;
    getLessonStats(): Promise<{
        totalLessons: number;
        totalGenerated: number;
        byLevel: {
            A0: number;
            A1: number;
            A2: number;
            B1: number;
            B2: number;
        };
    }>;
}
