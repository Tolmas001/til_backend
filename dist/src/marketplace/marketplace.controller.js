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
exports.MarketplaceController = void 0;
const common_1 = require("@nestjs/common");
const marketplace_service_1 = require("./marketplace.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let MarketplaceController = class MarketplaceController {
    constructor(marketplaceService) {
        this.marketplaceService = marketplaceService;
    }
    async createContent(req, body) {
        return this.marketplaceService.createContent(req.user.id, body.title, body.description, body.content, body.price, body.category);
    }
    async updateContent(contentId, body) {
        return this.marketplaceService.updateContent(contentId, body);
    }
    async deleteContent(contentId) {
        return this.marketplaceService.deleteContent(contentId);
    }
    async getContent(contentId) {
        return this.marketplaceService.getContent(contentId);
    }
    async getAllContent(body) {
        return this.marketplaceService.getAllContent(body);
    }
    async getTeacherContent(req) {
        return this.marketplaceService.getTeacherContent(req.user.id);
    }
    async purchaseContent(req, contentId) {
        return this.marketplaceService.purchaseContent(req.user.id, contentId);
    }
    async getUserPurchases(req) {
        return this.marketplaceService.getUserPurchases(req.user.id);
    }
    async approveContent(contentId) {
        return this.marketplaceService.approveContent(contentId);
    }
    async rejectContent(contentId, body) {
        return this.marketplaceService.rejectContent(contentId, body.reason);
    }
    async getTeacherEarnings(req) {
        return this.marketplaceService.getTeacherEarnings(req.user.id);
    }
    async getMarketplaceStats() {
        return this.marketplaceService.getMarketplaceStats();
    }
};
exports.MarketplaceController = MarketplaceController;
__decorate([
    (0, common_1.Post)('content'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "createContent", null);
__decorate([
    (0, common_1.Put)('content/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "updateContent", null);
__decorate([
    (0, common_1.Delete)('content/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "deleteContent", null);
__decorate([
    (0, common_1.Get)('content/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getContent", null);
__decorate([
    (0, common_1.Get)('content'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getAllContent", null);
__decorate([
    (0, common_1.Get)('my-content'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getTeacherContent", null);
__decorate([
    (0, common_1.Post)('purchase/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "purchaseContent", null);
__decorate([
    (0, common_1.Get)('my-purchases'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getUserPurchases", null);
__decorate([
    (0, common_1.Post)('approve/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "approveContent", null);
__decorate([
    (0, common_1.Post)('reject/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "rejectContent", null);
__decorate([
    (0, common_1.Get)('earnings'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getTeacherEarnings", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getMarketplaceStats", null);
exports.MarketplaceController = MarketplaceController = __decorate([
    (0, common_1.Controller)('marketplace'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [marketplace_service_1.MarketplaceService])
], MarketplaceController);
//# sourceMappingURL=marketplace.controller.js.map