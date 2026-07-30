import { AiMentorService } from './ai-mentor.service';
export declare class AiMentorController {
    private aiMentorService;
    constructor(aiMentorService: AiMentorService);
    generateProactiveMessage(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: string;
        priority: number;
        read: boolean;
        actionTaken: boolean;
    }>;
    getMentorMessages(req: any, body: {
        unreadOnly?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: string;
        priority: number;
        read: boolean;
        actionTaken: boolean;
    }[]>;
    markMessageAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: string;
        priority: number;
        read: boolean;
        actionTaken: boolean;
    }>;
    markMessageAsActionTaken(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        type: string;
        priority: number;
        read: boolean;
        actionTaken: boolean;
    }>;
    analyzeEmotion(req: any, body: {
        speechText: string;
        speechSpeed: number;
    }): Promise<any>;
    explainLikeIm10(req: any, body: {
        concept: string;
        targetAudience?: string;
    }): Promise<any>;
}
