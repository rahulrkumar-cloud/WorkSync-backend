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
exports.loginUser = exports.updateUser = exports.createUser = exports.getUsers = void 0;
const userModel_1 = require("../models/userModel"); // Import your model methods
const userService_1 = require("../services/userService"); // User registration logic
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // For generating the JWT token
// Get all users
// export const getUsers = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const users = await getAllUsers();
//     res.json(users);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error('❌ Database query error:', error.message);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       console.error('❌ Unknown error:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }
// };
// src/controllers/userController.ts
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Optionally, you can log the authenticated user like this:
        //   console.log('Authenticated User:', req?.user||"Not found");
        const users = yield (0, userModel_1.getAllUsers)();
        res.json(users);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('❌ Database query error:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        else {
            console.error('❌ Unknown error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.getUsers = getUsers;
// Create a new user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ error: 'Name, email, and password are required' });
        return;
    }
    try {
        yield (0, userService_1.registerUser)(name, email, password);
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('❌ Error creating user:', error.message);
            res.status(400).json({ error: error.message });
        }
        else {
            console.error('❌ Unknown error:', error);
            res.status(400).json({ error: 'Error creating user' });
        }
    }
});
exports.createUser = createUser;
// Update an existing user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.id); // Get user ID from URL parameter
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ error: 'Name, email, and password are required' });
        return;
    }
    try {
        const updatedUser = yield (0, userModel_1.updateUserById)(userId, name, email, password);
        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' });
        }
        else {
            res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('❌ Error updating user:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        else {
            console.error('❌ Unknown error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.updateUser = updateUser;
// Login a user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    try {
        const user = yield (0, userModel_1.getUserByEmail)(email); // Get user by email
        if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
            // Password match, generate JWT token
            const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email }, 'your_jwt_secret_key', // Secret key for signing the token
            { expiresIn: '1h' } // Set the expiration time (optional)
            );
            res.status(200).json({ message: 'Login successful', token }); // Send the token to the user
        }
        else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('❌ Error logging in:', error.message);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        else {
            console.error('❌ Unknown error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
exports.loginUser = loginUser;
