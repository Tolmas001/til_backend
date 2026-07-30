import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('marketplace')
@UseGuards(JwtAuthGuard)
export class MarketplaceController {
  constructor(private marketplaceService: MarketplaceService) {}

  @Post('content')
  async createContent(@Request() req, @Body() body: { title: string; description: string; content: any; price: number; category: string }) {
    return this.marketplaceService.createContent(req.user.id, body.title, body.description, body.content, body.price, body.category);
  }

  @Put('content/:id')
  async updateContent(@Param('id') contentId: string, @Body() body: any) {
    return this.marketplaceService.updateContent(contentId, body);
  }

  @Delete('content/:id')
  async deleteContent(@Param('id') contentId: string) {
    return this.marketplaceService.deleteContent(contentId);
  }

  @Get('content/:id')
  async getContent(@Param('id') contentId: string) {
    return this.marketplaceService.getContent(contentId);
  }

  @Get('content')
  async getAllContent(@Body() body: { category?: string; status?: string; minPrice?: number; maxPrice?: number }) {
    return this.marketplaceService.getAllContent(body);
  }

  @Get('my-content')
  async getTeacherContent(@Request() req) {
    return this.marketplaceService.getTeacherContent(req.user.id);
  }

  @Post('purchase/:id')
  async purchaseContent(@Request() req, @Param('id') contentId: string) {
    return this.marketplaceService.purchaseContent(req.user.id, contentId);
  }

  @Get('my-purchases')
  async getUserPurchases(@Request() req) {
    return this.marketplaceService.getUserPurchases(req.user.id);
  }

  @Post('approve/:id')
  async approveContent(@Param('id') contentId: string) {
    return this.marketplaceService.approveContent(contentId);
  }

  @Post('reject/:id')
  async rejectContent(@Param('id') contentId: string, @Body() body: { reason: string }) {
    return this.marketplaceService.rejectContent(contentId, body.reason);
  }

  @Get('earnings')
  async getTeacherEarnings(@Request() req) {
    return this.marketplaceService.getTeacherEarnings(req.user.id);
  }

  @Get('stats')
  async getMarketplaceStats() {
    return this.marketplaceService.getMarketplaceStats();
  }
}
