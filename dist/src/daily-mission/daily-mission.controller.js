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
exports.DailyMissionController = void 0;
const common_1 = require("@nestjs/common");
const daily_mission_service_1 = require("./daily-mission.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let DailyMissionController = class DailyMissionController {
    constructor(dailyMissionService) {
        this.dailyMissionService = dailyMissionService;
    }
    async generateDailyMission(req) {
        return this.dailyMissionService.generateDailyMission(req.user.id);
    }
    async getTodayMission(req) {
        return this.dailyMissionService.getTodayMission(req.user.id);
    }
    async completeMission(req, id, body) {
        return this.dailyMissionService.completeMission(req.user.id, id, body.score);
    }
    async getMissionHistory(req, body) {
        return this.dailyMissionService.getMissionHistory(req.user.id, body.limit || 30);
    }
    async getMissionStats(req) {
        return this.dailyMissionService.getMissionStats(req.user.id);
    }
};
exports.DailyMissionController = DailyMissionController;
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DailyMissionController.prototype, "generateDailyMission", null);
__decorate([
    (0, common_1.Get)('today'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DailyMissionController.prototype, "getTodayMission", null);
__decorate([
    (0, common_1.Put)(':id/complete'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DailyMissionController.prototype, "completeMission", null);
__decorate([
    (0, common_1.Get)('history'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DailyMissionController.prototype, "getMissionHistory", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DailyMissionController.prototype, "getMissionStats", null);
exports.DailyMissionController = DailyMissionController = __decorate([
    (0, common_1.Controller)('daily-mission'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [daily_mission_service_1.DailyMissionService])
], DailyMissionController);
//# sourceMappingURL=daily-mission.controller.js.map