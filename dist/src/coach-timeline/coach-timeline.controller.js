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
exports.CoachTimelineController = void 0;
const common_1 = require("@nestjs/common");
const coach_timeline_service_1 = require("./coach-timeline.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CoachTimelineController = class CoachTimelineController {
    constructor(coachTimelineService) {
        this.coachTimelineService = coachTimelineService;
    }
    async createTimelineEvent(req, body) {
        return this.coachTimelineService.createTimelineEvent(req.user.id, body.eventType, body.description, body.metadata);
    }
    async logMilestone(req, body) {
        return this.coachTimelineService.logMilestone(req.user.id, body.milestone, body.details);
    }
    async logStreak(req, body) {
        return this.coachTimelineService.logStreak(req.user.id, body.streak, body.details);
    }
    async logImprovement(req, body) {
        return this.coachTimelineService.logImprovement(req.user.id, body.skill, body.improvement, body.details);
    }
    async logSetback(req, body) {
        return this.coachTimelineService.logSetback(req.user.id, body.reason, body.details);
    }
    async getUserTimeline(req, body) {
        return this.coachTimelineService.getUserTimeline(req.user.id, body.limit || 50);
    }
    async getUserTimelineByDateRange(req, body) {
        return this.coachTimelineService.getUserTimelineByDateRange(req.user.id, new Date(body.startDate), new Date(body.endDate));
    }
    async getTimelineByEventType(req, eventType) {
        return this.coachTimelineService.getTimelineByEventType(req.user.id, eventType);
    }
    async analyzeProgress(req, body) {
        return this.coachTimelineService.analyzeProgress(req.user.id, body.days || 30);
    }
    async generateWeeklyReport(req) {
        return this.coachTimelineService.generateWeeklyReport(req.user.id);
    }
    async getTimelineStats() {
        return this.coachTimelineService.getTimelineStats();
    }
    async deleteOldEvents(body) {
        return this.coachTimelineService.deleteOldEvents(body.daysToKeep || 180);
    }
};
exports.CoachTimelineController = CoachTimelineController;
__decorate([
    (0, common_1.Post)('event'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CoachTimelineController.prototype, "createTimelineEvent", null);
__decorate([
    (0, common_1.Post)('milestone'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CoachTimelineController.prototype, "logMilestone", null);
__decorate([
    (0, common_1.Post)('streak'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CoachTimelineController.prototype, "logStreak", null);
__decorate([
    (0, common_1.Post)('improvement'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CoachTimelineController.prototype, "logImprovement", null);
__decorate([
    (0, common_1.Post)('setback'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CoachTimelineController.prototype, "logSetback", null);
__decorate([
    (0, common_1.Get)('timeline'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CoachTimelineController.prototype, "getUserTimeline", null);
__decorate([
    (0, common_1.Post)('timeline/range'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CoachTimelineController.prototype, "getUserTimelineByDateRange", null);
__decorate([
    (0, common_1.Get)('timeline/:eventType'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CoachTimelineController.prototype, "getTimelineByEventType", null);
__decorate([
    (0, common_1.Get)('analysis'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CoachTimelineController.prototype, "analyzeProgress", null);
__decorate([
    (0, common_1.Get)('weekly-report'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoachTimelineController.prototype, "generateWeeklyReport", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CoachTimelineController.prototype, "getTimelineStats", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CoachTimelineController.prototype, "deleteOldEvents", null);
exports.CoachTimelineController = CoachTimelineController = __decorate([
    (0, common_1.Controller)('coach-timeline'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [coach_timeline_service_1.CoachTimelineService])
], CoachTimelineController);
//# sourceMappingURL=coach-timeline.controller.js.map