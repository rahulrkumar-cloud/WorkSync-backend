// import { Router } from 'express';
// import { getUsers, createUser, updateUser, loginUser } from '../controllers/userController';

// const router = Router();

// router.get('/users', getUsers);  // Get all users
// router.post('/users', createUser);  // Create a new user
// router.put('/users/:userId', updateUser);  // Update an existing user
// router.post('/login', loginUser);  // Login user

// export default router;


import { Router } from 'express';
import { getUsers, createUser, updateUser, loginUser, checkTokenValidity, getUsername, sendMessageController, getMessagesController } from '../controllers/userController';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

// Public Routes
router.post('/users', createUser);  // Create a new user
router.post('/login', loginUser);  // Login user
router.post("/username", getUsername); //check username

// Protected Routes (Require JWT Token)
router.get('/users', verifyToken, getUsers);  // Get all users (protected)
router.put('/users/:id', verifyToken, updateUser);  // Update user (protected)

router.get('/check-token', verifyToken, checkTokenValidity);

// Protected Routes (Authenticated User Only)
router.post('/messages/send/:receiverId', verifyToken, sendMessageController);
router.get("/messages/:chatWithUserId", verifyToken, getMessagesController);// Get Messages

export default router;
