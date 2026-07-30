"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SentryModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryModule = void 0;
const common_1 = require("@nestjs/common");
const Sentry = require("@sentry/node");
const profiling_node_1 = require("@sentry/profiling-node");
const config_1 = require("@nestjs/config");
let SentryModule = SentryModule_1 = class SentryModule {
    static forRoot() {
        return {
            module: SentryModule_1,
            providers: [
                {
                    provide: 'SENTRY_INIT',
                    useFactory: (configService) => {
                        const dsn = configService.get('SENTRY_DSN');
                        if (dsn && dsn !== 'your-sentry-dsn') {
                            Sentry.init({
                                dsn,
                                integrations: [
                                    (0, profiling_node_1.nodeProfilingIntegration)(),
                                ],
                                tracesSampleRate: 1.0,
                                profilesSampleRate: 1.0,
                                environment: configService.get('NODE_ENV') || 'development',
                            });
                            console.log('Sentry initialized');
                        }
                        else {
                            console.log('Sentry not initialized - DSN not provided');
                        }
                    },
                    inject: [config_1.ConfigService],
                },
            ],
            global: true,
        };
    }
};
exports.SentryModule = SentryModule;
exports.SentryModule = SentryModule = SentryModule_1 = __decorate([
    (0, common_1.Module)({})
], SentryModule);
//# sourceMappingURL=sentry.module.js.map