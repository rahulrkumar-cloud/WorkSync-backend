import { Request, Response } from 'express';
import { getAllUsers, getUserByEmail, updateUserById } from '../models/userModel'; // Import your model methods
import { registerUser } from '../services/userService'; // User registration logic
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // For generating the JWT token
import { poolPromise, sql } from '../db';

// Get all users

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      // Optionally, you can log the authenticated user like this:
    //   console.log('Authenticated User:', req?.user||"Not found");
  
      const users = await getAllUsers();
      res.json(users);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('❌ Database query error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        console.error('❌ Unknown error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
  

// Create a new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
    return;
  }

  try {
    const pool = await poolPromise;
    if (!pool) {
      res.status(500).json({ error: "Database connection failed" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword)
      .query("INSERT INTO [dbo].[Users] (name, email, password) VALUES (@name, @email, @password)");

    res.status(201).json({ message: "User created successfully" });
  } catch (error: any) {
    if (error.number === 2627 || error.number === 2601) {
      console.warn("⚠️ Duplicate email detected:", email);
      res.status(400).json({ error: "Email already exists. Please use a different email." });
    } else {
      console.error("❌ Unexpected error while creating user:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};


// Update an existing user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id); // Get user ID from URL parameter
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
    return;
  }

  try {
    const pool = await poolPromise;
    if (!pool) {
      res.status(500).json({ error: "Database connection failed" });
      return;
    }

    console.log("Updating user with ID:", userId);

    // ✅ Check if user exists before updating
    const existingUser = await pool
      .request()
      .input("id", sql.Int, userId)
      .query("SELECT id FROM [WorkSync].[dbo].[Users] WHERE id = @id");

    if (existingUser.recordset.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // ✅ Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Perform the update
    const result = await pool
      .request()
      .input("id", sql.Int, userId)
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword)
      .query(
        "UPDATE [WorkSync].[dbo].[Users] SET name = @name, email = @email, password = @password WHERE id = @id"
      );

    console.log("Update result:", result);

    if (result.rowsAffected[0] === 0) {
      res.status(404).json({ error: "User not found or no changes made" });
    } else {
      res.status(200).json({ message: "User updated successfully" });
    }
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



// Login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    // Fetch user by email
    const user = await getUserByEmail(email);

    if (user) {
      // Check password with bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid); // Log if password is valid

      if (isPasswordValid) {
        // If password matches, generate a JWT token
        const token = jwt.sign(
          { id: user.id, name: user.name, email: user.email },
          'your_jwt_secret_key', // Replace with your actual secret key
          { expiresIn: '1h' } // Token expiration time
        );
        const { id, name, email } = user;
        res.status(200).json({ message: 'Login successful',user: { id, name, email }, token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error logging in:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      console.error('Unknown error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
