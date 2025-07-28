import mongoose from 'mongoose';
import dotenv from 'dotenv';
import notificationService from '../services/notificationService.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack-app')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Sample order and user data for testing
const sampleOrder = {
  _id: 'test-order-123',
  createdAt: new Date(),
  totalAmount: 1299,
  shippingCost: 99,
  items: [
    {
      name: 'Printed Cotton Saree',
      size: 'Free Size',
      price: 799,
      quantity: 1,
    },
    {
      name: 'Embroidered Kurti',
      size: 'M',
      price: 499,
      quantity: 1,
    }
  ],
  shippingInfo: {
    fullName: 'Test User',
    address: '123 Test Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    phone: '+919876543210',
  }
};

const sampleUser = {
  name: 'Test User',
  email: 'test@example.com',
};

async function testNotifications() {
  try {
    console.log('Testing notification service...');
    
    // Test email notification
    console.log('\n1. Testing Email Notification:');
    const emailResult = await notificationService.sendEmail(
      sampleUser.email,
      'Test Email - Janu Collections',
      '<h1>Test Email</h1><p>This is a test email from Janu Collections.</p>'
    );
    console.log('Email result:', emailResult);
    
    // Test SMS notification
    console.log('\n2. Testing SMS Notification:');
    const smsResult = await notificationService.sendSMS(
      sampleOrder.shippingInfo.phone,
      'Test SMS from Janu Collections - Your order has been confirmed!'
    );
    console.log('SMS result:', smsResult);
    
    // Test WhatsApp notification
    console.log('\n3. Testing WhatsApp Notification:');
    const whatsappResult = await notificationService.sendWhatsApp(
      sampleOrder.shippingInfo.phone,
      'Test WhatsApp message from Janu Collections! 🎉'
    );
    console.log('WhatsApp result:', whatsappResult);
    
    // Test complete order confirmation
    console.log('\n4. Testing Complete Order Confirmation:');
    const notificationResults = await notificationService.sendOrderConfirmationNotifications(
      sampleOrder,
      sampleUser
    );
    console.log('Complete notification results:', notificationResults);
    
    console.log('\n✅ Notification testing completed!');
    console.log('\nNote: If notifications are not configured, you will see console logs instead of actual messages.');
    
  } catch (error) {
    console.error('Error testing notifications:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

testNotifications(); 