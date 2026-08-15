import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function authMiddleware(req: any, res: any, next: any) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ status: false, message: 'missing or invalid token' });
  }

  try {
    req.user = jwt.verify(header.slice(7), env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ status: false, message: 'invalid or expired token' });
  }
}