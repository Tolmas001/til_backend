import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class ChatService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    getUserChats(userId: string): Promise<({
        messages: {
            id: string;
            createdAt: Date;
            userId: string;
            role: string;
            content: string;
            audioUrl: string | null;
            corrections: import("@prisma/client/runtime/client").JsonValue | null;
            chatId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        userId: string;
        aiCharacter: string | null;
    })[]>;
    getChat(chatId: string, userId: string): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            userId: string;
            role: string;
            content: string;
            audioUrl: string | null;
            corrections: import("@prisma/client/runtime/client").JsonValue | null;
            chatId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        userId: string;
        aiCharacter: string | null;
    }>;
    createChat(userId: string, title?: string, aiCharacter?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        userId: string;
        aiCharacter: string | null;
    }>;
    sendMessage(userId: string, chatId: string, content: string): Promise<{
        userMessage: {
            id: string;
            createdAt: Date;
            userId: string;
            role: string;
            content: string;
            audioUrl: string | null;
            corrections: import("@prisma/client/runtime/client").JsonValue | null;
            chatId: string;
        };
        aiMessage: {
            id: string;
            createdAt: Date;
            userId: string;
            role: string;
            content: string;
            audioUrl: string | null;
            corrections: import("@prisma/client/runtime/client").JsonValue | null;
            chatId: string;
        };
        corrections: any;
    }>;
    private generateFallbackResponse;
    private generateFallbackCorrections;
}
