import bcrypt from 'bcryptjs'; // For password hashing and comparison
import jwt from 'jsonwebtoken'; // For JWT token generation
import { connectToDatabase, sql } from '../db';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  const pool = await connectToDatabase();
  if (!pool) throw new Error("Database connection failed");

  const result = await pool.request().query('SELECT * FROM Users');
  return result.recordset;
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

// Update a user's details by ID
export const updateUserById = async (
  userId: number,
  name: string,
  email: string,
  password: string
): Promise<User | null> => {
  const pool = await connectToDatabase();
  if (!pool) throw new Error("Database connection failed");

  const hashedPassword = await bcrypt.hash(password, 10); // You should hash the password before saving

  const result = await pool.request()
    .input('id', sql.Int, userId)
    .input('name', sql.NVarChar, name)
    .input('email', sql.NVarChar, email)
    .input('password', sql.NVarChar, hashedPassword)
    .query('UPDATE Users SET name = @name, email = @email, password = @password WHERE id = @id');

  if (result.rowsAffected[0] === 0) {
    return null;
  }

  return { id: userId, name, email, password: hashedPassword };
};

// Authenticate user and return a token
export const authenticateUser = async (email: string, password: string): Promise<string | null> => {
  const pool = await connectToDatabase();
  if (!pool) throw new Error("Database connection failed");

  const result = await pool.request()
    .input('email', sql.NVarChar, email)
    .query('SELECT * FROM Users WHERE email = @email');
  
  const user = result.recordset[0];
  if (!user) {
    return null; // User not found
  }

  // Compare the entered password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null; // Invalid password
  }

  // Create a JWT token
  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email }, 
    'your_jwt_secret_key', // Secret key to sign the JWT (you should store this in environment variables)
    { expiresIn: '1h' } // Token expiration time
  );

  return token;
};
