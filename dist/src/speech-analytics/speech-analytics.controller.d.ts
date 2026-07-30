import { SpeechAnalyticsService } from './speech-analytics.service';
export declare class SpeechAnalyticsController {
    private speechAnalyticsService;
    constructor(speechAnalyticsService: SpeechAnalyticsService);
    analyzeSpeech(req: any, body: {
        audioUrl: string;
        transcript: string;
    }): Promise<{
        analysis: {
            pronunciationScore: number;
            fluencyScore: number;
            intonationScore: number;
            stressScore: number;
            pauseScore: number;
            overallScore: number;
            feedback: {
                strengths: string[];
                weaknesses: string[];
                improvements: string[];
                specificErrors: any[];
            };
        };
        speechRecord: any;
    } | {
        speechRecord: {
            id: string;
            createdAt: Date;
            userId: string;
            audioUrl: string;
            transcript: string;
            pronunciationScore: number;
            fluencyScore: number;
            intonationScore: number;
            stressScore: number;
            pauseScore: number;
            overallScore: number;
            feedback: import("@prisma/client/runtime/client").JsonValue;
        };
        analysis: any;
    }>;
    getSpeechHistory(req: any, body: {
        limit?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        audioUrl: string;
        transcript: string;
        pronunciationScore: number;
        fluencyScore: number;
        intonationScore: number;
        stressScore: number;
        pauseScore: number;
        overallScore: number;
        feedback: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    getWeeklyReport(req: any): Promise<{
        message: string;
        records: any[];
        averages?: undefined;
        improvement?: undefined;
        commonWeaknesses?: undefined;
        recommendations?: undefined;
    } | {
        records: {
            id: string;
            createdAt: Date;
            userId: string;
            audioUrl: string;
            transcript: string;
            pronunciationScore: number;
            fluencyScore: number;
            intonationScore: number;
            stressScore: number;
            pauseScore: number;
            overallScore: number;
            feedback: import("@prisma/client/runtime/client").JsonValue;
        }[];
        averages: {
            pronunciation: number;
            fluency: number;
            intonation: number;
            stress: number;
            pause: number;
            overall: number;
        };
        improvement: number;
        commonWeaknesses: string[];
        recommendations: string[];
        message?: undefined;
    }>;
    compareWithNative(req: any, body: {
        userTranscript: string;
        nativeTranscript: string;
    }): Promise<any>;
}
