import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class MarketplaceService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(MarketplaceService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({ apiKey });
    }
  }

  // Marketplace - Teacher content platform
  async createContent(userId: string, title: string, description: string, content: any, price: number, category: string) {
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

  async updateContent(contentId: string, updates: any) {
    return this.prisma.marketplaceContent.update({
      where: { id: contentId },
      data: updates,
    });
  }

  async deleteContent(contentId: string) {
    return this.prisma.marketplaceContent.delete({
      where: { id: contentId },
    });
  }

  async getContent(contentId: string) {
    return this.prisma.marketplaceContent.findUnique({
      where: { id: contentId },
    });
  }

  async getAllContent(filters?: { category?: string; status?: string; minPrice?: number; maxPrice?: number }) {
    const where: any = {};
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

  async getTeacherContent(userId: string) {
    return this.prisma.marketplaceContent.findMany({
      where: { teacherId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async purchaseContent(userId: string, contentId: string) {
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

    // Check if already purchased
    const existingPurchase = await this.prisma.marketplacePurchase.findFirst({
      where: {
        userId,
        contentId,
      },
    });

    if (existingPurchase) {
      throw new Error('Content already purchased');
    }

    // Create purchase record
    const purchase = await this.prisma.marketplacePurchase.create({
      data: {
        userId,
        contentId,
        teacherId: content.teacherId,
        amount: content.price,
        purchasedAt: new Date(),
      },
    });

    // Deduct coins from user
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        coins: {
          decrement: content.price,
        },
      },
    });

    // Add coins to teacher (70% royalty)
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

  async getUserPurchases(userId: string) {
    return this.prisma.marketplacePurchase.findMany({
      where: { userId },
      include: {
        content: true,
      },
      orderBy: { purchasedAt: 'desc' },
    });
  }

  async approveContent(contentId: string) {
    return this.prisma.marketplaceContent.update({
      where: { id: contentId },
      data: {
        status: 'approved',
        approvedAt: new Date(),
      },
    });
  }

  async rejectContent(contentId: string, reason: string) {
    return this.prisma.marketplaceContent.update({
      where: { id: contentId },
      data: {
        status: 'rejected',
        rejectionReason: reason,
      },
    });
  }

  async getTeacherEarnings(userId: string) {
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

    const categoryStats: Record<string, number> = {};
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
}
