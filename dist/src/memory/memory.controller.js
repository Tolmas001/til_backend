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
exports.MemoryController = void 0;
const common_1 = require("@nestjs/common");
const memory_service_1 = require("./memory.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let MemoryController = class MemoryController {
    constructor(memoryService) {
        this.memoryService = memoryService;
    }
    async recordMistake(req, body) {
        return this.memoryService.recordMistake(req.user.id, body.word, body.mistake, body.correction, body.context);
    }
    async getWordMistakes(req, body) {
        return this.memoryService.getWordMistakes(req.user.id, body.word);
    }
    async getRecurringMistakes(req) {
        return this.memoryService.getRecurringMistakes(req.user.id);
    }
    async getMistakeTimeline(req, word) {
        return this.memoryService.getMistakeTimeline(req.user.id, word);
    }
    async explainMistake(req, body) {
        return this.memoryService.explainMistake(req.user.id, body.original, body.corrected);
    }
    async getMistakeExplanations(req) {
        return this.memoryService.getMistakeExplanations(req.user.id);
    }
    async markExplanationAsReviewed(id) {
        return this.memoryService.markExplanationAsReviewed(id);
    }
    async generateReviewSession(req, body) {
        return this.memoryService.generateReviewSession(req.user.id, body.type);
    }
    async completeReviewSession(id, body) {
        return this.memoryService.completeReviewSession(id, body.score);
    }
    async getReviewSessions(req) {
        return this.memoryService.getReviewSessions(req.user.id);
    }
};
exports.MemoryController = MemoryController;
__decorate([
    (0, common_1.Post)('mistake'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemoryController.prototype, "recordMistake", null);
__decorate([
    (0, common_1.Get)('mistakes'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemoryController.prototype, "getWordMistakes", null);
__decorate([
    (0, common_1.Get)('mistakes/recurring'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemoryController.prototype, "getRecurringMistakes", null);
__decorate([
    (0, common_1.Get)('mistakes/:word/timeline'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('word')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MemoryController.prototype, "getMistakeTimeline", null);
__decorate([
    (0, common_1.Post)('explain'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemoryController.prototype, "explainMistake", null);
__decorate([
    (0, common_1.Get)('explanations'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemoryController.prototype, "getMistakeExplanations", null);
__decorate([
    (0, common_1.Put)('explanation/:id/review'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemoryController.prototype, "markExplanationAsReviewed", null);
__decorate([
    (0, common_1.Post)('review/generate'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MemoryController.prototype, "generateReviewSession", null);
__decorate([
    (0, common_1.Put)('review/:id/complete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MemoryController.prototype, "completeReviewSession", null);
__decorate([
    (0, common_1.Get)('reviews'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MemoryController.prototype, "getReviewSessions", null);
exports.MemoryController = MemoryController = __decorate([
    (0, common_1.Controller)('memory'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [memory_service_1.MemoryService])
], MemoryController);
//# sourceMappingURL=memory.controller.js.map