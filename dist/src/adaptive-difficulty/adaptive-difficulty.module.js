"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptiveDifficultyModule = void 0;
const common_1 = require("@nestjs/common");
const adaptive_difficulty_service_1 = require("./adaptive-difficulty.service");
const adaptive_difficulty_controller_1 = require("./adaptive-difficulty.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let AdaptiveDifficultyModule = class AdaptiveDifficultyModule {
};
exports.AdaptiveDifficultyModule = AdaptiveDifficultyModule;
exports.AdaptiveDifficultyModule = AdaptiveDifficultyModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [adaptive_difficulty_controller_1.AdaptiveDifficultyController],
        providers: [adaptive_difficulty_service_1.AdaptiveDifficultyService],
        exports: [adaptive_difficulty_service_1.AdaptiveDifficultyService],
    })
], AdaptiveDifficultyModule);
//# sourceMappingURL=adaptive-difficulty.module.js.map