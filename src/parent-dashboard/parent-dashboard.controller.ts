import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ParentDashboardService } from './parent-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('parent-dashboard')
@UseGuards(JwtAuthGuard)
export class ParentDashboardController {
  constructor(private parentDashboardService: ParentDashboardService) {}

  @Get('organization/:id')
  async getOrganizationDashboard(@Param('id') organizationId: string) {
    return this.parentDashboardService.getOrganizationDashboard(organizationId);
  }

  @Get('organization/:id/user/:userId')
  async getUserDashboard(@Param('id') organizationId: string, @Param('userId') userId: string) {
    return this.parentDashboardService.getUserDashboard(organizationId, userId);
  }

  @Get('organization/:id/progress')
  async getOrganizationProgress(@Param('id') organizationId: string) {
    return this.parentDashboardService.getOrganizationProgress(organizationId);
  }

  @Get('organization/:id/leaderboard')
  async getOrganizationLeaderboard(@Param('id') organizationId: string) {
    return this.parentDashboardService.getOrganizationLeaderboard(organizationId);
  }

  @Get('organization/:id/weekly-report')
  async getWeeklyReport(@Param('id') organizationId: string) {
    return this.parentDashboardService.getWeeklyReport(organizationId);
  }

  @Get('organization/:id/churn-risk')
  async getChurnRiskReport(@Param('id') organizationId: string) {
    return this.parentDashboardService.getChurnRiskReport(organizationId);
  }
}
