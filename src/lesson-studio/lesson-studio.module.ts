import { Module } from '@nestjs/common';
import { LessonStudioService } from './lesson-studio.service';
import { LessonStudioController } from './lesson-studio.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [LessonStudioController],
  providers: [LessonStudioService],
  exports: [LessonStudioService],
})
export class LessonStudioModule {}
