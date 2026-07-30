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
exports.EvaluationController = void 0;
const common_1 = require("@nestjs/common");
const evaluation_service_1 = require("./evaluation.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let EvaluationController = class EvaluationController {
    constructor(evaluationService) {
        this.evaluationService = evaluationService;
    }
    async evaluateExercise(req, body) {
        return this.evaluationService.evaluateExercise(req.user.id, body.exerciseId, body.exerciseType, body.userResponse, body.expectedResponse);
    }
    async getUserEvaluations(req, body) {
        return this.evaluationService.getUserEvaluations(req.user.id, body.limit || 20);
    }
    async getAverageScores(req) {
        return this.evaluationService.getAverageScores(req.user.id);
    }
    async mapCefrLevels(req) {
        return this.evaluationService.mapCefrLevels(req.user.id);
    }
    async getCefrLevels(req) {
        return this.evaluationService.getCefrLevels(req.user.id);
    }
    async trackLearningEvidence(req, body) {
        return this.evaluationService.trackLearningEvidence(req.user.id, body.level, body.exerciseType);
    }
    async getLearningEvidence(req, body) {
        return this.evaluationService.getLearningEvidence(req.user.id, body.level);
    }
    async checkLevelCompletion(req, level, skill) {
        return this.evaluationService.checkLevelCompletion(req.user.id, level, skill);
    }
};
exports.EvaluationController = EvaluationController;
__decorate([
    (0, common_1.Post)('exercise'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "evaluateExercise", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "getUserEvaluations", null);
__decorate([
    (0, common_1.Get)('average'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "getAverageScores", null);
__decorate([
    (0, common_1.Post)('cefr/map'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "mapCefrLevels", null);
__decorate([
    (0, common_1.Get)('cefr'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "getCefrLevels", null);
__decorate([
    (0, common_1.Post)('evidence/track'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "trackLearningEvidence", null);
__decorate([
    (0, common_1.Get)('evidence'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "getLearningEvidence", null);
__decorate([
    (0, common_1.Get)('evidence/:level/:skill/check'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('level')),
    __param(2, (0, common_1.Param)('skill')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], EvaluationController.prototype, "checkLevelCompletion", null);
exports.EvaluationController = EvaluationController = __decorate([
    (0, common_1.Controller)('evaluation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [evaluation_service_1.EvaluationService])
], EvaluationController);
//# sourceMappingURL=evaluation.controller.js.map