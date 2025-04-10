// import sql from "mssql";
// import dotenv from "dotenv";

// dotenv.config();

// const config: sql.config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER as string,
//   database: process.env.DB_DATABASE,
//   options: {
//     encrypt: true, // ✅ Required for Azure
//     trustServerCertificate: true, // ✅ Required for Azure
//   },
// };

// Changed because Azure subscription is getting expired after restore have to change back to below
// import sql from "mssql";
// import dotenv from "dotenv";

// dotenv.config();

// const config: sql.config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   server: process.env.DB_SERVER as string,
//   database: process.env.DB_DATABASE,
//   options: {
//     encrypt: true, // ✅ Required for Azure
//     trustServerCertificate: true, // ✅ Required for local SQL Server
//   },
// };

// let pool: sql.ConnectionPool | null = null;

// // Function to connect to the database
// export const connectToDatabase = async (): Promise<sql.ConnectionPool | null> => {
//   if (!pool) {
//     try {
//       pool = await sql.connect(config);
//       console.log("✅ Connected to SQL Server successfully!");
//     } catch (error) {
//       console.error("❌ Database connection failed:", error);
//       pool = null;
//     }
//   }
//   return pool;
// };

// // Export a pool promise for queries
// export const poolPromise = connectToDatabase();

// export { sql };

// db.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create a pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Needed for Neon
  },
});

// Optional connect function to test connection on startup
export const connectToDatabase = async (): Promise<Pool | null> => {
  try {
    await pool.query("SELECT 1"); // Ping test
    console.log("✅ Connected to Neon PostgreSQL successfully!");
    return pool;
  } catch (error) {
    console.error("❌ Failed to connect to Neon PostgreSQL:", error);
    return null;
  }
};

// Export pool for direct use
export { pool };
