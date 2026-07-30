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
exports.AiLearningController = void 0;
const common_1 = require("@nestjs/common");
const ai_learning_service_1 = require("./ai-learning.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AiLearningController = class AiLearningController {
    constructor(aiLearningService) {
        this.aiLearningService = aiLearningService;
    }
    async assessUser(req) {
        return this.aiLearningService.assessUserLevel(req.user.id);
    }
    async getPersonalizedPlan(req) {
        return this.aiLearningService.generatePersonalizedPlan(req.user.id);
    }
    async setCareerGoal(req, body) {
        return this.aiLearningService.setCareerGoal(req.user.id, body.goal);
    }
    async detectLearningStyle(req) {
        return this.aiLearningService.detectLearningStyle(req.user.id);
    }
    async getKnowledgeGraph(req) {
        return this.aiLearningService.getKnowledgeGraph(req.user.id);
    }
    async updateKnowledgeNode(req, topic, body) {
        return this.aiLearningService.updateKnowledgeNode(req.user.id, topic, body.mastery);
    }
};
exports.AiLearningController = AiLearningController;
__decorate([
    (0, common_1.Get)('assessment'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiLearningController.prototype, "assessUser", null);
__decorate([
    (0, common_1.Get)('plan'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiLearningController.prototype, "getPersonalizedPlan", null);
__decorate([
    (0, common_1.Put)('career-goal'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AiLearningController.prototype, "setCareerGoal", null);
__decorate([
    (0, common_1.Get)('learning-style'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiLearningController.prototype, "detectLearningStyle", null);
__decorate([
    (0, common_1.Get)('knowledge-graph'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AiLearningController.prototype, "getKnowledgeGraph", null);
__decorate([
    (0, common_1.Post)('knowledge/:topic'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('topic')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AiLearningController.prototype, "updateKnowledgeNode", null);
exports.AiLearningController = AiLearningController = __decorate([
    (0, common_1.Controller)('ai-learning'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ai_learning_service_1.AiLearningService])
], AiLearningController);
//# sourceMappingURL=ai-learning.controller.js.map