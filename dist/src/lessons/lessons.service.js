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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LessonsService = class LessonsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(level) {
        return this.prisma.lesson.findMany({
            where: level ? { level } : {},
            orderBy: { order: 'asc' },
        });
    }
    async findOne(id) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
        });
        if (!lesson) {
            throw new common_1.NotFoundException('Lesson not found');
        }
        return lesson;
    }
    async completeLesson(userId, lessonId, score = 100) {
        const lesson = await this.findOne(lessonId);
        const progress = await this.prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId,
                    lessonId,
                },
            },
            update: {
                completed: true,
                score,
                completedAt: new Date(),
            },
            create: {
                userId,
                lessonId,
                completed: true,
                score,
                completedAt: new Date(),
            },
        });
        const xpReward = 50;
        const coinReward = 20;
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                xp: { increment: xpReward },
                coins: { increment: coinReward },
                lastActiveAt: new Date(),
            },
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const activeUserQuests = await this.prisma.userDailyQuest.findMany({
            where: {
                userId,
                date: today,
                completed: false,
            },
            include: { quest: true },
        });
        for (const uq of activeUserQuests) {
            if (uq.quest.type === 'LESSON') {
                const newProgress = uq.progress + 1;
                const isCompleted = newProgress >= uq.quest.target;
                await this.prisma.userDailyQuest.update({
                    where: { id: uq.id },
                    data: {
                        progress: newProgress,
                        completed: isCompleted,
                    },
                });
                if (isCompleted) {
                    await this.prisma.user.update({
                        where: { id: userId },
                        data: {
                            xp: { increment: uq.quest.xpReward },
                            coins: { increment: uq.quest.coinReward },
                        },
                    });
                }
            }
        }
        return {
            progress,
            userStats: {
                xp: user.xp,
                coins: user.coins,
                streak: user.streak,
            },
            rewards: {
                xp: xpReward,
                coins: coinReward,
            },
        };
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map