import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomPublic } from './public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @CustomPublic()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
