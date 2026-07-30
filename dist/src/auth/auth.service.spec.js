"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const config_1 = require("@nestjs/config");
describe('AuthService', () => {
    let service;
    let usersService;
    let jwtService;
    const mockUsersService = {
        findByEmail: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        updateUser: jest.fn(),
    };
    const mockJwtService = {
        sign: jest.fn(),
        verify: jest.fn(),
    };
    const mockConfigService = {
        get: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: users_service_1.UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: config_1.ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        usersService = module.get(users_service_1.UsersService);
        jwtService = module.get(jwt_1.JwtService);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('validateUser', () => {
        it('should return user if credentials are valid', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                password: 'hashedPassword',
                name: 'Test User',
            };
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            mockConfigService.get.mockReturnValue('secret');
            const result = await service.validateUser('test@example.com', 'password');
            expect(result).toBeDefined();
        });
        it('should return null if user not found', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);
            const result = await service.validateUser('nonexistent@example.com', 'password');
            expect(result).toBeNull();
        });
    });
    describe('login', () => {
        it('should return access token on successful login', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                name: 'Test User',
            };
            mockJwtService.sign.mockReturnValue('mockToken');
            const result = await service.login('test@example.com', 'password');
            expect(result).toEqual({
                access_token: 'mockToken',
                user: mockUser,
            });
            expect(jwtService.sign).toHaveBeenCalledWith({
                sub: mockUser.id,
                email: mockUser.email,
            });
        });
    });
    describe('register', () => {
        it('should create new user and return token', async () => {
            const registerDto = {
                email: 'new@example.com',
                password: 'password',
                name: 'New User',
            };
            const mockUser = {
                id: '1',
                email: registerDto.email,
                name: registerDto.name,
                level: 'A0',
                xp: 0,
                coins: 0,
                streak: 0,
            };
            mockUsersService.findByEmail.mockResolvedValue(null);
            mockUsersService.create.mockResolvedValue(mockUser);
            mockJwtService.sign.mockReturnValue('mockToken');
            const result = await service.register('new@example.com', 'password', 'New User');
            expect(result).toEqual({
                access_token: 'mockToken',
                user: mockUser,
            });
        });
        it('should throw error if user already exists', async () => {
            const registerDto = {
                email: 'existing@example.com',
                password: 'password',
                name: 'Existing User',
            };
            const mockUser = {
                id: '1',
                email: registerDto.email,
                name: registerDto.name,
            };
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            await expect(service.register('existing@example.com', 'password', 'Existing User')).rejects.toThrow();
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map