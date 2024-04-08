import { Injectable, LoggerService } from '@nestjs/common';
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  renameSync,
  statSync,
} from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService implements LoggerService {
  private logLevel: string;
  private logStream: NodeJS.WritableStream;
  private logErrorsStream: NodeJS.WritableStream;
  private logDirectory = path.join(__dirname, 'logs');
  private logFilePath = path.join(this.logDirectory, 'app_logs.log');
  private logErrorsFilePath = path.join(this.logDirectory, 'app_err_logs.log');
  private MAX_LOG_FILE_SIZE_BYTES = +process.env.MAX_LOG_FILE_SIZE_BYTES;

  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'INFO';

    // Check if the log directory exists, create it if it doesn't
    if (!existsSync(this.logDirectory)) {
      mkdirSync(this.logDirectory, { recursive: true });
    }
    this.logStream = createWriteStream(this.logFilePath, { flags: 'a' });
    this.logErrorsStream = createWriteStream(this.logErrorsFilePath, {
      flags: 'a',
    });
  }

  private logToFile(level: string, message: any, optionalParams?: any[]) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}\n`;

    // log to another file if errors
    if (level === 'ERROR' || level === 'FATAL') {
      if (existsSync(this.logErrorsFilePath)) {
        // Check log file size before writing
        const errorsLogsFileSize = this.getLogFileSize(this.logErrorsFilePath);
        if (errorsLogsFileSize > this.MAX_LOG_FILE_SIZE_BYTES) {
          this.rotateLogFile('ERROR_FILE');
        }
      }

      this.logErrorsStream.write(logMessage);
    } else {
      if (existsSync(this.logFilePath)) {
        // Check log file size before writing
        const currentSize = this.getLogFileSize(this.logFilePath);
        if (currentSize > this.MAX_LOG_FILE_SIZE_BYTES) {
          this.rotateLogFile('FILE');
        }
      }

      // Write the log message to the log stream
      this.logStream.write(logMessage);
    }
  }

  private rotateLogFile(fileType: 'ERROR_FILE' | 'FILE') {
    const timestamp = new Date().toISOString().replace(/:/g, '-');

    if (fileType === 'ERROR_FILE') {
      this.logErrorsStream.end();
      const backupFileName = path.join(
        this.logDirectory,
        `app_err_${timestamp}.log`,
      );

      renameSync(this.logErrorsFilePath, backupFileName);
      this.logErrorsStream = createWriteStream(this.logErrorsFilePath, {
        flags: 'a',
      });
      console.log(
        `\x1b[35mErrors log file rotated. Previous file renamed to ${backupFileName}. New log file started.\x1b[0m`,
      );
    } else {
      // Close the current log stream
      this.logStream.end();

      const backupFileName = path.join(
        this.logDirectory,
        `app_${timestamp}.log`,
      );

      // Rename the current log file to a backup file
      renameSync(this.logFilePath, backupFileName);

      // Create a new log stream for the main log file
      this.logStream = createWriteStream(this.logFilePath, { flags: 'a' });

      // Log rotation event
      console.log(
        `\x1b[35mLog file rotated. Previous file renamed to ${backupFileName}. New log file started.\x1b[0m`,
      );
    }
  }

  private getLogFileSize(logFilePath: string): number {
    const stats = statSync(logFilePath);
    return stats.size;
  }

  private shouldLog(level: string): boolean {
    const logLevels = ['info', 'debug', 'warn', 'error', 'fatal', 'verbose'];
    return logLevels.indexOf(level) >= logLevels.indexOf(this.logLevel);
  }

  // INSTANCE METHODS
  log(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('info')) {
      console.log('INFO:', message);
      this.logToFile('INFO', message);
    }
  }

  debug?(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('debug')) {
      console.log('DEBUG:', message);
      this.logToFile('DEBUG', message);
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
      this.logToFile('WARN', message);
    }
  }

  error(message: any, ...optionalParams: any[]) {
    if (this.shouldLog('error')) {
      console.log('\x1b[31mERROR:\x1b[0m', message);
      this.logToFile('ERROR', message);
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
