import { MarketplaceService } from './marketplace.service';
export declare class MarketplaceController {
    private marketplaceService;
    constructor(marketplaceService: MarketplaceService);
    createContent(req: any, body: {
        title: string;
        description: string;
        content: any;
        price: number;
        category: string;
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
    }>;
    updateContent(contentId: string, body: any): Promise<{
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
    getAllContent(body: {
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
    getTeacherContent(req: any): Promise<{
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
    purchaseContent(req: any, contentId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        teacherId: string;
        contentId: string;
        amount: number;
        purchasedAt: Date;
    }>;
    getUserPurchases(req: any): Promise<({
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
    rejectContent(contentId: string, body: {
        reason: string;
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
    }>;
    getTeacherEarnings(req: any): Promise<{
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
