// import express, { Application, Request, Response } from "express";
// import bcrypt from "bcryptjs";
// import { connectToDatabase, sql } from "../db";

// const app: Application = express(); // ✅ Explicitly type as Application

// app.use(express.json());
// let pool: sql.ConnectionPool | null = null;

// // Connect to the database before starting the server
// const initializeServer = async () => {
//   pool = await connectToDatabase();
//   if (!pool) {
//     console.error("❌ Failed to connect to the database. Exiting...");
//     process.exit(1);
//   }

//   // GET all users
//   app.get("/users", async (req: Request, res: Response) => {
//     try {
//       if (!pool) throw new Error("Database not connected");
//       const result = await pool.request().query("SELECT * FROM Users");
//       res.json(result.recordset);
//     } catch (error) {
//       console.error("❌ Database query error:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });

//   // POST: Create a new user
//   app.post("/users", async (req: Request, res: Response): Promise<void> => {
//     try {
//       if (!pool) {
//         res.status(500).json({ error: "Database not connected" });
//         return;
//       }

//       const { name, email, password } = req.body;

//       if (!name || !email || !password) {
//         res.status(400).json({ error: "Name, email, and password are required" });
//         return;
//       }

//       // Check if the email already exists
//       const existingUser = await pool
//         .request()
//         .input("email", sql.NVarChar, email)
//         .query("SELECT * FROM Users WHERE email = @email");

//       if (existingUser.recordset.length > 0) {
//         res.status(400).json({ error: "Email already exists. Please use another email." });
//         return;
//       }

//       // Hash password and insert new user
//       const hashedPassword = await bcrypt.hash(password, 10);


//       await pool
//         .request()
//         .input("name", sql.NVarChar, name)
//         .input("email", sql.NVarChar, email)
//         .input("password", sql.NVarChar, hashedPassword)
//         .query("INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)");


//       res.status(201).json({ message: "User created successfully" });
//     } catch (error) {
//       console.error("❌ Error creating user:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   });




//   // Start server after DB connection is established
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`✅ Server running on http://localhost:${PORT}`);
//   });
// };

// // Initialize the server
// initializeServer();

// import express, { Application } from "express";
// import { connectToDatabase, sql } from "../db"; // Import the function that connects to the database
// import userRoutes from "../routes/userRoutes"; // Import user routes

// const app: Application = express(); // ✅ Explicitly type as Application

// // This pool will be accessible throughout the app
// let pool: sql.ConnectionPool | null = null;
// console.log("Runinggggggggggggggg")

// app.use(express.json()); // Middleware to parse JSON requests

// // Connect to the database before starting the server
// const initializeServer = async () => {
//   console.log("Attempting to connect to the database...");
//   pool = await connectToDatabase();
//   if (!pool) {
//     console.error("❌ Failed to connect to the database. Exiting...");
//     process.exit(1);
//   }
//   console.log("Database connected successfully!");
  
//   // Register routes
//   app.use("/api", userRoutes);

//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`✅ Server running on http://localhost:${PORT}`);
//   });
// };


// // Initialize the server
// initializeServer();

import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";  
import { connectToDatabase, sql } from "../db";
import userRoutes from "../routes/userRoutes";

const app: Application = express();
let pool: sql.ConnectionPool | null = null;

// ✅ Define allowed origins dynamically
const allowedOrigins = [
  ...Array.from({ length: 11 }, (_, i) => `http://localhost:${3000 + i}`), // ✅ Allows 3000-3010
  "https://worksync-front.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    console.log("🔍 Incoming Origin:", origin);  // Debugging line
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS Blocked Origin:", origin);  // Debugging
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true 
}));



// ✅ Handle Preflight Requests (for stricter browsers like Safari)
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

// ✅ Middleware to set security headers (Fix `strict-origin-when-cross-origin` issue)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Referrer-Policy", "no-referrer-when-downgrade");  // ✅ Adjust referrer policy
  next();
});

app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public"))); 

const initializeServer = async () => {
  pool = await connectToDatabase();
  if (!pool) {
    console.error("❌ Failed to connect to the database. Exiting...");
    process.exit(1);
  }

  // ✅ Use the user routes
  app.use("/api", userRoutes);
  app.use("/api/auth", userRoutes);

  // ✅ Test Route for CORS Debugging
  app.get("/test-cors", (req: Request, res: Response) => {
    res.json({ message: "CORS is working" });
  });

  // ✅ Serve index.html at root
  app.get("/", (req: Request, res: Response) => {
    const filePath = path.join(__dirname, "public", "index.html");
    console.log("Resolved path:", filePath);
    res.sendFile(filePath);
  });

  // ✅ Start the server after DB connection
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
};

// Initialize server
initializeServer();
