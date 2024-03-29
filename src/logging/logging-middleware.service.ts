import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  use(req: Request, res: Response, next: () => void) {
    const { url, originalUrl, method, query, body } = req;
    const startTime = Date.now();

    // Log incoming request information
    this.logger.log(
      `--> Request - Method: ${method}, URL: ${originalUrl}, Query: ${JSON.stringify(
        query,
      )}, Body: ${JSON.stringify(body)}`,
    );

    // Intercept response to log status code
    res.on('finish', () => {
      const statusCode = res.statusCode;
      const endTime = Date.now();
      const duration = endTime - startTime;
      this.logger.log(
        `<-- Response - Status: ${statusCode}, Duration: ${duration}ms`,
      );
    });

    // Proceed with handling the request
    next();
  }
}
