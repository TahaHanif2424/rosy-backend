import express from 'express';
import { body } from 'express-validator';
import { login, getProfile } from '../controllers/adminController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/login', loginValidation, login);
router.get('/profile', authenticate, getProfile);

export default router;
