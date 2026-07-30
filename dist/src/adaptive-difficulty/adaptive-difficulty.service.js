"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AdaptiveDifficultyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptiveDifficultyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdaptiveDifficultyService = AdaptiveDifficultyService_1 = class AdaptiveDifficultyService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(AdaptiveDifficultyService_1.name);
    }
    async recordAnswer(userId, isCorrect) {
        const userDifficulty = await this.prisma.userDifficulty.findUnique({
            where: { userId },
        });
        if (!userDifficulty) {
            return this.prisma.userDifficulty.create({
                data: {
                    userId,
                    currentDifficulty: 'medium',
                    consecutiveCorrect: isCorrect ? 1 : 0,
                    consecutiveWrong: isCorrect ? 0 : 1,
                    lastAdjustedAt: new Date(),
                },
            });
        }
        const updateData = {
            lastAdjustedAt: new Date(),
        };
        if (isCorrect) {
            updateData.consecutiveCorrect = userDifficulty.consecutiveCorrect + 1;
            updateData.consecutiveWrong = 0;
            if (userDifficulty.consecutiveCorrect + 1 >= 10) {
                updateData.currentDifficulty = this.increaseDifficulty(userDifficulty.currentDifficulty);
                updateData.consecutiveCorrect = 0;
            }
        }
        else {
            updateData.consecutiveWrong = userDifficulty.consecutiveWrong + 1;
            updateData.consecutiveCorrect = 0;
            if (userDifficulty.consecutiveWrong + 1 >= 3) {
                updateData.currentDifficulty = this.decreaseDifficulty(userDifficulty.currentDifficulty);
                updateData.consecutiveWrong = 0;
            }
        }
        const updated = await this.prisma.userDifficulty.update({
            where: { userId },
            data: updateData,
        });
        await this.prisma.learningEvent.create({
            data: {
                userId,
                eventType: 'difficulty_adjusted',
                metadata: {
                    isCorrect,
                    newDifficulty: updated.currentDifficulty,
                    consecutiveCorrect: updated.consecutiveCorrect,
                    consecutiveWrong: updated.consecutiveWrong,
                },
            },
        });
        return updated;
    }
    increaseDifficulty(current) {
        const levels = ['easy', 'medium', 'hard', 'native'];
        const currentIndex = levels.indexOf(current);
        if (currentIndex < levels.length - 1) {
            return levels[currentIndex + 1];
        }
        return current;
    }
    decreaseDifficulty(current) {
        const levels = ['easy', 'medium', 'hard', 'native'];
        const currentIndex = levels.indexOf(current);
        if (currentIndex > 0) {
            return levels[currentIndex - 1];
        }
        return current;
    }
    async getUserDifficulty(userId) {
        const userDifficulty = await this.prisma.userDifficulty.findUnique({
            where: { userId },
        });
        if (!userDifficulty) {
            return {
                currentDifficulty: 'medium',
                consecutiveCorrect: 0,
                consecutiveWrong: 0,
            };
        }
        return userDifficulty;
    }
    async resetUserDifficulty(userId) {
        return this.prisma.userDifficulty.upsert({
            where: { userId },
            create: {
                userId,
                currentDifficulty: 'medium',
                consecutiveCorrect: 0,
                consecutiveWrong: 0,
                lastAdjustedAt: new Date(),
            },
            update: {
                currentDifficulty: 'medium',
                consecutiveCorrect: 0,
                consecutiveWrong: 0,
                lastAdjustedAt: new Date(),
            },
        });
    }
    async getDifficultyStats(userId) {
        const userDifficulty = await this.prisma.userDifficulty.findUnique({
            where: { userId },
        });
        if (!userDifficulty) {
            return {
                currentDifficulty: 'medium',
                progressToNext: 0,
                progressFromPrevious: 0,
                streak: 0,
            };
        }
        const levels = ['easy', 'medium', 'hard', 'native'];
        const currentIndex = levels.indexOf(userDifficulty.currentDifficulty);
        const progressToNext = userDifficulty.consecutiveCorrect / 10;
        const progressFromPrevious = 1 - (userDifficulty.consecutiveWrong / 3);
        return {
            currentDifficulty: userDifficulty.currentDifficulty,
            progressToNext: Math.min(1, progressToNext),
            progressFromPrevious: Math.max(0, progressFromPrevious),
            streak: userDifficulty.consecutiveCorrect,
            consecutiveWrong: userDifficulty.consecutiveWrong,
        };
    }
};
exports.AdaptiveDifficultyService = AdaptiveDifficultyService;
exports.AdaptiveDifficultyService = AdaptiveDifficultyService = AdaptiveDifficultyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdaptiveDifficultyService);
//# sourceMappingURL=adaptive-difficulty.service.js.map