import { Test, TestingModule } from '@nestjs/testing';
import { GamificationService } from './gamification.service';
import { PrismaService } from '../prisma/prisma.service';

describe('GamificationService', () => {
  let service: GamificationService;
  let prismaService: PrismaService;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GamificationService>(GamificationService);
    prismaService = module.get<PrismaService>(PrismaService);
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
