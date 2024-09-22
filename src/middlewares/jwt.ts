import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-access-token-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret';

// Verify access token
export const verifyToken = (token: string): JwtPayload | undefined => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return undefined;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: any): JwtPayload | null => {
  console.log(token);
  
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Generate access token
export const generateAccessToken = (userId: any): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
};

// Generate refresh token
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
