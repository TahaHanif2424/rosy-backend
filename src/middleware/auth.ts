import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('🔐 Authentication middleware - Start');
    const authHeader = req.headers.authorization;
    console.log('🔐 Auth header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid auth header');
      res.status(401).json({
        success: false,
        message: 'No token provided. Please login to continue.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    console.log('🔐 Token extracted (first 20 chars):', token.substring(0, 20) + '...');

    try {
      const decoded = verifyToken(token);
      console.log('✅ Token verified, admin:', decoded.email);
      req.admin = decoded;
      next();
    } catch (error) {
      console.log('❌ Token verification failed:', error instanceof Error ? error.message : 'Unknown error');
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please login again.',
      });
      return;
    }
  } catch (error) {
    console.error('❌ Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
    return;
  }
};
