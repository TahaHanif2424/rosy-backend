import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Admin from '../models/Admin';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
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

    const { email, password } = req.body;

    console.log('🔐 Admin login attempt:', email);

    // Find admin and include password
    const admin: any = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      console.log('❌ Admin not found:', email);
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    console.log('✅ Admin found:', admin.email);

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      console.log('❌ Invalid password for:', email);
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    console.log('✅ Password valid, generating token...');

    // Generate token
    const token = generateToken({
      id: String(admin._id),
      email: admin.email,
    });

    console.log('✅ Login successful for:', admin.name);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private
export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const admin = await Admin.findById(req.admin?.id);

    if (!admin) {
      res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          createdAt: admin.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
    });
  }
};
