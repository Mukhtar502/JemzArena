// JWT Strategy = How to validate JWT tokens
// Why? Passport needs to know how to validate our tokens

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConfig } from '../../../config/jwt.config';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // Tell Passport to look for token in "Authorization: Bearer <token>" header
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  // Passport automatically calls this after validating JWT signature
  // The payload is what was signed into the token
  validate(payload: JwtPayload) {
    return {
      sub: payload.sub, // User ID
      email: payload.email,
      role: payload.role,
    };
  }
}
