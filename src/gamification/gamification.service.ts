import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  async getLeaderboard(limit: number = 20) {
    const topUsers = await this.prisma.user.findMany({
      take: limit,
      orderBy: { xp: 'desc' },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
        xp: true,
        coins: true,
        streak: true,
      },
    });
    return topUsers;
  }

  async getDailyQuests(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all system daily quests
    let systemQuests = await this.prisma.dailyQuest.findMany();

    if (systemQuests.length === 0) {
      // Create initial quests if none exist
      systemQuests = [
        await this.prisma.dailyQuest.create({
          data: {
            title: "1 ta Darsni tugatish",
            description: "Bugun kamida 1 ta darsni muvaffaqiyatli yakunlang",
            type: "LESSON",
            target: 1,
            xpReward: 30,
            coinReward: 15,
          },
        }),
        await this.prisma.dailyQuest.create({
          data: {
            title: "AI bilan 3 ta xabar",
            description: "AI suhbatdoshingiz bilan kamida 3 marta gaplashing",
            type: "CHAT",
            target: 3,
            xpReward: 25,
            coinReward: 10,
          },
        }),
        await this.prisma.dailyQuest.create({
          data: {
            title: "Kunlik kirish (Streak)",
            description: "Bugungi o'quv seansini faollashtiring",
            type: "STREAK",
            target: 1,
            xpReward: 20,
            coinReward: 10,
          },
        }),
      ];
    }

    // Assign to user if not assigned today
    const userQuests = [];
    for (const quest of systemQuests) {
      let uq = await this.prisma.userDailyQuest.findUnique({
        where: {
          userId_questId_date: {
            userId,
            questId: quest.id,
            date: today,
          },
        },
        include: { quest: true },
      });

      if (!uq) {
        uq = await this.prisma.userDailyQuest.create({
          data: {
            userId,
            questId: quest.id,
            date: today,
            progress: quest.type === 'STREAK' ? 1 : 0,
            completed: quest.type === 'STREAK',
          },
          include: { quest: true },
        });
      }
      userQuests.push(uq);
    }

    return userQuests;
  }

  async getAchievements(userId: string) {
    let allAchievements = await this.prisma.achievement.findMany();

    if (allAchievements.length === 0) {
      allAchievements = [
        await this.prisma.achievement.create({
          data: {
            title: "Birinchi gap",
            description: "AI bilan birinchi marta suhbatlashganda",
            icon: "💬",
            condition: "CHAT_1",
            reward: 50,
            coinReward: 25,
          },
        }),
        await this.prisma.achievement.create({
          data: {
            title: "7 Kunlik Streak",
            description: "7 kun ketma-ket ilovadan foydalanganingizda",
            icon: "🔥",
            condition: "STREAK_7",
            reward: 100,
            coinReward: 50,
          },
        }),
        await this.prisma.achievement.create({
          data: {
            title: "Grammatika Ustasi",
            description: "Darslarni 100% natija bilan tugatganda",
            icon: "🏆",
            condition: "SCORE_100",
            reward: 150,
            coinReward: 75,
          },
        }),
      ];
    }

    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
    });

    const userAchievementMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));

    return allAchievements.map((ach) => {
      const uAch = userAchievementMap.get(ach.id);
      return {
        ...ach,
        unlocked: uAch ? uAch.unlocked : false,
        unlockedAt: uAch ? uAch.unlockedAt : null,
      };
    });
  }

  async getStoryLocations(userId: string) {
    let locations = await this.prisma.storyLocation.findMany({
      orderBy: { order: 'asc' },
    });

    if (locations.length === 0) {
      locations = [
        await this.prisma.storyLocation.create({
          data: { name: 'Airport (Aeroport)', description: 'Rossiyaga kelish va pasport nazorati', order: 1, level: 'A0', unlocked: true },
        }),
        await this.prisma.storyLocation.create({
          data: { name: 'Taxi (Taksi)', description: 'Aeroportdan shaharga va mehmonxonaga borish', order: 2, level: 'A0', unlocked: false },
        }),
        await this.prisma.storyLocation.create({
          data: { name: 'Hotel (Mehmonxona)', description: 'Mehmonxonada xona bron qilish va joylashish', order: 3, level: 'A1', unlocked: false },
        }),
        await this.prisma.storyLocation.create({
          data: { name: 'Restaurant (Restoran)', description: 'Milliy va mahalliy taomlar buyurtma qilish', order: 4, level: 'A1', unlocked: false },
        }),
        await this.prisma.storyLocation.create({
          data: { name: 'University (Universitet)', description: 'Universitetga o\'qishga kirish va intervyu', order: 5, level: 'A2', unlocked: false },
        }),
        await this.prisma.storyLocation.create({
          data: { name: 'Work (Ish)', description: 'Ishga joylashish va suhbatdan o\'tish', order: 6, level: 'B1', unlocked: false },
        }),
        await this.prisma.storyLocation.create({
          data: { name: 'Travel (Sayohat)', description: 'Rossiya bo\'ylab mustaqil sayohat qilish', order: 7, level: 'B2', unlocked: false },
        }),
      ];
    }

    const userStory = await this.prisma.userStoryProgress.findMany({
      where: { userId },
    });

    const userStoryMap = new Map(userStory.map((us) => [us.locationId, us]));

    return locations.map((loc, idx) => {
      const uProgress = userStoryMap.get(loc.id);
      return {
        ...loc,
        unlocked: idx === 0 || (uProgress ? uProgress.unlocked : false),
        completed: uProgress ? uProgress.completed : false,
      };
    });
  }
}
