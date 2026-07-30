import { Module } from '@nestjs/common';
import { ContentPipelineService } from './content-pipeline.service';
import { ContentPipelineController } from './content-pipeline.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [ContentPipelineController],
  providers: [ContentPipelineService],
  exports: [ContentPipelineService],
})
export class ContentPipelineModule {}
