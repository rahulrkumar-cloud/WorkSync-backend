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
exports.authenticateUser = exports.updateUserById = exports.createUser = exports.getUserByEmail = exports.getAllUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs")); // For password hashing and comparison
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // For JWT token generation
const db_1 = require("../db");
// Get all users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const pool = yield (0, db_1.connectToDatabase)();
    if (!pool)
        throw new Error("Database connection failed");
    const result = yield pool.request().query('SELECT * FROM Users');
    return result.recordset;
});
exports.getAllUsers = getAllUsers;
// Get user by email
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = yield (0, db_1.connectToDatabase)();
    if (!pool)
        throw new Error("Database connection failed");
    const result = yield pool.request()
        .input('email', db_1.sql.NVarChar, email)
        .query('SELECT * FROM Users WHERE email = @email');
    return result.recordset[0] || null;
});
exports.getUserByEmail = getUserByEmail;
// Create a new user
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = yield (0, db_1.connectToDatabase)();
    if (!pool)
        throw new Error("Database connection failed");
    // Hash the password before saving it to the database
    const hashedPassword = yield bcryptjs_1.default.hash(user.password, 10);
    yield pool.request()
        .input('name', db_1.sql.NVarChar, user.name)
        .input('email', db_1.sql.NVarChar, user.email)
        .input('password', db_1.sql.NVarChar, hashedPassword)
        .query('INSERT INTO Users (name, email, password) VALUES (@name, @email, @password)');
});
exports.createUser = createUser;
// Update a user's details by ID
const updateUserById = (userId, name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = yield (0, db_1.connectToDatabase)();
    if (!pool)
        throw new Error("Database connection failed");
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10); // You should hash the password before saving
    const result = yield pool.request()
        .input('id', db_1.sql.Int, userId)
        .input('name', db_1.sql.NVarChar, name)
        .input('email', db_1.sql.NVarChar, email)
        .input('password', db_1.sql.NVarChar, hashedPassword)
        .query('UPDATE Users SET name = @name, email = @email, password = @password WHERE id = @id');
    if (result.rowsAffected[0] === 0) {
        return null;
    }
    return { id: userId, name, email, password: hashedPassword };
});
exports.updateUserById = updateUserById;
// Authenticate user and return a token
const authenticateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = yield (0, db_1.connectToDatabase)();
    if (!pool)
        throw new Error("Database connection failed");
    const result = yield pool.request()
        .input('email', db_1.sql.NVarChar, email)
        .query('SELECT * FROM Users WHERE email = @email');
    const user = result.recordset[0];
    if (!user) {
        return null; // User not found
    }
    // Compare the entered password with the stored hashed password
    const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return null; // Invalid password
    }
    // Create a JWT token
    const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email }, 'your_jwt_secret_key', // Secret key to sign the JWT (you should store this in environment variables)
    { expiresIn: '1h' } // Token expiration time
    );
    return token;
});
exports.authenticateUser = authenticateUser;
