"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
/// <reference path="../../types/express.d.ts" />
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var verifyToken = function (req, res, next) {
    var _a;
    var token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''); // Extract token from Authorization header
    if (!token) {
        res.status(403).json({ error: 'Access denied, no token provided' });
        return; // Make sure to return after sending the response
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(token, 'your_jwt_secret_key'); // Cast the decoded payload
        // Only attach the required fields, not the password
        req.user = {
            id: decoded.id, // If the id is a string, you can convert it to a number here if needed
            name: decoded.name,
            email: decoded.email,
            password: '' // Optional: you can omit the password for security reasons
        };
        next(); // Continue to the next middleware or route handler
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.verifyToken = verifyToken;
