import { Module } from '@nestjs/common';
import { ChurnPredictionService } from './churn-prediction.service';
import { ChurnPredictionController } from './churn-prediction.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [ChurnPredictionController],
  providers: [ChurnPredictionService],
  exports: [ChurnPredictionService],
})
export class ChurnPredictionModule {}
