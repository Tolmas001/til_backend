"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MarketplaceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let MarketplaceService = MarketplaceService_1 = class MarketplaceService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.openai = null;
        this.logger = new common_1.Logger(MarketplaceService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (apiKey && apiKey !== 'your-openai-api-key') {
            this.openai = new openai_1.default({ apiKey });
        }
    }
    async createContent(userId, title, description, content, price, category) {
        return this.prisma.marketplaceContent.create({
            data: {
                teacherId: userId,
                title,
                description,
                content,
                price,
                category,
                status: 'pending',
                createdAt: new Date(),
            },
        });
    }
    async updateContent(contentId, updates) {
        return this.prisma.marketplaceContent.update({
            where: { id: contentId },
            data: updates,
        });
    }
    async deleteContent(contentId) {
        return this.prisma.marketplaceContent.delete({
            where: { id: contentId },
        });
    }
    async getContent(contentId) {
        return this.prisma.marketplaceContent.findUnique({
            where: { id: contentId },
        });
    }
    async getAllContent(filters) {
        const where = {};
        if (filters?.category) {
            where.category = filters.category;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.minPrice || filters?.maxPrice) {
            where.price = {};
            if (filters.minPrice) {
                where.price.gte = filters.minPrice;
            }
            if (filters.maxPrice) {
                where.price.lte = filters.maxPrice;
            }
        }
        return this.prisma.marketplaceContent.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getTeacherContent(userId) {
        return this.prisma.marketplaceContent.findMany({
            where: { teacherId: userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async purchaseContent(userId, contentId) {
        const content = await this.prisma.marketplaceContent.findUnique({
            where: { id: contentId },
        });
        if (!content) {
            throw new Error('Content not found');
        }
        if (content.status !== 'approved') {
            throw new Error('Content not available for purchase');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || user.coins < content.price) {
            throw new Error('Insufficient coins');
        }
        const existingPurchase = await this.prisma.marketplacePurchase.findFirst({
            where: {
                userId,
                contentId,
            },
        });
        if (existingPurchase) {
            throw new Error('Content already purchased');
        }
        const purchase = await this.prisma.marketplacePurchase.create({
            data: {
                userId,
                contentId,
                teacherId: content.teacherId,
                amount: content.price,
                purchasedAt: new Date(),
            },
        });
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                coins: {
                    decrement: content.price,
                },
            },
        });
        const royalty = Math.round(content.price * 0.7);
        await this.prisma.user.update({
            where: { id: content.teacherId },
            data: {
                coins: {
                    increment: royalty,
                },
            },
        });
        return purchase;
    }
    async getUserPurchases(userId) {
        return this.prisma.marketplacePurchase.findMany({
            where: { userId },
            include: {
                content: true,
            },
            orderBy: { purchasedAt: 'desc' },
        });
    }
    async approveContent(contentId) {
        return this.prisma.marketplaceContent.update({
            where: { id: contentId },
            data: {
                status: 'approved',
                approvedAt: new Date(),
            },
        });
    }
    async rejectContent(contentId, reason) {
        return this.prisma.marketplaceContent.update({
            where: { id: contentId },
            data: {
                status: 'rejected',
                rejectionReason: reason,
            },
        });
    }
    async getTeacherEarnings(userId) {
        const purchases = await this.prisma.marketplacePurchase.findMany({
            where: { teacherId: userId },
        });
        const totalEarnings = purchases.reduce((sum, p) => sum + Math.round(p.amount * 0.7), 0);
        const totalSales = purchases.length;
        const content = await this.prisma.marketplaceContent.findMany({
            where: { teacherId: userId },
        });
        const totalContent = content.length;
        const approvedContent = content.filter((c) => c.status === 'approved').length;
        return {
            totalEarnings,
            totalSales,
            totalContent,
            approvedContent,
            averageEarningsPerSale: totalSales > 0 ? Math.round(totalEarnings / totalSales) : 0,
        };
    }
    async getMarketplaceStats() {
        const content = await this.prisma.marketplaceContent.findMany();
        const purchases = await this.prisma.marketplacePurchase.findMany();
        const totalContent = content.length;
        const approvedContent = content.filter((c) => c.status === 'approved').length;
        const pendingContent = content.filter((c) => c.status === 'pending').length;
        const totalPurchases = purchases.length;
        const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
        const categoryStats = {};
        content.forEach((c) => {
            categoryStats[c.category] = (categoryStats[c.category] || 0) + 1;
        });
        const uniqueTeachers = new Set(content.map((c) => c.teacherId)).size;
        return {
            totalContent,
            approvedContent,
            pendingContent,
            totalPurchases,
            totalRevenue,
            categoryStats,
            uniqueTeachers,
            averagePrice: totalContent > 0 ? Math.round(totalRevenue / totalPurchases) : 0,
        };
    }
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = MarketplaceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], MarketplaceService);
//# sourceMappingURL=marketplace.service.js.map