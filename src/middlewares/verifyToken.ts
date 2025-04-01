/// <reference path="../types/express.d.ts" />
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Define the decoded token type (without the password)
interface DecodedToken {
  id: number; // or string depending on your DB
  name: string;
  email: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

  if (!token) {
    res.status(403).json({ error: 'Access denied, no token provided' });
    return; // Make sure to return after sending the response
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret_key') as DecodedToken; // Cast the decoded payload

    // Only attach the required fields, not the password
    req.user = {
      id: decoded.id,  // If the id is a string, you can convert it to a number here if needed
      name: decoded.name,
      email: decoded.email,
      password: '' // Optional: you can omit the password for security reasons
    };

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
