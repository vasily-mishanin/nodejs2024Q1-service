import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, isString } from 'src/types';
import { CustomPublic } from 'src/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @CustomPublic()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    const { login, password } = signInDto;

    if (!login || !password || !isString(login) || !isString(password)) {
      throw new BadRequestException('Invalid login or/and password');
    }
    return this.authService.signIn(signInDto.login, signInDto.password);
  }

  @CustomPublic()
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

  @CustomPublic()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh(@Body() refreshDto: { refreshToken: string }) {
    const { refreshToken } = refreshDto;
    console.log('controller --- refreshToken ----  ', refreshToken);
    if (!refreshToken || !isString(refreshToken)) {
      throw new UnauthorizedException('Refresh token not provided');
    }

    return this.authService.refresh(refreshToken);
  }
}
