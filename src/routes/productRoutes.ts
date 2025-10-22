import express from 'express';
import { body } from 'express-validator';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from '../controllers/productController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Validation rules
const productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('image').notEmpty().withMessage('Product image is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

// Routes
router.get('/search', searchProducts);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, productValidation, createProduct);
router.put('/:id', authenticate, productValidation, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
