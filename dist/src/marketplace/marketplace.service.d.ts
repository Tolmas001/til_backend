import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class MarketplaceService {
    private prisma;
    private configService;
    private openai;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    createContent(userId: string, title: string, description: string, content: any, price: number, category: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        category: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        teacherId: string;
        status: string;
        price: number;
        rejectionReason: string | null;
        approvedAt: Date | null;
    }>;
    updateContent(contentId: string, updates: any): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        category: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        teacherId: string;
        status: string;
        price: number;
        rejectionReason: string | null;
        approvedAt: Date | null;
    }>;
    deleteContent(contentId: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        category: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        teacherId: string;
        status: string;
        price: number;
        rejectionReason: string | null;
        approvedAt: Date | null;
    }>;
    getContent(contentId: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        category: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        teacherId: string;
        status: string;
        price: number;
        rejectionReason: string | null;
        approvedAt: Date | null;
    }>;
    getAllContent(filters?: {
        category?: string;
        status?: string;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        category: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        teacherId: string;
        status: string;
        price: number;
        rejectionReason: string | null;
        approvedAt: Date | null;
    }[]>;
    getTeacherContent(userId: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        category: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        teacherId: string;
        status: string;
        price: number;
        rejectionReason: string | null;
        approvedAt: Date | null;
    }[]>;
    purchaseContent(userId: string, contentId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        teacherId: string;
        contentId: string;
        amount: number;
        purchasedAt: Date;
    }>;
    getUserPurchases(userId: string): Promise<({
        content: {
            id: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            category: string;
            content: import("@prisma/client/runtime/client").JsonValue;
            teacherId: string;
            status: string;
            price: number;
            rejectionReason: string | null;
            approvedAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        teacherId: string;
        contentId: string;
        amount: number;
        purchasedAt: Date;
    })[]>;
    approveContent(contentId: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        category: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        teacherId: string;
        status: string;
        price: number;
        rejectionReason: string | null;
        approvedAt: Date | null;
    }>;
    rejectContent(contentId: string, reason: string): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        category: string;
        content: import("@prisma/client/runtime/client").JsonValue;
        teacherId: string;
        status: string;
        price: number;
        rejectionReason: string | null;
        approvedAt: Date | null;
    }>;
    getTeacherEarnings(userId: string): Promise<{
        totalEarnings: number;
        totalSales: number;
        totalContent: number;
        approvedContent: number;
        averageEarningsPerSale: number;
    }>;
    getMarketplaceStats(): Promise<{
        totalContent: number;
        approvedContent: number;
        pendingContent: number;
        totalPurchases: number;
        totalRevenue: number;
        categoryStats: Record<string, number>;
        uniqueTeachers: number;
        averagePrice: number;
    }>;
}
