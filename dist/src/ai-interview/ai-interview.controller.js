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
exports.AiInterviewController = void 0;
const common_1 = require("@nestjs/common");
const ai_interview_service_1 = require("./ai-interview.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AiInterviewController = class AiInterviewController {
    constructor(aiInterviewService) {
        this.aiInterviewService = aiInterviewService;
    }
    async generateInterview(req, body) {
        return this.aiInterviewService.generateInterview(req.user.id, body.jobType, body.level);
    }
    async submitAnswer(req, body) {
        return this.aiInterviewService.submitAnswer(req.user.id, body.interviewId, body.questionId, body.answer, body.audioUrl);
    }
    async completeInterview(req, body) {
        return this.aiInterviewService.completeInterview(req.user.id, body.interviewId);
    }
    async getInterview(interviewId) {
        return this.aiInterviewService.getInterview(interviewId);
    }
    async getUserInterviews(req, body) {
        return this.aiInterviewService.getUserInterviews(req.user.id, body.limit || 20);
    }
    async getInterviewStats() {
        return this.aiInterviewService.getInterviewStats();
    }
};
exports.AiInterviewController = AiInterviewController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiInterviewController.prototype, "generateInterview", null);
__decorate([
    (0, common_1.Post)('submit-answer'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiInterviewController.prototype, "submitAnswer", null);
__decorate([
    (0, common_1.Post)('complete'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiInterviewController.prototype, "completeInterview", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiInterviewController.prototype, "getInterview", null);
__decorate([
    (0, common_1.Get)('my'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiInterviewController.prototype, "getUserInterviews", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiInterviewController.prototype, "getInterviewStats", null);
exports.AiInterviewController = AiInterviewController = __decorate([
    (0, common_1.Controller)('ai-interview'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ai_interview_service_1.AiInterviewService])
], AiInterviewController);
//# sourceMappingURL=ai-interview.controller.js.map