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
exports.AdaptiveDifficultyController = void 0;
const common_1 = require("@nestjs/common");
const adaptive_difficulty_service_1 = require("./adaptive-difficulty.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let AdaptiveDifficultyController = class AdaptiveDifficultyController {
    constructor(adaptiveDifficultyService) {
        this.adaptiveDifficultyService = adaptiveDifficultyService;
    }
    async recordAnswer(req, body) {
        return this.adaptiveDifficultyService.recordAnswer(req.user.id, body.isCorrect);
    }
    async getUserDifficulty(req) {
        return this.adaptiveDifficultyService.getUserDifficulty(req.user.id);
    }
    async resetUserDifficulty(req) {
        return this.adaptiveDifficultyService.resetUserDifficulty(req.user.id);
    }
    async getDifficultyStats(req) {
        return this.adaptiveDifficultyService.getDifficultyStats(req.user.id);
    }
};
exports.AdaptiveDifficultyController = AdaptiveDifficultyController;
__decorate([
    (0, common_1.Post)('answer'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AdaptiveDifficultyController.prototype, "recordAnswer", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdaptiveDifficultyController.prototype, "getUserDifficulty", null);
__decorate([
    (0, common_1.Post)('reset'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdaptiveDifficultyController.prototype, "resetUserDifficulty", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdaptiveDifficultyController.prototype, "getDifficultyStats", null);
exports.AdaptiveDifficultyController = AdaptiveDifficultyController = __decorate([
    (0, common_1.Controller)('adaptive-difficulty'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [adaptive_difficulty_service_1.AdaptiveDifficultyService])
], AdaptiveDifficultyController);
//# sourceMappingURL=adaptive-difficulty.controller.js.map