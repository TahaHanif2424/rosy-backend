import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/rosy-jewel-boutique',
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Validate required environment variables
if (!process.env.JWT_SECRET && config.nodeEnv === 'production') {
  console.warn('⚠️ WARNING: JWT_SECRET not set in production. Using default (not recommended)');
}
