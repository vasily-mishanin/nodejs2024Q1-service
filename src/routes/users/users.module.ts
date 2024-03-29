import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { LoggingService } from 'src/logging/logging.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, LoggingService],
})
export class UsersModule {}
