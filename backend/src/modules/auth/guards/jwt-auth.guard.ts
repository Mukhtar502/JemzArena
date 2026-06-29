// Guard = Middleware-like protection for routes
// Why? Reusable way to protect endpoints

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
