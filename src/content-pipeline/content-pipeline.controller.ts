import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ContentPipelineService } from './content-pipeline.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('content-pipeline')
@UseGuards(JwtAuthGuard)
export class ContentPipelineController {
  constructor(private contentPipelineService: ContentPipelineService) {}

  @Post('generate')
  async generateContent(@Request() req, @Body() body: { topic: string; level: string }) {
    return this.contentPipelineService.generateContent(req.user.id, body.topic, body.level);
  }

  @Get(':id')
  async getContentGeneration(@Param('id') id: string) {
    return this.contentPipelineService.getContentGeneration(id);
  }

  @Get('my')
  async getUserContentGenerations(@Request() req, @Body() body: { limit?: number }) {
    return this.contentPipelineService.getUserContentGenerations(req.user.id, body.limit || 20);
  }

  @Delete(':id')
  async deleteContentGeneration(@Param('id') id: string) {
    return this.contentPipelineService.deleteContentGeneration(id);
  }

  @Get('stats')
  async getContentStats() {
    return this.contentPipelineService.getContentStats();
  }
}
