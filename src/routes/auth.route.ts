import express from 'express';
import { login, logout, signup } from '../controllers/auth.controller';

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

export default router;
