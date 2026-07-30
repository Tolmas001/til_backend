"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChurnPredictionModule = void 0;
const common_1 = require("@nestjs/common");
const churn_prediction_service_1 = require("./churn-prediction.service");
const churn_prediction_controller_1 = require("./churn-prediction.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const config_1 = require("@nestjs/config");
let ChurnPredictionModule = class ChurnPredictionModule {
};
exports.ChurnPredictionModule = ChurnPredictionModule;
exports.ChurnPredictionModule = ChurnPredictionModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, config_1.ConfigModule],
        controllers: [churn_prediction_controller_1.ChurnPredictionController],
        providers: [churn_prediction_service_1.ChurnPredictionService],
        exports: [churn_prediction_service_1.ChurnPredictionService],
    })
], ChurnPredictionModule);
//# sourceMappingURL=churn-prediction.module.js.map