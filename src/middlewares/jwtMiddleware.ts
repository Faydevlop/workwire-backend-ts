import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
}

function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const token = req.header('Authorization');
  if (!token) {
    res.status(401).json({ error: 'Access denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    req.userId = decoded.userId; 
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

export default verifyToken;
