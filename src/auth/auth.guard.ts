import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // public or /doc
    if (isPublic || this.isSwaggerUiRoute(context)) {
      // 💡 No Authorization needed
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const jwt_token = this.extractTokenFromHeader(request);

    if (!jwt_token) {
      throw new UnauthorizedException('No Authorizatoion token found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(jwt_token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException(
        'Authorization jwt token failed verification',
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, jwt_token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? jwt_token : undefined;
  }

  private isSwaggerUiRoute(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    return request.url.startsWith('/doc');
  }
}
