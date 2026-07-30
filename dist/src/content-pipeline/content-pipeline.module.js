"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentPipelineModule = void 0;
const common_1 = require("@nestjs/common");
const content_pipeline_service_1 = require("./content-pipeline.service");
const content_pipeline_controller_1 = require("./content-pipeline.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const config_1 = require("@nestjs/config");
let ContentPipelineModule = class ContentPipelineModule {
};
exports.ContentPipelineModule = ContentPipelineModule;
exports.ContentPipelineModule = ContentPipelineModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, config_1.ConfigModule],
        controllers: [content_pipeline_controller_1.ContentPipelineController],
        providers: [content_pipeline_service_1.ContentPipelineService],
        exports: [content_pipeline_service_1.ContentPipelineService],
    })
], ContentPipelineModule);
//# sourceMappingURL=content-pipeline.module.js.map