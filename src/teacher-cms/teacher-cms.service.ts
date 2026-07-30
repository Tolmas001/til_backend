import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeacherCmsService {
  private readonly logger = new Logger(TeacherCmsService.name);

  constructor(private prisma: PrismaService) {}

  // Teacher CMS - B2B Dashboard
  async createOrganization(data: { name: string; type: string; email: string; phone?: string }) {
    return this.prisma.organization.create({
      data,
    });
  }

  async getOrganization(id: string) {
    return this.prisma.organization.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async addOrganizationMember(organizationId: string, userId: string, role: string, permissions?: any) {
    return this.prisma.organizationMember.create({
      data: {
        organizationId,
        userId,
        role,
        permissions,
      },
    });
  }

  async getOrganizationMembers(organizationId: string) {
    return this.prisma.organizationMember.findMany({
      where: { organizationId },
      include: {
        user: true,
      },
    });
  }

  async removeOrganizationMember(organizationId: string, userId: string) {
    return this.prisma.organizationMember.delete({
      where: {
        organizationId_userId: {
          organizationId,
          userId,
        },
      },
    });
  }

  async getOrganizationUsers(organizationId: string) {
    const members = await this.prisma.organizationMember.findMany({
      where: { organizationId },
      include: {
        user: true,
      },
    });

    const userIds = members.map((m) => m.userId);

    const users = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
    });

    return users;
  }

  async getUserProgress(organizationId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const evaluations = await this.prisma.skillEvaluation.findMany({
      where: { userId },
    });

    const lessons = await this.prisma.lessonProgress.findMany({
      where: { userId },
    });

    const missions = await this.prisma.dailyMission.findMany({
      where: { userId },
    });

    return {
      user,
      level: user.level,
      xp: user.xp,
      coins: user.coins,
      streak: user.streak,
      evaluationsCount: evaluations.length,
      lessonsCompleted: lessons.filter((l) => l.completed).length,
      missionsCompleted: missions.filter((m) => m.completed).length,
      lastActive: user.lastActiveAt,
    };
  }

  async getOrganizationStats(organizationId: string) {
    const members = await this.prisma.organizationMember.findMany({
      where: { organizationId },
    });

    const userIds = members.map((m) => m.userId);

    const users = await this.prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
    });

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => {
      const daysSinceActive = Math.floor(
        (new Date().getTime() - u.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24),
      );
      return daysSinceActive <= 7;
    }).length;

    const totalXP = users.reduce((sum, u) => sum + u.xp, 0);
    const avgXP = totalUsers > 0 ? Math.round(totalXP / totalUsers) : 0;

    const levelDistribution: Record<string, number> = {};
    users.forEach((u) => {
      levelDistribution[u.level] = (levelDistribution[u.level] || 0) + 1;
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      totalXP,
      averageXP: avgXP,
      levelDistribution,
      engagementRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
    };
  }

  async getOrganizationProgress(organizationId: string) {
    const members = await this.prisma.organizationMember.findMany({
      where: { organizationId },
    });

    const userIds = members.map((m) => m.userId);

    const progress = await Promise.all(
      userIds.map(async (userId) => {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });

        const evaluations = await this.prisma.skillEvaluation.findMany({
          where: { userId },
          take: 10,
          orderBy: { evaluatedAt: 'desc' },
        });

        const lessons = await this.prisma.lessonProgress.findMany({
          where: { userId },
        });

        return {
          userId,
          name: user.name,
          email: user.email,
          level: user.level,
          xp: user.xp,
          streak: user.streak,
          lastActive: user.lastActiveAt,
          evaluationsCount: evaluations.length,
          lessonsCompleted: lessons.filter((l) => l.completed).length,
          averageScore:
            evaluations.length > 0
              ? Math.round(evaluations.reduce((sum, e) => sum + e.overallScore, 0) / evaluations.length)
              : 0,
        };
      }),
    );

    return progress;
  }

  async updateOrganization(id: string, data: { name?: string; email?: string; phone?: string }) {
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  async deleteOrganization(id: string) {
    // Delete all members first
    await this.prisma.organizationMember.deleteMany({
      where: { organizationId: id },
    });

    return this.prisma.organization.delete({
      where: { id },
    });
  }

  async getAllOrganizations() {
    return this.prisma.organization.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
  }
}
