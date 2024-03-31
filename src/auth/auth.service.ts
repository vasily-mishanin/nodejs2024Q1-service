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
import { LoggingService } from 'src/logging/logging.service';

// TODO - add logger

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private logger: LoggingService,
  ) {}

  async signUp(
    login: string,
    receivedPassword: string,
  ): Promise<{ id: string; accessToken: string; refreshToken: string }> {
    const existingUser = await this.usersService.findOnebyLogin(login);
    console.log('SIGN-UP', existingUser);
    if (existingUser) {
      this.logger.warn(
        'WARN',
        `409 - Username with login "${login}" already exists`,
      );
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

    // TODO - implement private method
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

    return { id: newUser.id, accessToken, refreshToken };
  }

  async signIn(
    login: string,
    receivedPassword: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const existingUser = await this.usersService.findOnebyLogin(login);

    if (!existingUser) {
      this.logger.warn('WARN', `404 - User with login "${login}" not found`);
      throw new NotFoundException(`User with login "${login}" not found`);
    }

    const isPasswordValid = await bcrypt.compare(
      receivedPassword,
      existingUser.password,
    );

    if (!isPasswordValid) {
      this.logger.warn('WARN', `401 - Invalid credentials - invalid password`);
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

    return { accessToken, refreshToken };
  }

  // REFRESH
  async refresh(refreshToken: string) {
    try {
      // Verify the refresh token
      const decodedToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      console.log({ decodedToken });
      // Extract the user ID from the decoded token
      const { userId, login } = decodedToken;

      const existingUser = await this.usersService.findOnebyLogin(login);
      // Compare the decoded token's userId claim with expected user ID
      if (userId !== existingUser.id) {
        this.logger.warn(
          'WARN',
          `403 - Invalid refresh token - invalid userId`,
        );
        throw new ForbiddenException('Invalid refresh token - invalid userId');
      }

      // Return a response indicating successful token verification
      // "sub" and "username" by JWT conventions
      const payload = { userId: existingUser.id, login: existingUser.login };

      const newAccessToken = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_KEY,
      });

      const newRefreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      // Handle token verification errors
      if (error.name === 'TokenExpiredError') {
        this.logger.error('ERROR', `403 - Expired refresh token`);
        throw new ForbiddenException('Expired refresh token');
      } else if (error.name === 'JsonWebTokenError') {
        this.logger.error(
          'ERROR',
          `403 - Invalid refresh token - ${error.name}`,
        );
        throw new ForbiddenException(`Invalid refresh token - ${error.name}`);
      } else {
        this.logger.error('ERROR', `403 - Invalid or expired refresh token`);
        throw new ForbiddenException('Invalid or expired refresh token');
      }
    }
  }
}
