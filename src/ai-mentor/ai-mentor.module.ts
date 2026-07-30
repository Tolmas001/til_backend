import { Module } from '@nestjs/common';
import { AiMentorService } from './ai-mentor.service';
import { AiMentorController } from './ai-mentor.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [AiMentorController],
  providers: [AiMentorService],
  exports: [AiMentorService],
})
export class AiMentorModule {}
