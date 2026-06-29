import { sanitizeUserResponse, sanitizeOrderResponse } from './response.util';

describe('response sanitization', () => {
  it('removes password hashes from user payloads', () => {
    const user = {
      id: 'user-1',
      email: 'jane@example.com',
      password: 'hashed-password',
      firstName: 'Jane',
      role: 'user',
    };

    const sanitized = sanitizeUserResponse(user);

    expect(sanitized).toEqual({
      id: 'user-1',
      email: 'jane@example.com',
      firstName: 'Jane',
      role: 'user',
    });
    expect(sanitized).not.toHaveProperty('password');
  });

  it('removes nested user data from order payloads', () => {
    const order = {
      id: 'order-1',
      orderNumber: 'ORD-100',
      total: '24.00',
      user: { id: 'user-1', password: 'hashed-password' },
      items: [],
    };

    const sanitized = sanitizeOrderResponse(order);

    expect(sanitized).toEqual({
      id: 'order-1',
      orderNumber: 'ORD-100',
      total: '24.00',
      items: [],
    });
    expect(sanitized).not.toHaveProperty('user');
  });
});
