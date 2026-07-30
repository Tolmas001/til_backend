"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const gamification_service_1 = require("./gamification.service");
const prisma_service_1 = require("../prisma/prisma.service");
describe('GamificationService', () => {
    let service;
    let prismaService;
    const mockPrismaService = {
        userAchievement: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        achievement: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
        },
        userDailyQuest: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        dailyQuest: {
            findMany: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                gamification_service_1.GamificationService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(gamification_service_1.GamificationService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('getUserAchievements', () => {
        it('should return user achievements', async () => {
            const mockAchievements = [
                {
                    id: '1',
                    userId: 'user1',
                    achievementId: 'ach1',
                    unlocked: true,
                    unlockedAt: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            mockPrismaService.userAchievement.findMany.mockResolvedValue(mockAchievements);
            const result = await service.getAchievements('user1');
            expect(result).toEqual(mockAchievements);
            expect(prismaService.userAchievement.findMany).toHaveBeenCalledWith({
                where: { userId: 'user1' },
                include: { achievement: true },
            });
        });
    });
    describe('getDailyQuests', () => {
        it('should return daily quests for user', async () => {
            const mockQuests = [
                {
                    id: '1',
                    userId: 'user1',
                    questId: 'quest1',
                    date: new Date(),
                    progress: 5,
                    completed: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            mockPrismaService.userDailyQuest.findMany.mockResolvedValue(mockQuests);
            const result = await service.getDailyQuests('user1');
            expect(result).toEqual(mockQuests);
            expect(prismaService.userDailyQuest.findMany).toHaveBeenCalledWith({
                where: { userId: 'user1' },
                include: { quest: true },
            });
        });
    });
});
//# sourceMappingURL=gamification.service.spec.js.map