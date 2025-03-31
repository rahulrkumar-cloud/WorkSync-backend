import express, { Application, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { connectToDatabase, sql } from "../db";

const app: Application = express(); // ✅ Explicitly type as Application

app.use(express.json());
let pool: sql.ConnectionPool | null = null;

// Connect to the database before starting the server
const initializeServer = async () => {
  pool = await connectToDatabase();
  if (!pool) {
    console.error("❌ Failed to connect to the database. Exiting...");
    process.exit(1);
  }

  // GET all users
  app.get("/users", async (req: Request, res: Response) => {
    try {
      if (!pool) throw new Error("Database not connected");
      const result = await pool.request().query("SELECT * FROM Users");
      res.json(result.recordset);
    } catch (error) {
      console.error("❌ Database query error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // POST: Create a new user
  app.post("/users", async (req: Request, res: Response): Promise<void> => {
    try {
      if (!pool) {
        res.status(500).json({ error: "Database not connected" });
        return;
      }

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ error: "Name, email, and password are required" });
        return;
      }

      // Check if the email already exists
      const existingUser = await pool
        .request()
        .input("email", sql.NVarChar, email)
        .query("SELECT * FROM Users WHERE email = @email");

      if (existingUser.recordset.length > 0) {
        res.status(400).json({ error: "Email already exists. Please use another email." });
        return;
      }

      // Hash password and insert new user
      const hashedPassword = await bcrypt.hash(password, 10);

      // await pool
      //   .request()
      //   .input("name", sql.NVarChar, name)
      //   .input("email", sql.NVarChar, email)
      //   .input("password", sql.NVarChar, hashedPassword)
      //   .query("INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)");

      await pool
        .request()
        .input("name", sql.NVarChar, name)
        .input("email", sql.NVarChar, email)
        .input("password", sql.NVarChar, hashedPassword)
        .query("INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)");


      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("❌ Error creating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });




  // Start server after DB connection is established
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
};

// Initialize the server
initializeServer();
