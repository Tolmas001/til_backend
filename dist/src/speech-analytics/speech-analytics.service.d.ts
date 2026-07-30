import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class SpeechAnalyticsService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    analyzeSpeech(userId: string, audioUrl: string, transcript: string): Promise<{
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
    private generateFallbackAnalysis;
    getUserSpeechHistory(userId: string, limit?: number): Promise<{
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
    getWeeklySpeechReport(userId: string): Promise<{
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
    private generateSpeechRecommendations;
    compareWithNative(userId: string, userTranscript: string, nativeTranscript: string): Promise<any>;
    private generateFallbackComparison;
}
