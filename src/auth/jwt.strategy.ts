import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'SECRET123',
    });
  }

  async validate(payload: any) {
    return {
      master_user_id: payload.master_user_id,
      role: payload.role,
      hostel_id: payload.hostel_id,
    };
  }
}
