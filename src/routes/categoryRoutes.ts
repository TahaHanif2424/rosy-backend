import express from 'express';
import { body } from 'express-validator';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Validation rules
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Description cannot exceed 200 characters'),
];

// Routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticate, categoryValidation, createCategory);
router.put('/:id', authenticate, categoryValidation, updateCategory);
router.delete('/:id', authenticate, deleteCategory);

export default router;
