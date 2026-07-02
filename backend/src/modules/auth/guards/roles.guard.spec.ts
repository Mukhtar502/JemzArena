import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from './roles.decorator';

describe('RolesGuard', () => {
  it('allows requests when the user role matches', () => {
    const reflector = new Reflector();
    const guard = new RolesGuard(reflector);
    const context = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'admin' } }),
      }),
    } as unknown as ExecutionContext;

    reflector.getAllAndOverride = jest.fn().mockReturnValue(['admin']);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('denies requests when the user role does not match', () => {
    const reflector = new Reflector();
    const guard = new RolesGuard(reflector);
    const context = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: 'user' } }),
      }),
    } as unknown as ExecutionContext;

    reflector.getAllAndOverride = jest.fn().mockReturnValue(['admin']);

    expect(guard.canActivate(context)).toBe(false);
  });
});
