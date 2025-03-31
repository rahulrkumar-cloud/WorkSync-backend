"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
// src/api/middlewares/verifyToken.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''); // Extract token from Authorization header
    if (!token) {
        return res.status(403).json({ error: 'Access denied, no token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, 'your_jwt_secret_key'); // Verify the token and type cast to JwtPayload
        // Attach the decoded user information to the request object
        req.user = decoded;
        next(); // Continue to the next middleware or route handler
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.verifyToken = verifyToken;
