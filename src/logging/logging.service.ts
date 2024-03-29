import { Injectable, LoggerService } from '@nestjs/common';
import { createWriteStream, renameSync, statSync } from 'fs';
import path from 'path';

@Injectable()
export class LoggingService implements LoggerService {
  private logLevel: string;
  private logStream: NodeJS.WritableStream;
  private logFilePath = path.join(__dirname, 'logs', 'app_current_logs.log');
  private MAX_LOG_FILE_SIZE_BYTES = +process.env.MAX_LOG_FILE_SIZE_BYTES;

  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'INFO';
    this.logStream = createWriteStream('app.log', { flags: 'a' });
  }

  private shouldLog(level: string): boolean {
    const logLevels = ['info', 'debug', 'warn', 'error', 'fatal', 'verbose'];
    return logLevels.indexOf(level) >= logLevels.indexOf(this.logLevel);
  }

  // INSTANCE METHODS
  log(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('info')) {
      console.log('INFO:', message);
      this.logToFile('INFO:', message);
    }
  }

  debug?(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('debug')) {
      console.log('DEBUG:', message);
      this.logToFile('DEBUG:', message);
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('warn')) {
      console.log(
        '\x1b[38;2;255;165;0mWARN:\x1b[0m',
        message,
        '-',
        optionalParams,
      );
      this.logToFile('\x1b[38;2;255;165;0mWARN:\x1b[0m', message);
    }
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('error')) {
      console.log('\x1b[31mERROR:\x1b[0m', message);
      this.logToFile('\x1b[31mERROR:\x1b[0m', message);
    }
  }

  fatal(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('fatal')) {
      console.log('FATAL:', message);
      this.logToFile('FATAL', message);
    }
  }

  verbose?(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('verbose')) {
      console.log('VERBOSE:', message);
      this.logToFile('VERBOSE', message);
    }
  }
}
