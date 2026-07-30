"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiMentorModule = void 0;
const common_1 = require("@nestjs/common");
const ai_mentor_service_1 = require("./ai-mentor.service");
const ai_mentor_controller_1 = require("./ai-mentor.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const config_1 = require("@nestjs/config");
let AiMentorModule = class AiMentorModule {
};
exports.AiMentorModule = AiMentorModule;
exports.AiMentorModule = AiMentorModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, config_1.ConfigModule],
        controllers: [ai_mentor_controller_1.AiMentorController],
        providers: [ai_mentor_service_1.AiMentorService],
        exports: [ai_mentor_service_1.AiMentorService],
    })
], AiMentorModule);
//# sourceMappingURL=ai-mentor.module.js.map