import express from 'express';
import { login, register, logout, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/me', protect, getCurrentUser);

export default router;