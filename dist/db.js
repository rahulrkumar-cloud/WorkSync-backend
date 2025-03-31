"use strict";
// import sql from "mssql";
// import dotenv from "dotenv";
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
exports.sql = exports.connectToDatabase = void 0;
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
const mssql_1 = __importDefault(require("mssql"));
exports.sql = mssql_1.default;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // ✅ Required for Azure
        trustServerCertificate: true, // ✅ Required for Azure
    },
};
let pool = null;
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!pool) {
        try {
            pool = yield mssql_1.default.connect(config);
            console.log("✅ Connected to SQL Server successfully!");
        }
        catch (error) {
            console.error("❌ Database connection failed:", error);
            pool = null;
        }
    }
    return pool;
});
exports.connectToDatabase = connectToDatabase;
