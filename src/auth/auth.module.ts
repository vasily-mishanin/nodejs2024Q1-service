import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/routes/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET_KEY,
    //   signOptions: { expiresIn: process.env.TOKEN_EXPIRE_TIME },
    // }),
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET_REFRESH_KEY,
    //   signOptions: { expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME },
    // }),
  ],

  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
