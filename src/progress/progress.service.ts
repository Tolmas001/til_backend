import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getUserProgress(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        lessons: {
          include: { lesson: true },
        },
        storyProgress: {
          include: { location: true },
        },
        vocabulary: {
          include: { vocabulary: true },
        },
      },
    });

    if (!user) {
      return null;
    }

    const completedLessonsCount = user.lessons.filter((l) => l.completed).length;
    const totalLessons = await this.prisma.lesson.count();
    const vocabularyMasteredCount = user.vocabulary.filter((v) => v.mastered).length;

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        coins: user.coins,
        streak: user.streak,
        lastActiveAt: user.lastActiveAt,
      },
      stats: {
        completedLessonsCount,
        totalLessons,
        completionPercentage: totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0,
        vocabularyMasteredCount,
      },
      recentLessons: user.lessons.slice(0, 5),
    };
  }
}
