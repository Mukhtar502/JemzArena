// Password hashing utilities
// Why? Keep crypto logic in one place, reusable across auth module

import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // Higher = more secure but slower

export class BcryptUtil {
  // Hash password when user registers
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  // Compare entered password with stored hash during login
  static async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
