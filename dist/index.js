"use strict";
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
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const app = (0, express_1.default)();
app.use(express_1.default.json());
let pool = null;
// Connect to the database before starting the server
const initializeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    pool = yield (0, db_1.connectToDatabase)();
    if (!pool) {
        console.error("❌ Failed to connect to the database. Exiting...");
        process.exit(1);
    }
    // Routes
    app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!pool)
                throw new Error("Database not connected");
            const result = yield pool.request().query("SELECT * FROM Users"); // Adjust table name
            res.json(result.recordset);
        }
        catch (error) {
            console.error("❌ Database query error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }));
    // Start server after DB connection is established
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
});
initializeServer();
