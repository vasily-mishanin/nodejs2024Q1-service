import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yamljs';
import { LoggingService } from './logging/logging.service';
import { CustomHttpExceptionFilter } from './http-exception.filter';

//export const db = new FakeDatabase();

dotenv.config();

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useGlobalFilters(new CustomHttpExceptionFilter());
  app.useLogger(app.get(LoggingService));

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception occurred:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  const document = YAML.load('doc/api.yaml');

  SwaggerModule.setup('doc', app, document);

  await app.listen(port, () =>
    console.log(`\x1b[32mServer is running on port ${port}\x1b[0m`),
  );
}

bootstrap();

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};
