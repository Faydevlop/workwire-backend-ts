import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};
