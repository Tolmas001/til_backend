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
exports.LearningReplayController = void 0;
const common_1 = require("@nestjs/common");
const learning_replay_service_1 = require("./learning-replay.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let LearningReplayController = class LearningReplayController {
    constructor(learningReplayService) {
        this.learningReplayService = learningReplayService;
    }
    async generateWeeklyReport(req, body) {
        return this.learningReplayService.generateWeeklyReport(req.user.id, new Date(body.startDate), new Date(body.endDate));
    }
    async getReport(reportId) {
        return this.learningReplayService.getReport(reportId);
    }
    async getUserReports(req, body) {
        return this.learningReplayService.getUserReports(req.user.id, body.limit || 20);
    }
    async getLatestReport(req) {
        return this.learningReplayService.getLatestReport(req.user.id);
    }
    async getReportStats() {
        return this.learningReplayService.getReportStats();
    }
};
exports.LearningReplayController = LearningReplayController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LearningReplayController.prototype, "generateWeeklyReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LearningReplayController.prototype, "getReport", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LearningReplayController.prototype, "getUserReports", null);
__decorate([
    (0, common_1.Get)('latest'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LearningReplayController.prototype, "getLatestReport", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LearningReplayController.prototype, "getReportStats", null);
exports.LearningReplayController = LearningReplayController = __decorate([
    (0, common_1.Controller)('learning-replay'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [learning_replay_service_1.LearningReplayService])
], LearningReplayController);
//# sourceMappingURL=learning-replay.controller.js.map