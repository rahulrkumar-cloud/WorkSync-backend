"use strict";
// import express, { Application, Request, Response } from "express";
// import bcrypt from "bcryptjs";
// import { connectToDatabase, sql } from "../db";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../db"); // Import the function that connects to the database
const userRoutes_1 = __importDefault(require("../routes/userRoutes")); // Import user routes
const app = (0, express_1.default)(); // ✅ Explicitly type as Application
let pool = null;
app.use(express_1.default.json()); // Middleware to parse JSON requests
// Serve static files from the "public" directory, relative to `src/api`
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Connect to the database before starting the server
const initializeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    pool = yield (0, db_1.connectToDatabase)(); // Assign to the global pool variable
    if (!pool) {
        console.error("❌ Failed to connect to the database. Exiting...");
        process.exit(1); // Exit if the connection fails
    }
    // Use the user routes
    app.use("/api", userRoutes_1.default); // Register the user routes with a base path
    // Serve index.html at the root URL
    app.get("/", (req, res) => {
        const filePath = path_1.default.join(__dirname, 'public', 'index.html');
        console.log('Resolved path:', filePath); // Log the resolved path
        res.sendFile(filePath); // Send the file
    });
    // Start the server after DB connection is established
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
});
// Initialize the server
initializeServer();
