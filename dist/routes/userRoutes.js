"use strict";
// import { Router } from 'express';
// import { getUsers, createUser, updateUser, loginUser } from '../controllers/userController';
Object.defineProperty(exports, "__esModule", { value: true });
// const router = Router();
// router.get('/users', getUsers);  // Get all users
// router.post('/users', createUser);  // Create a new user
// router.put('/users/:userId', updateUser);  // Update an existing user
// router.post('/login', loginUser);  // Login user
// export default router;
var express_1 = require("express");
var userController_1 = require("../controllers/userController");
var verifyToken_1 = require("../api/middlewares/verifyToken");
var router = (0, express_1.Router)();
// Public Routes
router.post('/users', userController_1.createUser); // Create a new user
router.post('/login', userController_1.loginUser); // Login user
// Protected Routes (Require JWT Token)
router.get('/users', verifyToken_1.verifyToken, userController_1.getUsers); // Get all users (protected)
router.put('/users/:id', verifyToken_1.verifyToken, userController_1.updateUser); // Update user (protected)
exports.default = router;
