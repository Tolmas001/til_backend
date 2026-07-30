import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class AiMentorService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    generateProactiveMessage(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: string;
        priority: number;
        read: boolean;
        actionTaken: boolean;
    }>;
    getMentorMessages(userId: string, unreadOnly?: boolean): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: string;
        priority: number;
        read: boolean;
        actionTaken: boolean;
    }[]>;
    markMessageAsRead(messageId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: string;
        priority: number;
        read: boolean;
        actionTaken: boolean;
    }>;
    markMessageAsActionTaken(messageId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: string;
        priority: number;
        read: boolean;
        actionTaken: boolean;
    }>;
    analyzeUserEmotion(userId: string, speechText: string, speechSpeed: number): Promise<any>;
    private generateFallbackEmotionAnalysis;
    explainLikeIm10(userId: string, concept: string, targetAudience?: string): Promise<any>;
    private generateFallbackExplanation;
}
