import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
        name?: string;
    }): Promise<{
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
    login(req: any): Promise<{
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
    googleLogin(body: {
        googleId: string;
        email: string;
        name?: string;
        avatar?: string;
    }): Promise<{
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
    appleLogin(body: {
        appleId: string;
        email: string;
        name?: string;
    }): Promise<{
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
