import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Level } from '@prisma/client';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async findAll(level?: Level) {
    return this.prisma.lesson.findMany({
      where: level ? { level } : {},
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
    });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }

  async completeLesson(userId: string, lessonId: string, score: number = 100) {
    const lesson = await this.findOne(lessonId);

    // Save or update lesson progress
    const progress = await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        completed: true,
        score,
        completedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        completed: true,
        score,
        completedAt: new Date(),
      },
    });

    // Reward user with 50 XP and 20 Coins per completed lesson
    const xpReward = 50;
    const coinReward = 20;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xpReward },
        coins: { increment: coinReward },
        lastActiveAt: new Date(),
      },
    });

    // Update Daily Quests progress if any
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeUserQuests = await this.prisma.userDailyQuest.findMany({
      where: {
        userId,
        date: today,
        completed: false,
      },
      include: { quest: true },
    });

    for (const uq of activeUserQuests) {
      if (uq.quest.type === 'LESSON') {
        const newProgress = uq.progress + 1;
        const isCompleted = newProgress >= uq.quest.target;
        await this.prisma.userDailyQuest.update({
          where: { id: uq.id },
          data: {
            progress: newProgress,
            completed: isCompleted,
          },
        });
        if (isCompleted) {
          await this.prisma.user.update({
            where: { id: userId },
            data: {
              xp: { increment: uq.quest.xpReward },
              coins: { increment: uq.quest.coinReward },
            },
          });
        }
      }
    }

    return {
      progress,
      userStats: {
        xp: user.xp,
        coins: user.coins,
        streak: user.streak,
      },
      rewards: {
        xp: xpReward,
        coins: coinReward,
      },
    };
  }
}
