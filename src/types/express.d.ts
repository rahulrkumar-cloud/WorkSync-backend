// src/types/express.d.ts
import { User } from 'models/userModel'; // Adjust the import path to your User model

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add the user property to Request, the type of which is the User model
    }
  }
}
