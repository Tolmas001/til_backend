"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowingModeModule = void 0;
const common_1 = require("@nestjs/common");
const shadowing_mode_service_1 = require("./shadowing-mode.service");
const shadowing_mode_controller_1 = require("./shadowing-mode.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const config_1 = require("@nestjs/config");
let ShadowingModeModule = class ShadowingModeModule {
};
exports.ShadowingModeModule = ShadowingModeModule;
exports.ShadowingModeModule = ShadowingModeModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, config_1.ConfigModule],
        controllers: [shadowing_mode_controller_1.ShadowingModeController],
        providers: [shadowing_mode_service_1.ShadowingModeService],
        exports: [shadowing_mode_service_1.ShadowingModeService],
    })
], ShadowingModeModule);
//# sourceMappingURL=shadowing-mode.module.js.map