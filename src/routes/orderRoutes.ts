import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Validation rules
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must have at least one item'),
  body('items.*.id').notEmpty().withMessage('Item ID is required'),
  body('items.*.name').notEmpty().withMessage('Item name is required'),
  body('items.*.category').notEmpty().withMessage('Item category is required'),
  body('items.*.price')
    .isFloat({ min: 0 })
    .withMessage('Item price must be a positive number'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Item quantity must be at least 1'),
  body('items.*.image')
    .custom((value) => {
      // Accept both string and array of strings
      if (typeof value === 'string' && value.length > 0) return true;
      if (Array.isArray(value) && value.length > 0 && value.every((item: any) => typeof item === 'string')) return true;
      throw new Error('Image must be a valid URL string or array of URL strings');
    }),
  body('items.*.description').notEmpty().withMessage('Item description is required'),
  body('total')
    .isFloat({ min: 0 })
    .withMessage('Total must be a positive number'),
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('contactNumber')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
];

// Routes
router.post('/', createOrderValidation, createOrder);
router.get('/', authenticate, getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.patch('/:id/status', authenticate, updateOrderStatus);
router.delete('/:id', authenticate, deleteOrder);

export default router;
