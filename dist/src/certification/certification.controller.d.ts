import { CertificationService } from './certification.service';
import { Level } from '@prisma/client';
export declare class CertificationController {
    private certificationService;
    constructor(certificationService: CertificationService);
    generateExam(req: any, body: {
        targetLevel: Level;
    }): Promise<any>;
    submitExam(req: any, body: {
        answers: any;
    }): Promise<{
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
    getUserCertifications(req: any): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        createdAt: Date;
        score: number;
        examDate: Date;
        expiresAt: Date;
        certificateUrl: string | null;
        userId: string;
    }[]>;
    generateCertificate(req: any, id: string): Promise<{
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
