import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
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
