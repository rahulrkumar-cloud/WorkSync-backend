import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Use .env

export interface AuthenticatedRequest extends Request {
  user?: { id: number; name: string; email: string };
}

// Middleware to verify JWT token
export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer token

  if (!token) {
    res.status(401).json({ error: 'Access Denied. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number; name: string; email: string };
    req.user = decoded; // Attach user data to request
    next(); // Move to next middleware/route
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
