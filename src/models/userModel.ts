import bcrypt from 'bcryptjs'; // For password hashing and comparison
import jwt from 'jsonwebtoken'; // For JWT token generation
import { connectToDatabase, sql } from '../db';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  username:string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  created_at: string;
}

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  const pool = await connectToDatabase();
  if (!pool) throw new Error("Database connection failed");

  const result = await pool.request().query('SELECT * FROM Users');
  return result.recordset;
};

// Get all users
export const checkUsername = async (username: string): Promise<boolean> => {
  const pool = await connectToDatabase();
  if (!pool) throw new Error("Database connection failed");

  const result = await pool
    .request()
    .input("username", sql.NVarChar, username)
    .query("SELECT COUNT(*) AS count FROM Users WHERE username = @username");

  return result.recordset[0].count > 0; // Returns true if username exists
};


// Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const pool = await connectToDatabase();
  if (!pool) throw new Error("Database connection failed");

  const result = await pool.request()
    .input('email', sql.NVarChar, email)
    .query('SELECT * FROM Users WHERE email = @email');
  return result.recordset[0] || null;
};

// Create a new user
export const createUser = async (user: User): Promise<void> => {
  const pool = await connectToDatabase();
  if (!pool) throw new Error("Database connection failed");

  // Hash the password before saving it to the database
  const hashedPassword = await bcrypt.hash(user.password, 10);

  await pool.request()
    .input('name', sql.NVarChar, user.name)
    .input('email', sql.NVarChar, user.email)
    .input('password', sql.NVarChar, hashedPassword)
    .query('INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)');
};


// Get user by email or username
export const getUserByEmailOrUsername = async (email?: string, username?: string): Promise<User | null> => {
  const pool = await connectToDatabase();
  if (!pool) throw new Error("Database connection failed");

  const result = await pool.request()
    .input('email', sql.NVarChar, email || null)
    .input('username', sql.NVarChar, username || null)
    .query('SELECT * FROM Users WHERE email = @email OR username = @username');

  return result.recordset[0] || null;
};


export const sendMessage = async (senderId: number, receiverId: number, message: string): Promise<void> => {
  const pool = await connectToDatabase();
  if (!pool) throw new Error("Database connection failed");

  await pool.request()
    .input('sender_id', sql.Int, senderId)
    .input('receiver_id', sql.Int, receiverId)
    .input('message', sql.NVarChar, message)
    .query('INSERT INTO Messages (sender_id, receiver_id, message) VALUES (@sender_id, @receiver_id, @message)');
};

// Get messages between users
export const getMessages = async (userId: number, chatWithUserId: number) => {
  const pool = await connectToDatabase();
  if (!pool) throw new Error("Database connection failed");
  const result = await pool.request()
    .input("user1", sql.Int, userId)
    .input("user2", sql.Int, chatWithUserId)
    .query(`
      SELECT * FROM Messages
      WHERE 
        (sender_id = @user1 AND receiver_id = @user2)
        OR 
        (sender_id = @user2 AND receiver_id = @user1)
      ORDER BY created_at ASC
    `);

  return result.recordset;
};
