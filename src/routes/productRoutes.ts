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
  body('image')
    .custom((value) => {
      // Accept both string and array of strings
      if (typeof value === 'string' && value.length > 0) return true;
      if (Array.isArray(value) && value.length > 0 && value.every((item: any) => typeof item === 'string')) return true;
      throw new Error('Image must be a valid URL string or array of URL strings');
    }),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be a boolean value'),
];

// Logging middleware for debugging
const logProductRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log('📥 Product Request:', {
    method: req.method,
    path: req.path,
    body: req.body,
    headers: {
      'content-type': req.headers['content-type'],
      'authorization': req.headers.authorization ? 'Bearer [PRESENT]' : 'MISSING',
    }
  });
  next();
};

// Routes
router.get('/search', searchProducts);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', logProductRequest, authenticate, productValidation, createProduct);
router.put('/:id', logProductRequest, authenticate, productValidation, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

export default router;
