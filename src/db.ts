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


import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // ✅ Required for Azure
    trustServerCertificate: true, // ✅ Required for Azure
  },
};

let pool: sql.ConnectionPool | null = null;

export const connectToDatabase = async (): Promise<sql.ConnectionPool | null> => {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log("✅ Connected to SQL Server successfully!");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      pool = null;
    }
  }
  return pool;
};

export { sql };
