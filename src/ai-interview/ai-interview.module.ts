import { Module } from '@nestjs/common';
import { AiInterviewService } from './ai-interview.service';
import { AiInterviewController } from './ai-interview.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [AiInterviewController],
  providers: [AiInterviewService],
  exports: [AiInterviewService],
})
export class AiInterviewModule {}
