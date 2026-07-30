import { ChatService } from './chat.service';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    getChats(req: any): Promise<({
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
    getChat(req: any, id: string): Promise<{
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
    createChat(req: any, body: {
        title?: string;
        aiCharacter?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
        userId: string;
        aiCharacter: string | null;
    }>;
    sendMessage(req: any, id: string, body: {
        content: string;
    }): Promise<{
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
}
