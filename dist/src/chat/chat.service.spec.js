"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const chat_service_1 = require("./chat.service");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
describe('ChatService', () => {
    let service;
    let prismaService;
    const mockPrismaService = {
        chat: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        chatMessage: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    };
    const mockConfigService = {
        get: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                chat_service_1.ChatService,
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
        service = module.get(chat_service_1.ChatService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('getUserChats', () => {
        it('should return user chats', async () => {
            const mockChats = [
                {
                    id: '1',
                    userId: 'user1',
                    title: 'Chat 1',
                    aiCharacter: 'teacher',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
            mockPrismaService.chat.findMany.mockResolvedValue(mockChats);
            const result = await service.getUserChats('user1');
            expect(result).toEqual(mockChats);
            expect(prismaService.chat.findMany).toHaveBeenCalledWith({
                where: { userId: 'user1' },
                orderBy: { updatedAt: 'desc' },
            });
        });
    });
    describe('createChat', () => {
        it('should create a new chat', async () => {
            const mockChat = {
                id: '1',
                userId: 'user1',
                title: 'New Chat',
                aiCharacter: 'teacher',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.chat.create.mockResolvedValue(mockChat);
            const result = await service.createChat('user1', 'New Chat', 'teacher');
            expect(result).toEqual(mockChat);
            expect(prismaService.chat.create).toHaveBeenCalledWith({
                data: {
                    userId: 'user1',
                    title: 'New Chat',
                    aiCharacter: 'teacher',
                },
            });
        });
    });
    describe('sendMessage', () => {
        it('should send a message', async () => {
            const mockMessage = {
                id: '1',
                chatId: 'chat1',
                userId: 'user1',
                role: 'user',
                content: 'Hello',
                audioUrl: null,
                corrections: null,
                createdAt: new Date(),
            };
            mockPrismaService.chatMessage.create.mockResolvedValue(mockMessage);
            const result = await service.sendMessage('user1', 'chat1', 'Hello');
            expect(result).toEqual(mockMessage);
            expect(prismaService.chatMessage.create).toHaveBeenCalledWith({
                data: {
                    chatId: 'chat1',
                    userId: 'user1',
                    role: 'user',
                    content: 'Hello',
                },
            });
        });
    });
    describe('getChatMessages', () => {
        it('should return chat messages', async () => {
            const mockMessages = [
                {
                    id: '1',
                    chatId: 'chat1',
                    userId: 'user1',
                    role: 'user',
                    content: 'Hello',
                    audioUrl: null,
                    corrections: null,
                    createdAt: new Date(),
                },
            ];
            mockPrismaService.chatMessage.findMany.mockResolvedValue(mockMessages);
            const result = await service.getChat('chat1', 'user1');
            expect(result).toEqual(mockMessages);
            expect(prismaService.chatMessage.findMany).toHaveBeenCalledWith({
                where: { chatId: 'chat1' },
                orderBy: { createdAt: 'asc' },
            });
        });
    });
});
//# sourceMappingURL=chat.service.spec.js.map