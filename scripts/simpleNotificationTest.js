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

async function testNotifications() {
  try {
    console.log('🧪 Testing Notification System...\n');

    // Sample order and user data
    const sampleOrder = {
      _id: 'test-order-123',
      createdAt: new Date(),
      totalAmount: 1599,
      shippingCost: 99,
      items: [
        {
          name: 'Beautiful Kurti',
          size: 'M',
          price: 1500,
          quantity: 1,
        }
      ],
      shippingInfo: {
        fullName: 'Test Customer',
        address: '123 Test Street, Test Colony',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        phone: '+919876543210',
      }
    };

    const sampleUser = {
      name: 'Test Customer',
      email: 'testcustomer@example.com',
    };

    console.log('1. Testing Email Notification...');
    const emailResult = await notificationService.sendEmail(
      sampleUser.email,
      'Order Confirmed - Janu Collections',
      '<h1>Test Email</h1><p>Your order has been confirmed!</p>'
    );
    console.log('   Email result:', emailResult ? '✅ Sent' : '❌ Failed');

    console.log('\n2. Testing SMS Notification...');
    const smsResult = await notificationService.sendSMS(
      sampleOrder.shippingInfo.phone,
      'Hi Test Customer! Your order has been confirmed. Thank you for choosing Janu Collections!'
    );
    console.log('   SMS result:', smsResult ? '✅ Sent' : '❌ Failed');

    console.log('\n3. Testing WhatsApp Notification...');
    const whatsappResult = await notificationService.sendWhatsApp(
      sampleOrder.shippingInfo.phone,
      'Hi Test Customer! 🎉\n\nYour order has been *CONFIRMED*!\n\nThank you for choosing Janu Collections! 💫'
    );
    console.log('   WhatsApp result:', whatsappResult ? '✅ Sent' : '❌ Failed');

    console.log('\n4. Testing Complete Order Confirmation...');
    const notificationResults = await notificationService.sendOrderConfirmationNotifications(
      sampleOrder,
      sampleUser
    );
    console.log('   Complete notification results:', notificationResults);

    console.log('\n📬 Notification Summary:');
    console.log('   Email:', notificationResults.email ? '✅ Sent' : '❌ Not configured');
    console.log('   SMS:', notificationResults.sms ? '✅ Sent' : '❌ Not configured');
    console.log('   WhatsApp:', notificationResults.whatsapp ? '✅ Sent' : '❌ Not configured');

    console.log('\n🎉 Notification test completed!');
    console.log('\n💡 To receive actual notifications:');
    console.log('   1. Set up SendGrid API key for emails');
    console.log('   2. Set up Twilio credentials for SMS/WhatsApp');
    console.log('   3. Add the credentials to your .env file');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

testNotifications(); 