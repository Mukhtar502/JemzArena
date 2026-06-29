// Handles HTTP requests/responses
// Why separate? Single Responsibility Principle
// Controller = HTTP layer, Service = Business logic

import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request as Req,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // POST /api/auth/register
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // POST /api/auth/login
  @Post('login')
  @ApiOperation({ summary: 'Log in and receive a JWT' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // GET /api/auth/me (Protected - requires valid JWT)
  @Get('me')
  @UseGuards(JwtAuthGuard) // Only authenticated users can access
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get the profile of the current user' })
  @ApiResponse({ status: 200, description: 'Current user retrieved' })
  async getCurrentUser(@Req() req: Request & { user?: { sub: string } }) {
    // @Req() gives us the HTTP request
    // JwtStrategy adds userId to req.user
    const userId = req.user?.sub;
    if (!userId) {
      throw new Error('Authenticated user id not found on request');
    }
    return this.authService.getCurrentUser(userId);
  }

  // POST /api/auth/logout
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Log out the current user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout() {
    // Logout is mostly frontend (delete token)
    // Backend just confirms
    return { message: 'Logout successful' };
  }
}
