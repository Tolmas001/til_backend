"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyMissionModule = void 0;
const common_1 = require("@nestjs/common");
const daily_mission_service_1 = require("./daily-mission.service");
const daily_mission_controller_1 = require("./daily-mission.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const config_1 = require("@nestjs/config");
let DailyMissionModule = class DailyMissionModule {
};
exports.DailyMissionModule = DailyMissionModule;
exports.DailyMissionModule = DailyMissionModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, config_1.ConfigModule],
        controllers: [daily_mission_controller_1.DailyMissionController],
        providers: [daily_mission_service_1.DailyMissionService],
        exports: [daily_mission_service_1.DailyMissionService],
    })
], DailyMissionModule);
//# sourceMappingURL=daily-mission.module.js.map