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
exports.StudyPlannerController = void 0;
const common_1 = require("@nestjs/common");
const study_planner_service_1 = require("./study-planner.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StudyPlannerController = class StudyPlannerController {
    constructor(studyPlannerService) {
        this.studyPlannerService = studyPlannerService;
    }
    async createStudyPlan(req, body) {
        return this.studyPlannerService.createStudyPlan(req.user.id, body.goal, body.targetDate);
    }
    async getStudyPlan(req) {
        return this.studyPlannerService.getStudyPlan(req.user.id);
    }
    async updateProgress(req, id, body) {
        return this.studyPlannerService.updateStudyProgress(req.user.id, id, body.progress);
    }
    async recalculatePlan(req, id) {
        return this.studyPlannerService.recalculatePlan(req.user.id, id);
    }
};
exports.StudyPlannerController = StudyPlannerController;
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StudyPlannerController.prototype, "createStudyPlan", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StudyPlannerController.prototype, "getStudyPlan", null);
__decorate([
    (0, common_1.Put)(':id/progress'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], StudyPlannerController.prototype, "updateProgress", null);
__decorate([
    (0, common_1.Put)(':id/recalculate'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StudyPlannerController.prototype, "recalculatePlan", null);
exports.StudyPlannerController = StudyPlannerController = __decorate([
    (0, common_1.Controller)('study-planner'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [study_planner_service_1.StudyPlannerService])
], StudyPlannerController);
//# sourceMappingURL=study-planner.controller.js.map