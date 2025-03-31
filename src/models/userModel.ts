import { connectToDatabase, sql } from '../db';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Ensure the connection is established before performing queries
export const getAllUsers = async (): Promise<User[]> => {
  const pool = await connectToDatabase();
  if (!pool) throw new Error("Database connection failed");

  const result = await pool.request().query('SELECT * FROM Users');
  return result.recordset;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const pool = await connectToDatabase();
  if (!pool) throw new Error("Database connection failed");

  const result = await pool.request()
    .input('email', sql.NVarChar, email)
    .query('SELECT * FROM Users WHERE email = @email');
  return result.recordset[0] || null;
};

export const createUser = async (user: User): Promise<void> => {
  const pool = await connectToDatabase();
  if (!pool) throw new Error("Database connection failed");

  await pool.request()
    .input('name', sql.NVarChar, user.name)
    .input('email', sql.NVarChar, user.email)
    .input('password', sql.NVarChar, user.password)
    .query('INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)');
};
