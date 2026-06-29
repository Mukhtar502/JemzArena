// Business logic for authentication
// Why separate from Controller? Controller handles HTTP, Service handles logic
// Service can be called from multiple places (Controller, other Services, etc)

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/database/prisma.service';
import { BcryptUtil } from 'src/utils/bcrypt.util';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { sanitizeUserResponse } from 'src/utils/response.util';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  //register new user
  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, phone } = registerDto;

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password before storing
    const hashedPassword = await BcryptUtil.hashPassword(password);

    // Create user in database
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
    });

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Registration successful',
      token,
      user: sanitizeUserResponse(user),
    };
  }
  // Login user
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare provided password with stored hash
    const isPasswordValid = await BcryptUtil.comparePasswords(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Generate token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: 'Login successful',
      token,
      user: sanitizeUserResponse(user),
    };
  }
  // Get current user (used by /auth/me endpoint)
  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
