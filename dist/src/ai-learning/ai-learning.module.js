"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiLearningModule = void 0;
const common_1 = require("@nestjs/common");
const ai_learning_service_1 = require("./ai-learning.service");
const ai_learning_controller_1 = require("./ai-learning.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const config_1 = require("@nestjs/config");
let AiLearningModule = class AiLearningModule {
};
exports.AiLearningModule = AiLearningModule;
exports.AiLearningModule = AiLearningModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, config_1.ConfigModule],
        controllers: [ai_learning_controller_1.AiLearningController],
        providers: [ai_learning_service_1.AiLearningService],
        exports: [ai_learning_service_1.AiLearningService],
    })
], AiLearningModule);
//# sourceMappingURL=ai-learning.module.js.map