import { Test, TestingModule } from '@nestjs/testing';
import { LessonsService } from './lessons.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LessonsService', () => {
  let service: LessonsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    lesson: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    lessonProgress: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LessonsService>(LessonsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all lessons', async () => {
      const mockLessons = [
        {
          id: '1',
          title: 'Lesson 1',
          description: 'First lesson',
          level: 'A0',
          order: 1,
          topics: ['basics'],
          dialogs: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.lesson.findMany.mockResolvedValue(mockLessons);

      const result = await service.findAll();

      expect(result).toEqual(mockLessons);
      expect(prismaService.lesson.findMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a lesson by ID', async () => {
      const mockLesson = {
        id: '1',
        title: 'Lesson 1',
        description: 'First lesson',
        level: 'A0',
        order: 1,
        topics: ['basics'],
        dialogs: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.lesson.findUnique.mockResolvedValue(mockLesson);

      const result = await service.findById('1');

      expect(result).toEqual(mockLesson);
      expect(prismaService.lesson.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('findByLevel', () => {
    it('should return lessons by level', async () => {
      const mockLessons = [
        {
          id: '1',
          title: 'Lesson 1',
          description: 'First lesson',
          level: 'A0',
          order: 1,
          topics: ['basics'],
          dialogs: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.lesson.findMany.mockResolvedValue(mockLessons);

      const result = await service.findByLevel('A0');

      expect(result).toEqual(mockLessons);
      expect(prismaService.lesson.findMany).toHaveBeenCalledWith({
        where: { level: 'A0' },
        orderBy: { order: 'asc' },
      });
    });
  });

  describe('markLessonComplete', () => {
    it('should mark lesson as complete', async () => {
      const mockProgress = {
        id: '1',
        userId: 'user1',
        lessonId: 'lesson1',
        completed: true,
        score: 100,
        completedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.lessonProgress.upsert.mockResolvedValue(mockProgress);

      const result = await service.markLessonComplete('user1', 'lesson1', 100);

      expect(result).toEqual(mockProgress);
      expect(prismaService.lessonProgress.upsert).toHaveBeenCalled();
    });
  });
});
