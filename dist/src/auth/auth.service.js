"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && user.password && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(email, password) {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                level: user.level,
                xp: user.xp,
                coins: user.coins,
                streak: user.streak,
            },
        };
    }
    async register(email, password, name) {
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new common_1.UnauthorizedException('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.usersService.create({
            email,
            password: hashedPassword,
            name,
        });
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                level: user.level,
                xp: user.xp,
                coins: user.coins,
                streak: user.streak,
            },
        };
    }
    async googleLogin(googleId, email, name, avatar) {
        let user = await this.usersService.findByGoogleId(googleId);
        if (!user) {
            const existingUser = await this.usersService.findByEmail(email);
            if (existingUser) {
                user = await this.usersService.update(existingUser.id, { googleId });
            }
            else {
                user = await this.usersService.create({
                    email,
                    googleId,
                    name,
                    avatar,
                });
            }
        }
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                level: user.level,
                xp: user.xp,
                coins: user.coins,
                streak: user.streak,
            },
        };
    }
    async appleLogin(appleId, email, name) {
        let user = await this.usersService.findByAppleId(appleId);
        if (!user) {
            const existingUser = await this.usersService.findByEmail(email);
            if (existingUser) {
                user = await this.usersService.update(existingUser.id, { appleId });
            }
            else {
                user = await this.usersService.create({
                    email,
                    appleId,
                    name,
                });
            }
        }
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                level: user.level,
                xp: user.xp,
                coins: user.coins,
                streak: user.streak,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map