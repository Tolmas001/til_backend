import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<{
        level: import("@prisma/client").$Enums.Level;
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        googleId: string | null;
        appleId: string | null;
        avatar: string | null;
        xp: number;
        coins: number;
        streak: number;
        lastActiveAt: Date;
        subscription: import("@prisma/client").$Enums.Subscription;
        careerGoal: import("@prisma/client").$Enums.CareerGoal | null;
        learningStyle: import("@prisma/client").$Enums.LearningStyle | null;
        weakTopics: string[];
        strongTopics: string[];
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            level: import("@prisma/client").$Enums.Level;
            xp: number;
            coins: number;
            streak: number;
        };
    }>;
    register(email: string, password: string, name?: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            level: import("@prisma/client").$Enums.Level;
            xp: number;
            coins: number;
            streak: number;
        };
    }>;
    googleLogin(googleId: string, email: string, name?: string, avatar?: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            level: import("@prisma/client").$Enums.Level;
            xp: number;
            coins: number;
            streak: number;
        };
    }>;
    appleLogin(appleId: string, email: string, name?: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            level: import("@prisma/client").$Enums.Level;
            xp: number;
            coins: number;
            streak: number;
        };
    }>;
}
