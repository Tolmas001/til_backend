import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Level } from '@prisma/client';

@Controller('certification')
@UseGuards(JwtAuthGuard)
export class CertificationController {
  constructor(private certificationService: CertificationService) {}

  @Post('exam/generate')
  async generateExam(@Request() req, @Body() body: { targetLevel: Level }) {
    return this.certificationService.generateExam(req.user.id, body.targetLevel);
  }

  @Post('exam/submit')
  async submitExam(@Request() req, @Body() body: { answers: any }) {
    return this.certificationService.submitExam(req.user.id, body.answers);
  }

  @Get()
  async getUserCertifications(@Request() req) {
    return this.certificationService.getUserCertifications(req.user.id);
  }

  @Post(':id/certificate')
  async generateCertificate(@Request() req, @Param('id') id: string) {
    return this.certificationService.generateCertificate(req.user.id, id);
  }
}
