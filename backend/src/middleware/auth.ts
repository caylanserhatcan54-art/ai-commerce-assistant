import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@config/env';

export interface AuthPayload {
  shopId: string;
  userId: string;
  role: 'owner' | 'admin' | 'viewer';
}

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Request {
      auth?: AuthPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Missing authorization token' });

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
    req.auth = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid authorization token' });
  }
};