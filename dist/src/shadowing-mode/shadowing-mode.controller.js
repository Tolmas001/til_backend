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
exports.ShadowingModeController = void 0;
const common_1 = require("@nestjs/common");
const shadowing_mode_service_1 = require("./shadowing-mode.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ShadowingModeController = class ShadowingModeController {
    constructor(shadowingModeService) {
        this.shadowingModeService = shadowingModeService;
    }
    async createShadowingSession(req, body) {
        return this.shadowingModeService.createShadowingSession(req.user.id, body.level, body.topic);
    }
    async submitRecording(req, body) {
        return this.shadowingModeService.submitRecording(req.user.id, body.sessionId, body.phraseId, body.audioUrl);
    }
    async completeSession(req, body) {
        return this.shadowingModeService.completeSession(req.user.id, body.sessionId);
    }
    async getSession(sessionId) {
        return this.shadowingModeService.getSession(sessionId);
    }
    async getUserSessions(req, body) {
        return this.shadowingModeService.getUserSessions(req.user.id, body.limit || 20);
    }
    async getSessionStats() {
        return this.shadowingModeService.getSessionStats();
    }
};
exports.ShadowingModeController = ShadowingModeController;
__decorate([
    (0, common_1.Post)('session'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ShadowingModeController.prototype, "createShadowingSession", null);
__decorate([
    (0, common_1.Post)('recording'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ShadowingModeController.prototype, "submitRecording", null);
__decorate([
    (0, common_1.Post)('complete'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ShadowingModeController.prototype, "completeSession", null);
__decorate([
    (0, common_1.Get)('session/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ShadowingModeController.prototype, "getSession", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ShadowingModeController.prototype, "getUserSessions", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ShadowingModeController.prototype, "getSessionStats", null);
exports.ShadowingModeController = ShadowingModeController = __decorate([
    (0, common_1.Controller)('shadowing-mode'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [shadowing_mode_service_1.ShadowingModeService])
], ShadowingModeController);
//# sourceMappingURL=shadowing-mode.controller.js.map