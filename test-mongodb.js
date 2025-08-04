#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing MongoDB Connection...');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('MONGODB_URI set:', !!process.env.MONGODB_URI);

if (process.env.MONGODB_URI) {
  console.log('Connection string type:', process.env.MONGODB_URI.startsWith('mongodb+srv') ? 'Atlas' : 'Local');
}

async function testConnection() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.log('⚠️ No MONGODB_URI found, testing local connection...');
      await mongoose.connect('mongodb://localhost:27017/test');
    } else {
      console.log('🔗 Connecting to MongoDB...');
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
    }
    
    console.log('✅ MongoDB connection successful!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🔗 Host:', mongoose.connection.host);
    console.log('🔗 Port:', mongoose.connection.port);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections found:', collections.length);
    
    await mongoose.disconnect();
    console.log('✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Solution:');
      console.error('1. For local development: Start MongoDB with "mongod"');
      console.error('2. For production: Set MONGODB_URI with Atlas connection string');
    } else if (error.message.includes('Authentication failed')) {
      console.error('💡 Solution: Check username/password in connection string');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Solution: Check cluster URL in connection string');
    }
    
    process.exit(1);
  }
}

testConnection(); 