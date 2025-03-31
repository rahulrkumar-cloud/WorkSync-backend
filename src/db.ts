import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig: sql.config = {
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  server: process.env.DB_SERVER || "",
  database: process.env.DB_DATABASE || "",
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false, // Set to true if using Azure SQL
    trustServerCertificate: true, // Required for local development
  },
};

const connectToDatabase = async (): Promise<sql.ConnectionPool | null> => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("✅ Connected to SQL Server successfully!");
    return pool;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return null;
  }
};

export { connectToDatabase, sql };
