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
exports.PlacementTestController = void 0;
const common_1 = require("@nestjs/common");
const placement_test_service_1 = require("./placement-test.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PlacementTestController = class PlacementTestController {
    constructor(placementTestService) {
        this.placementTestService = placementTestService;
    }
    async generatePlacementTest(req) {
        return this.placementTestService.generatePlacementTest(req.user.id);
    }
    async submitPlacementTest(req, body) {
        return this.placementTestService.submitPlacementTest(req.user.id, body);
    }
    async getPlacementTestResult(req) {
        return this.placementTestService.getPlacementTestResult(req.user.id);
    }
    async retakePlacementTest(req) {
        return this.placementTestService.retakePlacementTest(req.user.id);
    }
};
exports.PlacementTestController = PlacementTestController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlacementTestController.prototype, "generatePlacementTest", null);
__decorate([
    (0, common_1.Post)('submit'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlacementTestController.prototype, "submitPlacementTest", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlacementTestController.prototype, "getPlacementTestResult", null);
__decorate([
    (0, common_1.Post)('retake'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlacementTestController.prototype, "retakePlacementTest", null);
exports.PlacementTestController = PlacementTestController = __decorate([
    (0, common_1.Controller)('placement-test'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [placement_test_service_1.PlacementTestService])
], PlacementTestController);
//# sourceMappingURL=placement-test.controller.js.map