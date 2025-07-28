import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/janu-collections';

const adminEmail = 'jhansi.vandana1@gmail.com';
const adminPassword = 'Janu@123';
const adminName = 'Admin';

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email: adminEmail });
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (user) {
      user.password = hashedPassword;
      user.isAdmin = true;
      user.name = adminName;
      await user.save();
      console.log('Admin user updated successfully');
    } else {
      await User.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });
      console.log('Admin user created successfully');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin(); 