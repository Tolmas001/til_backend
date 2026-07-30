import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TeacherCmsService } from './teacher-cms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('teacher-cms')
@UseGuards(JwtAuthGuard)
export class TeacherCmsController {
  constructor(private teacherCmsService: TeacherCmsService) {}

  @Post('organization')
  async createOrganization(@Request() req, @Body() body: { name: string; type: string; email: string; phone?: string }) {
    return this.teacherCmsService.createOrganization(body);
  }

  @Get('organization/:id')
  async getOrganization(@Param('id') id: string) {
    return this.teacherCmsService.getOrganization(id);
  }

  @Get('organizations')
  async getAllOrganizations() {
    return this.teacherCmsService.getAllOrganizations();
  }

  @Put('organization/:id')
  async updateOrganization(@Param('id') id: string, @Body() body: { name?: string; email?: string; phone?: string }) {
    return this.teacherCmsService.updateOrganization(id, body);
  }

  @Delete('organization/:id')
  async deleteOrganization(@Param('id') id: string) {
    return this.teacherCmsService.deleteOrganization(id);
  }

  @Post('organization/:id/members')
  async addOrganizationMember(@Param('id') organizationId: string, @Body() body: { userId: string; role: string; permissions?: any }) {
    return this.teacherCmsService.addOrganizationMember(organizationId, body.userId, body.role, body.permissions);
  }

  @Get('organization/:id/members')
  async getOrganizationMembers(@Param('id') organizationId: string) {
    return this.teacherCmsService.getOrganizationMembers(organizationId);
  }

  @Delete('organization/:id/members/:userId')
  async removeOrganizationMember(@Param('id') organizationId: string, @Param('userId') userId: string) {
    return this.teacherCmsService.removeOrganizationMember(organizationId, userId);
  }

  @Get('organization/:id/users')
  async getOrganizationUsers(@Param('id') organizationId: string) {
    return this.teacherCmsService.getOrganizationUsers(organizationId);
  }

  @Get('organization/:id/users/:userId/progress')
  async getUserProgress(@Param('id') organizationId: string, @Param('userId') userId: string) {
    return this.teacherCmsService.getUserProgress(organizationId, userId);
  }

  @Get('organization/:id/stats')
  async getOrganizationStats(@Param('id') organizationId: string) {
    return this.teacherCmsService.getOrganizationStats(organizationId);
  }

  @Get('organization/:id/progress')
  async getOrganizationProgress(@Param('id') organizationId: string) {
    return this.teacherCmsService.getOrganizationProgress(organizationId);
  }
}
