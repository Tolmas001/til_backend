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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProgressService = class ProgressService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserProgress(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                lessons: {
                    include: { lesson: true },
                },
                storyProgress: {
                    include: { location: true },
                },
                vocabulary: {
                    include: { vocabulary: true },
                },
            },
        });
        if (!user) {
            return null;
        }
        const completedLessonsCount = user.lessons.filter((l) => l.completed).length;
        const totalLessons = await this.prisma.lesson.count();
        const vocabularyMasteredCount = user.vocabulary.filter((v) => v.mastered).length;
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                level: user.level,
                xp: user.xp,
                coins: user.coins,
                streak: user.streak,
                lastActiveAt: user.lastActiveAt,
            },
            stats: {
                completedLessonsCount,
                totalLessons,
                completionPercentage: totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0,
                vocabularyMasteredCount,
            },
            recentLessons: user.lessons.slice(0, 5),
        };
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map