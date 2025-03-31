import { Request, Response } from 'express';
import { getAllUsers } from '../models/userModel';
import { registerUser } from '../services/userService';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error: unknown) { // explicitly define the error type as 'unknown'
    if (error instanceof Error) {
      console.error('❌ Database query error:', error.message); // Access 'message' safely
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.error('❌ Unknown error:', error); // If it's not an instance of Error
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }
  try {
    await registerUser(name, email, password);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error: unknown) { // explicitly define the error type as 'unknown'
    if (error instanceof Error) {
      console.error('❌ Error creating user:', error.message); // Access 'message' safely
      res.status(400).json({ error: error.message });
    } else {
      console.error('❌ Unknown error:', error); // If it's not an instance of Error
      res.status(400).json({ error: 'Error creating user' });
    }
  }
};
