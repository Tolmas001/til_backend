"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiInterviewModule = void 0;
const common_1 = require("@nestjs/common");
const ai_interview_service_1 = require("./ai-interview.service");
const ai_interview_controller_1 = require("./ai-interview.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const config_1 = require("@nestjs/config");
let AiInterviewModule = class AiInterviewModule {
};
exports.AiInterviewModule = AiInterviewModule;
exports.AiInterviewModule = AiInterviewModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, config_1.ConfigModule],
        controllers: [ai_interview_controller_1.AiInterviewController],
        providers: [ai_interview_service_1.AiInterviewService],
        exports: [ai_interview_service_1.AiInterviewService],
    })
], AiInterviewModule);
//# sourceMappingURL=ai-interview.module.js.map