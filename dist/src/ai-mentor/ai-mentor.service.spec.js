"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const ai_mentor_service_1 = require("./ai-mentor.service");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
describe('AiMentorService', () => {
    let service;
    let prismaService;
    const mockPrismaService = {
        mentorMessage: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        timelineEvent: {
            create: jest.fn(),
        },
    };
    const mockConfigService = {
        get: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                ai_mentor_service_1.AiMentorService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: config_1.ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();
        service = module.get(ai_mentor_service_1.AiMentorService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('generateProactiveMessage', () => {
        it('should generate a proactive coaching message', async () => {
            const mockMessage = {
                id: '1',
                userId: 'user1',
                type: 'proactive',
                content: 'Keep up the good work!',
                priority: 5,
                read: false,
                actionTaken: false,
                createdAt: new Date(),
            };
            mockPrismaService.mentorMessage.create.mockResolvedValue(mockMessage);
            const result = await service.generateProactiveMessage('user1');
            expect(result).toBeDefined();
            expect(prismaService.mentorMessage.create).toHaveBeenCalled();
        });
    });
    describe('getUserMessages', () => {
        it('should return user mentor messages', async () => {
            const mockMessages = [
                {
                    id: '1',
                    userId: 'user1',
                    type: 'proactive',
                    content: 'Message 1',
                    priority: 5,
                    read: false,
                    actionTaken: false,
                    createdAt: new Date(),
                },
            ];
            mockPrismaService.mentorMessage.findMany.mockResolvedValue(mockMessages);
            const result = await service.getMentorMessages('user1');
            expect(result).toEqual(mockMessages);
            expect(prismaService.mentorMessage.findMany).toHaveBeenCalledWith({
                where: { userId: 'user1' },
                orderBy: { createdAt: 'desc' },
            });
        });
    });
    describe('markMessageAsRead', () => {
        it('should mark message as read', async () => {
            const mockMessage = {
                id: '1',
                userId: 'user1',
                type: 'proactive',
                content: 'Message 1',
                priority: 5,
                read: true,
                actionTaken: false,
                createdAt: new Date(),
            };
            mockPrismaService.mentorMessage.update.mockResolvedValue(mockMessage);
            const result = await service.markMessageAsRead('1');
            expect(result).toEqual(mockMessage);
            expect(prismaService.mentorMessage.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: { read: true },
            });
        });
    });
});
//# sourceMappingURL=ai-mentor.service.spec.js.map