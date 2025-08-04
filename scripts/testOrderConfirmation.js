import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';

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

async function testOrderConfirmation() {
  try {
    console.log('🧪 Testing Order Confirmation Notifications...\n');

    // Step 1: Create a test user
    console.log('1. Creating test user...');
    const userResponse = await axios.post('https://janu-ecommerce-backend.onrender.com/api/auth/register', {
      name: 'Test Customer',
      email: 'testcustomer4@example.com',
      password: 'password123'
    });
    
    const user = userResponse.data.user;
    const token = userResponse.data.token;
    console.log('✅ User created:', user.name, '(', user.email, ')');

    // Step 2: Create a test order
    console.log('\n2. Creating test order...');
    const orderData = {
      items: [
        {
          _id: '68871293599292890a468d1a',
          name: 'kurtis',
          price: 1500,
          quantity: 1,
          size: 'M',
          image: 'https://images.pexels.com/photos/8839774/pexels-photo-8839774.jpeg'
        }
      ],
      totalAmount: 1599, // 1500 + 99 shipping
      shippingInfo: {
        fullName: 'Test Customer',
        email: 'testcustomer4@example.com',
        phone: '+919876543210',
        address: '123 Test Street, Test Colony',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      paymentMethod: 'bank_transfer'
    };

    const orderResponse = await axios.post('https://janu-ecommerce-backend.onrender.com/api/orders', orderData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const order = orderResponse.data.order;
    console.log('✅ Order created:', order._id, '(Status: pending)');

    // Step 3: Login as admin
    console.log('\n3. Logging in as admin...');
    const adminResponse = await axios.post('https://janu-ecommerce-backend.onrender.com/api/auth/login', {
      email: 'admin@janucollections.com',
      password: 'admin123'
    });

    const adminToken = adminResponse.data.token;
    console.log('✅ Admin logged in successfully');

    // Step 4: Confirm the order (this should trigger notifications)
    console.log('\n4. Confirming order (this will trigger notifications)...');
    const confirmResponse = await axios.put(`https://janu-ecommerce-backend.onrender.com/api/admin/orders/${order._id}`, {
      status: 'confirmed'
    }, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Order confirmed successfully!');
    console.log('📧 Notification results:', confirmResponse.data.notifications);

    // Step 5: Show what notifications were sent
    if (confirmResponse.data.notifications) {
      const { email, sms, whatsapp } = confirmResponse.data.notifications;
      console.log('\n📬 Notifications Sent:');
      console.log('   Email:', email ? '✅ Sent' : '❌ Not configured');
      console.log('   SMS:', sms ? '✅ Sent' : '❌ Not configured');
      console.log('   WhatsApp:', whatsapp ? '✅ Sent' : '❌ Not configured');
    }

    console.log('\n🎉 Test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   - Test user created:', user.email);
    console.log('   - Test order created:', order._id);
    console.log('   - Order confirmed with notifications');
    console.log('\n💡 Note: If notifications show as "Not configured",');
    console.log('   you need to set up SendGrid/Twilio in your .env file.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

testOrderConfirmation(); 