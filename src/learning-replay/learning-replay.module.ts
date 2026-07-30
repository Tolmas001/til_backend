import { Module } from '@nestjs/common';
import { LearningReplayService } from './learning-replay.service';
import { LearningReplayController } from './learning-replay.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [LearningReplayController],
  providers: [LearningReplayService],
  exports: [LearningReplayService],
})
export class LearningReplayModule {}
