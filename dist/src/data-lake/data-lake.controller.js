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
exports.DataLakeController = void 0;
const common_1 = require("@nestjs/common");
const data_lake_service_1 = require("./data-lake.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let DataLakeController = class DataLakeController {
    constructor(dataLakeService) {
        this.dataLakeService = dataLakeService;
    }
    async logEvent(req, body) {
        return this.dataLakeService.logEvent(req.user.id, body.eventType, body.metadata, body.sessionId, body.deviceInfo);
    }
    async getUserEvents(req, body) {
        return this.dataLakeService.getUserEvents(req.user.id, body.eventType, body.limit || 100);
    }
    async getUserEventsByDateRange(req, body) {
        return this.dataLakeService.getUserEventsByDateRange(req.user.id, new Date(body.startDate), new Date(body.endDate));
    }
    async getEventTypeStats(req) {
        return this.dataLakeService.getEventTypeStats(req.user.id);
    }
    async getDailyActivity(req, body) {
        return this.dataLakeService.getDailyActivity(req.user.id, body.days || 30);
    }
    async getSessionEvents(sessionId) {
        return this.dataLakeService.getSessionEvents(sessionId);
    }
    async getGlobalStats() {
        return this.dataLakeService.getGlobalStats();
    }
    async deleteOldEvents(body) {
        return this.dataLakeService.deleteOldEvents(body.daysToKeep || 90);
    }
};
exports.DataLakeController = DataLakeController;
__decorate([
    (0, common_1.Post)('log'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DataLakeController.prototype, "logEvent", null);
__decorate([
    (0, common_1.Get)('events'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DataLakeController.prototype, "getUserEvents", null);
__decorate([
    (0, common_1.Post)('events/range'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DataLakeController.prototype, "getUserEventsByDateRange", null);
__decorate([
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataLakeController.prototype, "getEventTypeStats", null);
__decorate([
    (0, common_1.Get)('daily-activity'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DataLakeController.prototype, "getDailyActivity", null);
__decorate([
    (0, common_1.Get)('session/:sessionId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DataLakeController.prototype, "getSessionEvents", null);
__decorate([
    (0, common_1.Get)('global-stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DataLakeController.prototype, "getGlobalStats", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DataLakeController.prototype, "deleteOldEvents", null);
exports.DataLakeController = DataLakeController = __decorate([
    (0, common_1.Controller)('data-lake'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [data_lake_service_1.DataLakeService])
], DataLakeController);
//# sourceMappingURL=data-lake.controller.js.map