import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers.authorization;

    if (!auth) throw new UnauthorizedException('Token missing');

    const token = auth.split(' ')[1];
    if (!token) throw new UnauthorizedException('Invalid token');

    try {
      const user = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET || 'SECRET123',
      });

      req.user = user; // important
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
