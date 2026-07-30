import { Module } from '@nestjs/common';
import { DataLakeService } from './data-lake.service';
import { DataLakeController } from './data-lake.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DataLakeController],
  providers: [DataLakeService],
  exports: [DataLakeService],
})
export class DataLakeModule {}
