import { Module } from '@nestjs/common';
import { SpeechAnalyticsService } from './speech-analytics.service';
import { SpeechAnalyticsController } from './speech-analytics.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [SpeechAnalyticsController],
  providers: [SpeechAnalyticsService],
  exports: [SpeechAnalyticsService],
})
export class SpeechAnalyticsModule {}
