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
exports.ScenarioController = void 0;
const common_1 = require("@nestjs/common");
const scenario_service_1 = require("./scenario.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ScenarioController = class ScenarioController {
    constructor(scenarioService) {
        this.scenarioService = scenarioService;
    }
    async generateScenario(req, body) {
        return this.scenarioService.generateScenario(req.user.id, body.context, body.level);
    }
    async startScenario(req, id) {
        return this.scenarioService.startScenario(req.user.id, id);
    }
    async submitResponse(req, id, body) {
        return this.scenarioService.submitScenarioResponse(req.user.id, id, body.response, body.currentEvent);
    }
    async completeScenario(req, id, body) {
        return this.scenarioService.completeScenario(req.user.id, id, body.finalScore);
    }
    async getAvailableScenarios(req, body) {
        return this.scenarioService.getAvailableScenarios(body.level, body.context);
    }
    async getUserProgress(req) {
        return this.scenarioService.getUserScenarioProgress(req.user.id);
    }
};
exports.ScenarioController = ScenarioController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScenarioController.prototype, "generateScenario", null);
__decorate([
    (0, common_1.Post)(':id/start'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ScenarioController.prototype, "startScenario", null);
__decorate([
    (0, common_1.Post)(':id/respond'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ScenarioController.prototype, "submitResponse", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ScenarioController.prototype, "completeScenario", null);
__decorate([
    (0, common_1.Get)('available'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScenarioController.prototype, "getAvailableScenarios", null);
__decorate([
    (0, common_1.Get)('progress'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScenarioController.prototype, "getUserProgress", null);
exports.ScenarioController = ScenarioController = __decorate([
    (0, common_1.Controller)('scenario'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [scenario_service_1.ScenarioService])
], ScenarioController);
//# sourceMappingURL=scenario.controller.js.map