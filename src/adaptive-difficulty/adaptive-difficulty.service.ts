import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdaptiveDifficultyService {
  private readonly logger = new Logger(AdaptiveDifficultyService.name);

  constructor(private prisma: PrismaService) {}

  // Adaptive Difficulty - Auto-adjust based on performance
  async recordAnswer(userId: string, isCorrect: boolean) {
    const userDifficulty = await this.prisma.userDifficulty.findUnique({
      where: { userId },
    });

    if (!userDifficulty) {
      return this.prisma.userDifficulty.create({
        data: {
          userId,
          currentDifficulty: 'medium',
          consecutiveCorrect: isCorrect ? 1 : 0,
          consecutiveWrong: isCorrect ? 0 : 1,
          lastAdjustedAt: new Date(),
        },
      });
    }

    const updateData: any = {
      lastAdjustedAt: new Date(),
    };

    if (isCorrect) {
      updateData.consecutiveCorrect = userDifficulty.consecutiveCorrect + 1;
      updateData.consecutiveWrong = 0;

      // Increase difficulty after 10 consecutive correct answers
      if (userDifficulty.consecutiveCorrect + 1 >= 10) {
        updateData.currentDifficulty = this.increaseDifficulty(userDifficulty.currentDifficulty);
        updateData.consecutiveCorrect = 0;
      }
    } else {
      updateData.consecutiveWrong = userDifficulty.consecutiveWrong + 1;
      updateData.consecutiveCorrect = 0;

      // Decrease difficulty after 3 consecutive wrong answers
      if (userDifficulty.consecutiveWrong + 1 >= 3) {
        updateData.currentDifficulty = this.decreaseDifficulty(userDifficulty.currentDifficulty);
        updateData.consecutiveWrong = 0;
      }
    }

    const updated = await this.prisma.userDifficulty.update({
      where: { userId },
      data: updateData,
    });

    // Log learning event
    await this.prisma.learningEvent.create({
      data: {
        userId,
        eventType: 'difficulty_adjusted',
        metadata: {
          isCorrect,
          newDifficulty: updated.currentDifficulty,
          consecutiveCorrect: updated.consecutiveCorrect,
          consecutiveWrong: updated.consecutiveWrong,
        },
      },
    });

    return updated;
  }

  private increaseDifficulty(current: string): string {
    const levels = ['easy', 'medium', 'hard', 'native'];
    const currentIndex = levels.indexOf(current);
    if (currentIndex < levels.length - 1) {
      return levels[currentIndex + 1];
    }
    return current;
  }

  private decreaseDifficulty(current: string): string {
    const levels = ['easy', 'medium', 'hard', 'native'];
    const currentIndex = levels.indexOf(current);
    if (currentIndex > 0) {
      return levels[currentIndex - 1];
    }
    return current;
  }

  async getUserDifficulty(userId: string) {
    const userDifficulty = await this.prisma.userDifficulty.findUnique({
      where: { userId },
    });

    if (!userDifficulty) {
      return {
        currentDifficulty: 'medium',
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
      };
    }

    return userDifficulty;
  }

  async resetUserDifficulty(userId: string) {
    return this.prisma.userDifficulty.upsert({
      where: { userId },
      create: {
        userId,
        currentDifficulty: 'medium',
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        lastAdjustedAt: new Date(),
      },
      update: {
        currentDifficulty: 'medium',
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        lastAdjustedAt: new Date(),
      },
    });
  }

  async getDifficultyStats(userId: string) {
    const userDifficulty = await this.prisma.userDifficulty.findUnique({
      where: { userId },
    });

    if (!userDifficulty) {
      return {
        currentDifficulty: 'medium',
        progressToNext: 0,
        progressFromPrevious: 0,
        streak: 0,
      };
    }

    const levels = ['easy', 'medium', 'hard', 'native'];
    const currentIndex = levels.indexOf(userDifficulty.currentDifficulty);

    const progressToNext = userDifficulty.consecutiveCorrect / 10; // 10 correct to level up
    const progressFromPrevious = 1 - (userDifficulty.consecutiveWrong / 3); // 3 wrong to level down

    return {
      currentDifficulty: userDifficulty.currentDifficulty,
      progressToNext: Math.min(1, progressToNext),
      progressFromPrevious: Math.max(0, progressFromPrevious),
      streak: userDifficulty.consecutiveCorrect,
      consecutiveWrong: userDifficulty.consecutiveWrong,
    };
  }
}
