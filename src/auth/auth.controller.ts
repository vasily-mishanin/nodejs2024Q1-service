import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, isString } from 'src/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    const { login, password } = signInDto;

    if (!login || !password || !isString(login) || !isString(password)) {
      throw new BadRequestException('Invalid login or/and password');
    }
    return this.authService.signIn(signInDto.login, signInDto.password);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() signInDto: SignInDto) {
    const { login, password } = signInDto;
    console.log('signUp', signInDto);
    if (!login || !password || !isString(login) || !isString(password)) {
      throw new BadRequestException('Invalid login or/and password');
    }

    return this.authService.signUp(signInDto.login, signInDto.password);
  }
}
