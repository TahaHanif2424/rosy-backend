import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Product from '../models/Product';
import Category from '../models/Category';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    console.log('📦 Fetching all products...');
    console.log('Filter:', filter);

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${products.length} products`);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('❌ Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
    });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category',
      'name slug'
    );

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log('🔧 CREATE PRODUCT - Start');
    console.log('🔧 Request body:', JSON.stringify(req.body, null, 2));
    console.log('🔧 Request body types:', {
      name: typeof req.body.name,
      category: typeof req.body.category,
      price: typeof req.body.price,
      image: typeof req.body.image,
      description: typeof req.body.description,
      inStock: typeof req.body.inStock,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', JSON.stringify(errors.array(), null, 2));
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    console.log('✅ Validation passed');
    const { name, category, price, image, description, inStock } = req.body;
    console.log('🔧 Extracted fields:', { name, category, price, image, description, inStock });

    // Verify category exists
    console.log('🔧 Checking if category exists:', category);
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      console.log('❌ Category not found:', category);
      res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      });
      return;
    }
    console.log('✅ Category exists:', categoryExists.name);

    const productData = {
      name,
      category,
      price,
      image,
      description,
      inStock: inStock !== undefined ? inStock : true,
    };
    console.log('🔧 Creating product with data:', productData);

    const product = await Product.create(productData);
    console.log('✅ Product created:', product._id);

    // Populate category before sending response
    await product.populate('category', 'name slug');
    console.log('✅ Product populated with category');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: {
        product,
      },
    });
    console.log('✅ Response sent successfully');
  } catch (error) {
    console.error('❌ Create product error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { name, category, price, image, description, inStock } = req.body;

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      });
      return;
    }

    const updateData: any = { name, category, price, image, description };
    if (inStock !== undefined) {
      updateData.inStock = inStock;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: {
        product,
      },
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
    });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
      return;
    }

    // Create a regex pattern that matches even a single word
    const searchRegex = new RegExp(q.trim(), 'i');

    // Search in product name, description, and category name
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
      ],
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(20);

    // Also search by category name
    const categoryProducts = await Product.find()
      .populate({
        path: 'category',
        match: { name: searchRegex },
        select: 'name slug',
      })
      .sort({ createdAt: -1 });

    // Filter out products where category is null (didn't match)
    const matchedCategoryProducts = categoryProducts.filter(
      (p) => p.category !== null
    );

    // Combine results and remove duplicates
    const allProducts = [...products];
    matchedCategoryProducts.forEach((cp) => {
      if (!allProducts.find((p) => p._id.toString() === cp._id.toString())) {
        allProducts.push(cp);
      }
    });

    res.status(200).json({
      success: true,
      count: allProducts.length,
      data: allProducts.slice(0, 20),
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
    });
  }
};
