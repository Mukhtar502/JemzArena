// This exports JWT configuration used across the app
// Why separate? Makes it reusable and easy to change

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'dev-secret-key',
  expiresIn: process.env.JWT_EXPIRATION || '24h',
};
