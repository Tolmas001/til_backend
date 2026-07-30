import { Module } from '@nestjs/common';
import { CoachTimelineService } from './coach-timeline.service';
import { CoachTimelineController } from './coach-timeline.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CoachTimelineController],
  providers: [CoachTimelineService],
  exports: [CoachTimelineService],
})
export class CoachTimelineModule {}
