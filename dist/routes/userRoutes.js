"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.get('/users', userController_1.getUsers); // Get all users
router.post('/users', userController_1.createUser); // Create a new user
router.put('/users/:userId', userController_1.updateUser); // Update an existing user
router.post('/login', userController_1.loginUser); // Login user
exports.default = router;
// import { Router } from 'express';
// import { getUsers, createUser, updateUser, loginUser } from '../controllers/userController';
// import { verifyToken } from '../api/middlewares/verifyToken';
// const router = Router();
// // Public Routes
// router.post('/users', createUser);  // Create a new user
// router.post('/login', loginUser);  // Login user
// // Protected Routes (Require JWT Token)
// router.get('/users', verifyToken, getUsers);  // Get all users (protected)
// router.put('/users/:userId', verifyToken, updateUser);  // Update user (protected)
// export default router;
