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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentDashboardController = void 0;
const common_1 = require("@nestjs/common");
const parent_dashboard_service_1 = require("./parent-dashboard.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ParentDashboardController = class ParentDashboardController {
    constructor(parentDashboardService) {
        this.parentDashboardService = parentDashboardService;
    }
    async getOrganizationDashboard(organizationId) {
        return this.parentDashboardService.getOrganizationDashboard(organizationId);
    }
    async getUserDashboard(organizationId, userId) {
        return this.parentDashboardService.getUserDashboard(organizationId, userId);
    }
    async getOrganizationProgress(organizationId) {
        return this.parentDashboardService.getOrganizationProgress(organizationId);
    }
    async getOrganizationLeaderboard(organizationId) {
        return this.parentDashboardService.getOrganizationLeaderboard(organizationId);
    }
    async getWeeklyReport(organizationId) {
        return this.parentDashboardService.getWeeklyReport(organizationId);
    }
    async getChurnRiskReport(organizationId) {
        return this.parentDashboardService.getChurnRiskReport(organizationId);
    }
};
exports.ParentDashboardController = ParentDashboardController;
__decorate([
    (0, common_1.Get)('organization/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParentDashboardController.prototype, "getOrganizationDashboard", null);
__decorate([
    (0, common_1.Get)('organization/:id/user/:userId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ParentDashboardController.prototype, "getUserDashboard", null);
__decorate([
    (0, common_1.Get)('organization/:id/progress'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParentDashboardController.prototype, "getOrganizationProgress", null);
__decorate([
    (0, common_1.Get)('organization/:id/leaderboard'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParentDashboardController.prototype, "getOrganizationLeaderboard", null);
__decorate([
    (0, common_1.Get)('organization/:id/weekly-report'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParentDashboardController.prototype, "getWeeklyReport", null);
__decorate([
    (0, common_1.Get)('organization/:id/churn-risk'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParentDashboardController.prototype, "getChurnRiskReport", null);
exports.ParentDashboardController = ParentDashboardController = __decorate([
    (0, common_1.Controller)('parent-dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [parent_dashboard_service_1.ParentDashboardService])
], ParentDashboardController);
//# sourceMappingURL=parent-dashboard.controller.js.map