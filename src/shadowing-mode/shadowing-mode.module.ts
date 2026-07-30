import { Module } from '@nestjs/common';
import { ShadowingModeService } from './shadowing-mode.service';
import { ShadowingModeController } from './shadowing-mode.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [ShadowingModeController],
  providers: [ShadowingModeService],
  exports: [ShadowingModeService],
})
export class ShadowingModeModule {}
