import { Module } from '@nestjs/common';
import { TeacherCmsService } from './teacher-cms.service';
import { TeacherCmsController } from './teacher-cms.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TeacherCmsController],
  providers: [TeacherCmsService],
  exports: [TeacherCmsService],
})
export class TeacherCmsModule {}
