import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        lessons: {
          include: {
            lesson: true,
          },
        },
        achievements: {
          include: {
            achievement: true,
          },
        },
        dailyQuests: {
          include: {
            quest: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByGoogleId(googleId: string) {
    return this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  async findByAppleId(appleId: string) {
    return this.prisma.user.findUnique({
      where: { appleId },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateProgressStats(id: string, xpGain: number, coinsGain: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        xp: { increment: xpGain },
        coins: { increment: coinsGain },
        lastActiveAt: new Date(),
      },
    });
  }
}
