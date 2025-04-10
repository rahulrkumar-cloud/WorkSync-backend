// Changed because Azure subscription is getting expired after restore have to change back to below
// import { Request, Response } from 'express';
// import { checkUsername, getAllUsers, getMessages, getUserByEmail, getUserByEmailOrUsername, sendMessage } from '../models/userModel'; // Import your model methods
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken'; // For generating the JWT token
// import { poolPromise, sql } from '../db';
// import { AuthenticatedRequest } from '../middlewares/authMiddleware';

// // Get all users

// export const getUsers = async (req: Request, res: Response): Promise<void> => {
//     try {
//       // Optionally, you can log the authenticated user like this:
//     //   console.log('Authenticated User:', req?.user||"Not found");
  
//       const users = await getAllUsers();
//       res.json(users);
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         console.error('❌ Database query error:', error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//       } else {
//         console.error('❌ Unknown error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
//     }
//   };
  

// // Create a new user
// export const createUser = async (req: Request, res: Response): Promise<void> => {
//   const { username, name, email, password } = req.body;

//   if (!username || !name || !email || !password) {
//     res.status(400).json({ error: "Username, name, email, and password are required" });
//     return;
//   }

//   try {
//     const pool = await poolPromise;
//     if (!pool) {
//       res.status(500).json({ error: "Database connection failed" });
//       return;
//     }

//     // 🔍 Check if username already exists
//     const usernameExists = await checkUsername(username);
//     if (usernameExists) {
//       res.status(409).json({ error: "Username already taken" });
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await pool
//       .request()
//       .input("username", sql.NVarChar, username)
//       .input("name", sql.NVarChar, name)
//       .input("email", sql.NVarChar, email)
//       .input("password", sql.NVarChar, hashedPassword)
//       .query("INSERT INTO [dbo].[Users] (username, name, email, password) VALUES (@username, @name, @email, @password)");

//     res.status(201).json({ message: "User created successfully" });
//   } catch (error: any) {
//     if (error.number === 2627 || error.number === 2601) {
//       console.warn("⚠️ Duplicate email detected:", email);
//       res.status(400).json({ error: "Email already exists. Please use a different email." });
//     } else {
//       console.error("❌ Unexpected error while creating user:", error.message);
//       res.status(500).json({ error: error.message });
//     }
//   }
// };



// // Update an existing user
// export const updateUser = async (req: Request, res: Response): Promise<void> => {
//   const userId = parseInt(req.params.id); // Get user ID from URL parameter
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     res.status(400).json({ error: "Name, email, and password are required" });
//     return;
//   }

//   try {
//     const pool = await poolPromise;
//     if (!pool) {
//       res.status(500).json({ error: "Database connection failed" });
//       return;
//     }

//     console.log("Updating user with ID:", userId);

//     // ✅ Check if user exists before updating
//     const existingUser = await pool
//       .request()
//       .input("id", sql.Int, userId)
//       .query("SELECT id FROM [WorkSync].[dbo].[Users] WHERE id = @id");

//     if (existingUser.recordset.length === 0) {
//       res.status(404).json({ error: "User not found" });
//       return;
//     }

//     // ✅ Hash the new password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // ✅ Perform the update
//     const result = await pool
//       .request()
//       .input("id", sql.Int, userId)
//       .input("name", sql.NVarChar, name)
//       .input("email", sql.NVarChar, email)
//       .input("password", sql.NVarChar, hashedPassword)
//       .query(
//         "UPDATE [WorkSync].[dbo].[Users] SET name = @name, email = @email, password = @password WHERE id = @id"
//       );

//     console.log("Update result:", result);

//     if (result.rowsAffected[0] === 0) {
//       res.status(404).json({ error: "User not found or no changes made" });
//     } else {
//       res.status(200).json({ message: "User updated successfully" });
//     }
//   } catch (error) {
//     console.error("❌ Error updating user:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };



// // Login a user
// export const loginUser = async (req: Request, res: Response): Promise<void> => {
//   const { email, username, password }: { email?: string; username?: string; password: string } = req.body;

//   if ((!email && !username) || !password) {
//     res.status(400).json({ message: "Email or Username and password are required" });
//     return;
//   }

//   try {
//     const user = await getUserByEmailOrUsername(email, username);

//     if (!user) {
//       res.status(404).json({ message: "User does not exist" });
//       return;
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       res.status(401).json({ message: "Invalid credentials" });
//       return;
//     }

//     const token = jwt.sign(
//       { id: user.id, name: user.name, email: user.email, username: user.username },
//       "your_jwt_secret_key",
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({ 
//       message: "Login successful", 
//       user: { id: user.id, name: user.name, email: user.email, username: user.username }, 
//       token 
//     });
//   } catch (error: unknown) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };



// export const checkTokenValidity = (req: AuthenticatedRequest, res: Response): void => {
//   if (!req.user) {
//     res.status(401).json({ error: 'Invalid or expired token' });
//     return;
//   }
  
//   res.status(200).json({ message: 'Token is valid', user: req.user });
// };


// // Check if username is available
// export const getUsername = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { username } = req.body;

//     // If username is empty or just spaces, silently return without responding
//     if (!username || username.trim() === "") {
//       return;
//     }

//     const isUsernameTaken = await checkUsername(username);

//     if (isUsernameTaken) {
//       res.status(409).json({ error: "Username is already taken" });
//       return;
//     }

//     res.json({ message: "Username is available" });
//   } catch (error) {
//     console.error("❌ Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// // Send a new message
// export const sendMessageController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//   const receiverId = parseInt(req.params.receiverId); // <-- from URL
//   const { message } = req.body;
//   const senderId = req.user?.id;

//   if (!senderId || !receiverId || !message) {
//     res.status(400).json({ message: 'Sender ID, Receiver ID, and Message are required' });
//     return;
//   }

//   try {
//     await sendMessage(senderId, receiverId, message);
//     res.status(201).json({ message: 'Message sent successfully' });
//   } catch (error) {
//     console.error('Error sending message:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// // Get all messages
// export const getMessagesController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
//   const userId = req.user?.id; // The logged-in user (sender)
//   const chatWithUserId = parseInt(req.params.chatWithUserId); // The other user (receiver)

//   if (!userId || isNaN(chatWithUserId)) {
//     res.status(400).json({ message: 'Invalid user or chat ID' });
//     return;
//   }

//   try {
//     // Fetch messages between these two users
//     const messages = await getMessages(userId, chatWithUserId); // Update your model accordingly
//     res.status(200).json(messages);
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

import { Request, Response } from 'express';
import {
  checkUsername,
  getAllUsers,
  getMessages,
  getUserByEmailOrUsername,
  sendMessage
} from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

// Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error: unknown) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, name, email, password } = req.body;

  if (!username || !name || !email || !password) {
    res.status(400).json({ error: 'Username, name, email, and password are required' });
    return;
  }

  try {
    const usernameExists = await checkUsername(username);
    if (usernameExists) {
      res.status(409).json({ error: 'Username already taken' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { pool } = await import('../db');
    await pool.query(
      'INSERT INTO users (username, name, email, password) VALUES ($1, $2, $3, $4)',
      [username, name, email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error: any) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Email already exists. Please use a different email.' });
    } else {
      console.error('❌ Error creating user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

// Update an existing user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }

  try {
    const { pool } = await import('../db');

    const result = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4',
      [name, email, hashedPassword, userId]
    );

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, username, password }: { email?: string; username?: string; password: string } = req.body;

  if ((!email && !username) || !password) {
    res.status(400).json({ message: 'Email or Username and password are required' });
    return;
  }

  try {
    const user = await getUserByEmailOrUsername(email, username);
    if (!user) {
      res.status(404).json({ message: 'User does not exist' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, username: user.username },
      'your_jwt_secret_key',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, username: user.username },
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Token validity
export const checkTokenValidity = (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  res.status(200).json({ message: 'Token is valid', user: req.user });
};

// Check username
export const getUsername = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.body;

  if (!username || username.trim() === '') return;

  try {
    const isUsernameTaken = await checkUsername(username);

    if (isUsernameTaken) {
      res.status(409).json({ error: 'Username is already taken' });
      return;
    }

    res.json({ message: 'Username is available' });
  } catch (error) {
    console.error('❌ Error checking username:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Send message
export const sendMessageController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const receiverId = parseInt(req.params.receiverId);
  const { message } = req.body;
  const senderId = req.user?.id;

  if (!senderId || !receiverId || !message) {
    res.status(400).json({ message: 'Sender ID, Receiver ID, and Message are required' });
    return;
  }

  try {
    await sendMessage(senderId, receiverId, message);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get messages
export const getMessagesController = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const chatWithUserId = parseInt(req.params.chatWithUserId);

  if (!userId || isNaN(chatWithUserId)) {
    res.status(400).json({ message: 'Invalid user or chat ID' });
    return;
  }

  try {
    const messages = await getMessages(userId, chatWithUserId);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
