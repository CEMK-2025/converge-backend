import express from 'express';
import { login, signup } from '../controllers/auth.controller';

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

export default router;
