import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { PrismaService } from 'src/prisma.service';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService, PrismaService, LoggingService],
})
export class ArtistsModule {}
