import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SwaggerModule } from '@nestjs/swagger';
import * as YAML from 'yamljs';

//export const db = new FakeDatabase();

dotenv.config();

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = YAML.load('doc/api.yaml');

  SwaggerModule.setup('doc', app, document);

  await app.listen(port, () => console.log('Server is running on port ', port));
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
