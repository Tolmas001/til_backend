import { Module } from '@nestjs/common';
import { AdaptiveDifficultyService } from './adaptive-difficulty.service';
import { AdaptiveDifficultyController } from './adaptive-difficulty.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdaptiveDifficultyController],
  providers: [AdaptiveDifficultyService],
  exports: [AdaptiveDifficultyService],
})
export class AdaptiveDifficultyModule {}
