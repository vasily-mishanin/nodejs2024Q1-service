import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaService } from 'src/prisma.service';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaService, LoggingService],
})
export class FavoritesModule {}
