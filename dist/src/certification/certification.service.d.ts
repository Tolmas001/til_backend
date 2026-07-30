import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Level } from '@prisma/client';
export declare class CertificationService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    generateExam(userId: string, targetLevel: Level): Promise<any>;
    private generateFallbackExam;
    submitExam(userId: string, answers: any): Promise<{
        certification: {
            level: import("@prisma/client").$Enums.Level;
            id: string;
            createdAt: Date;
            score: number;
            examDate: Date;
            expiresAt: Date;
            certificateUrl: string | null;
            userId: string;
        };
        passed: boolean;
        score: number;
        certifiedLevel: import("@prisma/client").$Enums.Level;
    }>;
    getUserCertifications(userId: string): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        score: number;
        examDate: Date;
        expiresAt: Date;
        certificateUrl: string | null;
        userId: string;
    }[]>;
    generateCertificate(userId: string, certificationId: string): Promise<{
        certificateUrl: string;
        certificate: {
            name: string;
            level: import("@prisma/client").$Enums.Level;
            score: number;
            date: Date;
            expiresAt: Date;
        };
    }>;
}
