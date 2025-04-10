// Changed because Azure subscription is getting expired after restore have to change back to below

// import express, { Application, Request, Response, NextFunction } from "express";
// import path from "path";
// import cors from "cors";  
// import { connectToDatabase, sql } from "../db";
// import userRoutes from "../routes/userRoutes";

// const app: Application = express();
// let pool: sql.ConnectionPool | null = null;

// // ✅ Define allowed origins dynamically
// const allowedOrigins = [
//   ...Array.from({ length: 11 }, (_, i) => `http://localhost:${3000 + i}`), // ✅ Allows 3000-3010
//   "https://worksync-front.vercel.app"
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     console.log("🔍 Incoming Origin:", origin);  // Debugging line
    
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       console.error("❌ CORS Blocked Origin:", origin);  // Debugging
//       callback(new Error("CORS not allowed"));
//     }
//   },
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true 
// }));



// // ✅ Handle Preflight Requests (for stricter browsers like Safari)
// app.options("*", (req, res) => {
//   res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.sendStatus(204);
// });

// // ✅ Middleware to set security headers (Fix `strict-origin-when-cross-origin` issue)
// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.header("Referrer-Policy", "no-referrer-when-downgrade");  // ✅ Adjust referrer policy
//   next();
// });

// app.use(express.json()); 
// app.use(express.static(path.join(__dirname, "public"))); 

// const initializeServer = async () => {
//   pool = await connectToDatabase();
//   if (!pool) {
//     console.error("❌ Failed to connect to the database. Exiting...");
//     process.exit(1);
//   }

//   // ✅ Use the user routes
//   app.use("/api", userRoutes);
//   app.use("/api/auth", userRoutes);

//   // ✅ Test Route for CORS Debugging
//   app.get("/test-cors", (req: Request, res: Response) => {
//     res.json({ message: "CORS is working" });
//   });

//   // ✅ Serve index.html at root
//   app.get("/", (req: Request, res: Response) => {
//     const filePath = path.join(__dirname, "public", "index.html");
//     console.log("Resolved path:", filePath);
//     res.sendFile(filePath);
//   });

//   // ✅ Start the server after DB connection
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`✅ Server running on http://localhost:${PORT}`);
//   });
// };

// // Initialize server
// initializeServer();
// app.ts or server.ts
import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import { connectToDatabase } from "../db"; // Updated import
import userRoutes from "../routes/userRoutes"; // Should still work with pg
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
let pool: any = null; // now using pg.Pool instance

// ✅ Define allowed origins dynamically
const allowedOrigins = [
  ...Array.from({ length: 11 }, (_, i) => `http://localhost:${3000 + i}`),
  "https://worksync-front.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    console.log("🔍 Incoming Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS Blocked Origin:", origin);
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ✅ Handle Preflight Requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  res.sendStatus(204);
});

// ✅ Referrer Policy Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Referrer-Policy", "no-referrer-when-downgrade");
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

  // ✅ CORS Test Route
  app.get("/test-cors", (req: Request, res: Response) => {
    res.json({ message: "CORS is working" });
  });

  // ✅ Serve index.html at root
  app.get("/", (req: Request, res: Response) => {
    const filePath = path.join(__dirname, "public", "index.html");
    console.log("Resolved path:", filePath);
    res.sendFile(filePath);
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
};

initializeServer();
