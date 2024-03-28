import { Module } from '@nestjs/common';
import { MyLoggerService } from './logging.service';

@Module({
  providers: [MyLoggerService],
  exports: [MyLoggerService],
})
export class LoggingModule {}
