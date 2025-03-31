import express from "express";
import { connectToDatabase, sql } from "../db";

const app = express();
app.use(express.json());

let pool: sql.ConnectionPool | null = null;

// Connect to the database before starting the server
const initializeServer = async () => {
  pool = await connectToDatabase();
  if (!pool) {
    console.error("❌ Failed to connect to the database. Exiting...");
    process.exit(1);
  }

  // Routes
  app.get("/users", async (req, res) => {
    try {
      if (!pool) throw new Error("Database not connected");
      const result = await pool.request().query("SELECT * FROM Users"); // Adjust table name
      res.json(result.recordset);
    } catch (error) {
      console.error("❌ Database query error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Start server after DB connection is established
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
};

initializeServer();
