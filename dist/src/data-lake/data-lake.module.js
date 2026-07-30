"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLakeModule = void 0;
const common_1 = require("@nestjs/common");
const data_lake_service_1 = require("./data-lake.service");
const data_lake_controller_1 = require("./data-lake.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let DataLakeModule = class DataLakeModule {
};
exports.DataLakeModule = DataLakeModule;
exports.DataLakeModule = DataLakeModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [data_lake_controller_1.DataLakeController],
        providers: [data_lake_service_1.DataLakeService],
        exports: [data_lake_service_1.DataLakeService],
    })
], DataLakeModule);
//# sourceMappingURL=data-lake.module.js.map