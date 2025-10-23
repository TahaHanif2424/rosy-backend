import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Category from '../models/Category';
import Product from '../models/Product';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log('📁 Fetching all categories...');
    const categories = await Category.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${categories.length} categories`);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error('❌ Get all categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
    });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        category,
      },
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
    });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (
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

    const { name, description, image } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });

    if (existingCategory) {
      res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
      return;
    }

    const category = await Category.create({
      name,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        category,
      },
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (
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

    const { name, description, image } = req.body;

    // Check if another category with same name exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: req.params.id },
    });

    if (existingCategory) {
      res.status(400).json({
        success: false,
        message: 'Category name already exists',
      });
      return;
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, image },
      { new: true, runValidators: true }
    );

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: {
        category,
      },
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if category has products
    const productsCount = await Product.countDocuments({
      category: req.params.id,
    });

    if (productsCount > 0) {
      res.status(400).json({
        success: false,
        message: `Cannot delete category. ${productsCount} product(s) are using this category.`,
      });
      return;
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
    });
  }
};
