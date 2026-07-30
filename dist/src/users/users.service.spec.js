"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_service_1 = require("./users.service");
const prisma_service_1 = require("../prisma/prisma.service");
describe('UsersService', () => {
    let service;
    let prismaService;
    const mockPrismaService = {
        user: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                users_service_1.UsersService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();
        service = module.get(users_service_1.UsersService);
        prismaService = module.get(prisma_service_1.PrismaService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('findById', () => {
        it('should return a user by ID', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                name: 'Test User',
                level: 'A0',
                xp: 100,
                coins: 50,
                streak: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            const result = await service.findById('1');
            expect(result).toEqual(mockUser);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
        it('should return null if user not found', async () => {
            mockPrismaService.user.findUnique.mockResolvedValue(null);
            const result = await service.findById('nonexistent');
            expect(result).toBeNull();
        });
    });
    describe('findByEmail', () => {
        it('should return a user by email', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                name: 'Test User',
                level: 'A0',
                xp: 100,
                coins: 50,
                streak: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
            const result = await service.findByEmail('test@example.com');
            expect(result).toEqual(mockUser);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            });
        });
    });
    describe('updateUser', () => {
        it('should update user data', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                name: 'Updated Name',
                level: 'A1',
                xp: 200,
                coins: 100,
                streak: 10,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            mockPrismaService.user.update.mockResolvedValue(mockUser);
            const result = await service.update('1', {
                name: 'Updated Name',
                level: 'A1',
            });
            expect(result).toEqual(mockUser);
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: {
                    name: 'Updated Name',
                    level: 'A1',
                },
            });
        });
    });
});
//# sourceMappingURL=users.service.spec.js.map