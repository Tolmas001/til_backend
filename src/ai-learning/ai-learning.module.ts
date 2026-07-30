import { Module } from '@nestjs/common';
import { AiLearningService } from './ai-learning.service';
import { AiLearningController } from './ai-learning.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [AiLearningController],
  providers: [AiLearningService],
  exports: [AiLearningService],
})
export class AiLearningModule {}
