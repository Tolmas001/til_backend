import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && user.password && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
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

  async register(email: string, password: string, name?: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
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

  async googleLogin(googleId: string, email: string, name?: string, avatar?: string) {
    let user = await this.usersService.findByGoogleId(googleId);
    
    if (!user) {
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        user = await this.usersService.update(existingUser.id, { googleId });
      } else {
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

  async appleLogin(appleId: string, email: string, name?: string) {
    let user = await this.usersService.findByAppleId(appleId);
    
    if (!user) {
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        user = await this.usersService.update(existingUser.id, { appleId });
      } else {
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
}
