import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/janu-collections';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@janucollections.com' });
    
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      
      // Update existing user to be admin
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log('✅ Updated existing user to admin');
    } else {
      // Create new admin user
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@janucollections.com',
        password: 'admin123', // This will be hashed automatically by the User model
        isAdmin: true
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
    }

    // Also make your existing user an admin if it exists
    const yourUser = await User.findOne({ email: 'vandanasagarika159@gmail.com' });
    if (yourUser) {
      yourUser.isAdmin = true;
      await yourUser.save();
      console.log('✅ Your user account is now admin');
    }

    console.log('\n🎉 Admin setup complete!');
    console.log('📧 Admin Email: admin@janucollections.com');
    console.log('🔑 Admin Password: admin123');
    console.log('📧 Your Email: vandanasagarika159@gmail.com (now admin)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
