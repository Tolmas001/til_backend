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
exports.CertificationController = void 0;
const common_1 = require("@nestjs/common");
const certification_service_1 = require("./certification.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CertificationController = class CertificationController {
    constructor(certificationService) {
        this.certificationService = certificationService;
    }
    async generateExam(req, body) {
        return this.certificationService.generateExam(req.user.id, body.targetLevel);
    }
    async submitExam(req, body) {
        return this.certificationService.submitExam(req.user.id, body.answers);
    }
    async getUserCertifications(req) {
        return this.certificationService.getUserCertifications(req.user.id);
    }
    async generateCertificate(req, id) {
        return this.certificationService.generateCertificate(req.user.id, id);
    }
};
exports.CertificationController = CertificationController;
__decorate([
    (0, common_1.Post)('exam/generate'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "generateExam", null);
__decorate([
    (0, common_1.Post)('exam/submit'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "submitExam", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "getUserCertifications", null);
__decorate([
    (0, common_1.Post)(':id/certificate'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CertificationController.prototype, "generateCertificate", null);
exports.CertificationController = CertificationController = __decorate([
    (0, common_1.Controller)('certification'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [certification_service_1.CertificationService])
], CertificationController);
//# sourceMappingURL=certification.controller.js.map