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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var db_1 = require("../db"); // Import the function that connects to the database
var userRoutes_1 = __importDefault(require("../routes/userRoutes")); // Import user routes
var app = (0, express_1.default)(); // ✅ Explicitly type as Application
var pool = null;
app.use(express_1.default.json()); // Middleware to parse JSON requests
// Serve static files from the "public" directory, relative to `src/api`
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
// Connect to the database before starting the server
var initializeServer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var PORT;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, db_1.connectToDatabase)()];
            case 1:
                pool = _a.sent(); // Assign to the global pool variable
                if (!pool) {
                    console.error("❌ Failed to connect to the database. Exiting...");
                    process.exit(1); // Exit if the connection fails
                }
                // Use the user routes
                app.use("/api", userRoutes_1.default); // Register the user routes with a base path
                // Serve index.html at the root URL
                app.get("/", function (req, res) {
                    var filePath = path_1.default.join(__dirname, 'public', 'index.html');
                    console.log('Resolved path:', filePath); // Log the resolved path
                    res.sendFile(filePath); // Send the file
                });
                PORT = process.env.PORT || 3000;
                app.listen(PORT, function () {
                    console.log("\u2705 Server running on http://localhost:".concat(PORT));
                });
                return [2 /*return*/];
        }
    });
}); };
// Initialize the server
initializeServer();
