import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { PrismaService } from 'src/prisma.service';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  controllers: [TracksController],
  providers: [TracksService, PrismaService, LoggingService],
})
export class TracksModule {}
