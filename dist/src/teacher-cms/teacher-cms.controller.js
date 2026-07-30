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
exports.TeacherCmsController = void 0;
const common_1 = require("@nestjs/common");
const teacher_cms_service_1 = require("./teacher-cms.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TeacherCmsController = class TeacherCmsController {
    constructor(teacherCmsService) {
        this.teacherCmsService = teacherCmsService;
    }
    async createOrganization(req, body) {
        return this.teacherCmsService.createOrganization(body);
    }
    async getOrganization(id) {
        return this.teacherCmsService.getOrganization(id);
    }
    async getAllOrganizations() {
        return this.teacherCmsService.getAllOrganizations();
    }
    async updateOrganization(id, body) {
        return this.teacherCmsService.updateOrganization(id, body);
    }
    async deleteOrganization(id) {
        return this.teacherCmsService.deleteOrganization(id);
    }
    async addOrganizationMember(organizationId, body) {
        return this.teacherCmsService.addOrganizationMember(organizationId, body.userId, body.role, body.permissions);
    }
    async getOrganizationMembers(organizationId) {
        return this.teacherCmsService.getOrganizationMembers(organizationId);
    }
    async removeOrganizationMember(organizationId, userId) {
        return this.teacherCmsService.removeOrganizationMember(organizationId, userId);
    }
    async getOrganizationUsers(organizationId) {
        return this.teacherCmsService.getOrganizationUsers(organizationId);
    }
    async getUserProgress(organizationId, userId) {
        return this.teacherCmsService.getUserProgress(organizationId, userId);
    }
    async getOrganizationStats(organizationId) {
        return this.teacherCmsService.getOrganizationStats(organizationId);
    }
    async getOrganizationProgress(organizationId) {
        return this.teacherCmsService.getOrganizationProgress(organizationId);
    }
};
exports.TeacherCmsController = TeacherCmsController;
__decorate([
    (0, common_1.Post)('organization'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TeacherCmsController.prototype, "createOrganization", null);
__decorate([
    (0, common_1.Get)('organization/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherCmsController.prototype, "getOrganization", null);
__decorate([
    (0, common_1.Get)('organizations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeacherCmsController.prototype, "getAllOrganizations", null);
__decorate([
    (0, common_1.Put)('organization/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TeacherCmsController.prototype, "updateOrganization", null);
__decorate([
    (0, common_1.Delete)('organization/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherCmsController.prototype, "deleteOrganization", null);
__decorate([
    (0, common_1.Post)('organization/:id/members'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TeacherCmsController.prototype, "addOrganizationMember", null);
__decorate([
    (0, common_1.Get)('organization/:id/members'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherCmsController.prototype, "getOrganizationMembers", null);
__decorate([
    (0, common_1.Delete)('organization/:id/members/:userId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TeacherCmsController.prototype, "removeOrganizationMember", null);
__decorate([
    (0, common_1.Get)('organization/:id/users'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherCmsController.prototype, "getOrganizationUsers", null);
__decorate([
    (0, common_1.Get)('organization/:id/users/:userId/progress'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TeacherCmsController.prototype, "getUserProgress", null);
__decorate([
    (0, common_1.Get)('organization/:id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherCmsController.prototype, "getOrganizationStats", null);
__decorate([
    (0, common_1.Get)('organization/:id/progress'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherCmsController.prototype, "getOrganizationProgress", null);
exports.TeacherCmsController = TeacherCmsController = __decorate([
    (0, common_1.Controller)('teacher-cms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [teacher_cms_service_1.TeacherCmsService])
], TeacherCmsController);
//# sourceMappingURL=teacher-cms.controller.js.map