import mongoose from 'mongoose';
import Admin from '../models/Admin';
import { config } from '../config/env';

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@startup.com' });

    if (existingAdmin) {
      console.log('⚠️  Admin already exists');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create hardcoded admin
    const admin = await Admin.create({
      name: 'Admin',
      email: 'admin@startup.com',
      password: 'shahzil123*', // This will be automatically hashed by the model's pre-save hook
    });

    console.log('✅ Admin created successfully');
    console.log('📧 Email: admin@startup.com');
    console.log('🔑 Password: shahzil123*');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
