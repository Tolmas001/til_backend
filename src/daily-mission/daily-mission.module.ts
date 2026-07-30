import { Module } from '@nestjs/common';
import { DailyMissionService } from './daily-mission.service';
import { DailyMissionController } from './daily-mission.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [DailyMissionController],
  providers: [DailyMissionService],
  exports: [DailyMissionService],
})
export class DailyMissionModule {}
