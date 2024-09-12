import { Request, Response } from 'express';
import { verifyRefreshToken, generateAccessToken } from '../../middlewares/jwt';

export const refreshToken = (req: Request, res: Response): void => {
  const { refreshToken } = req.body;
  console.log('refreshToken from body:', refreshToken);

  if (!refreshToken) {
    res.status(401).json({ message: 'No refresh token provided' });
    return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(403).json({ message: 'Invalid refresh token' });
      return;
    }

    const newAccessToken = generateAccessToken(decoded.userId);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Error during refresh token process:', error);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

  
