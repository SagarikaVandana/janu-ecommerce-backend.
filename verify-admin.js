import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const verifyAdminAccess = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/janu-collections';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find all admin users
    const adminUsers = await User.find({ isAdmin: true });
    console.log('\n👑 Current Admin Users:');
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found');
      
      // Create a simple admin user
      const simpleAdmin = new User({
        name: 'Admin',
        email: 'admin@test.com',
        password: 'admin123',
        isAdmin: true
      });
      
      await simpleAdmin.save();
      console.log('✅ Created simple admin user:');
      console.log('📧 Email: admin@test.com');
      console.log('🔑 Password: admin123');
    } else {
      adminUsers.forEach((admin, index) => {
        console.log(`${index + 1}. Name: ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Admin: ${admin.isAdmin}`);
        console.log('');
      });
    }

    // Also check your specific user
    const yourUser = await User.findOne({ email: 'vandanasagarika159@gmail.com' });
    if (yourUser) {
      console.log('👤 Your Account Status:');
      console.log(`   Name: ${yourUser.name}`);
      console.log(`   Email: ${yourUser.email}`);
      console.log(`   Admin: ${yourUser.isAdmin}`);
      
      if (!yourUser.isAdmin) {
        yourUser.isAdmin = true;
        await yourUser.save();
        console.log('✅ Updated your account to admin');
      }
    }

    console.log('\n🎯 To access admin dashboard:');
    console.log('1. Login at: http://localhost:3000/login');
    console.log('2. Use any of the admin emails listed above');
    console.log('3. Navigate to: http://localhost:3000/admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

verifyAdminAccess();
