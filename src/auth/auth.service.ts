import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/routes/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// TODO - add logger

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(
    login: string,
    receivedPassword: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const existingUser = await this.usersService.findOnebyLogin(login);
    console.log('SIGN-UP', existingUser);
    if (existingUser) {
      throw new ConflictException(
        `Username with login "${login}" already exists`,
      );
    }

    const salt = await bcrypt.genSalt(+process.env.CRYPT_SALT);

    const hashedPassword = await bcrypt.hash(receivedPassword, salt); // Adjust the salt rounds as needed

    const newUser = await this.usersService.create({
      login,
      password: hashedPassword,
    });

    // "sub" and "username" by JWT conventions
    const payload = { userId: newUser.id, login: newUser.login };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_KEY,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_REFRESH_KEY,
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async signIn(
    login: string,
    receivedPassword: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const existingUser = await this.usersService.findOnebyLogin(login);

    if (!existingUser) {
      throw new NotFoundException(`User with login "${login}" not found`);
    }

    const isPasswordValid = await bcrypt.compare(
      receivedPassword,
      existingUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials - invalid password');
    }

    // "sub" and "username" by JWT conventions
    const payload = { userId: existingUser.id, login: existingUser.login };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_KEY,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      secret: process.env.JWT_SECRET_REFRESH_KEY,
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }
}
