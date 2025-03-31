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


export const connectToDatabase = async () => {
  try {
    const pool = await sql.connect(config);
    console.log("✅ Connected to SQL Server successfully!");
    return pool;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return null;
  }
};

export { sql };
