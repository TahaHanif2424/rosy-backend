import dotenv from 'dotenv';
// Load environment variables FIRST before any other imports
dotenv.config();

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { connectDatabase } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';
import adminRoutes from './routes/adminRoutes';
import orderRoutes from './routes/orderRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';

const app: Application = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet()); // Security headers

// CORS Configuration - Allow frontend domains
const allowedOrigins = [
  'http://localhost:8080',                        // Local development
  'http://localhost:5173',                        // Vite default port
  'https://rosy-jewel-boutique.vercel.app',      // Production Vercel deployment
  'https://rosy-backend-3.onrender.com',         // Backend URL (for testing)
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(limiter); // Apply rate limiting

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PRETTY PICKED BY SHIZA API',
    version: '1.0.0',
  });
});

app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Error handling
app.use(notFound); // 404 handler
app.use(errorHandler); // Error handler

// Start server
const PORT = config.port;

const startServer = async () => {
  try {
    // Connect to MongoDB before starting the server
    await connectDatabase();

    app.listen(PORT, () => {
      console.log('Server is running');
      console.log(`Port: ${PORT}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`Started at: ${new Date().toLocaleString()}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
