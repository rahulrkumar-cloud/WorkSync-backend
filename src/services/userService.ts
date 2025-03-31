import bcrypt from 'bcryptjs';
import { User, getUserByEmail, createUser } from '../models/userModel';

export const registerUser = async (name: string, email: string, password: string): Promise<void> => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already exists. Please use another email.');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = { id: 0, name, email, password: hashedPassword };
  await createUser(newUser);
};
