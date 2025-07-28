import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Define the Order schema inline since it uses ES6 imports
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  size: {
    type: String,
    required: true,
  },
});

const shippingInfoSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  shippingInfo: shippingInfoSchema,
  paymentMethod: {
    type: String,
    default: 'stripe',
  },
  paymentIntentId: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  trackingNumber: {
    type: String,
  },
  deliveredAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

const sampleOrders = [
  {
    user: null, // Will be populated with actual user ID
    items: [
      {
        product: null, // Will be populated with actual product ID
        name: 'Sample Product 1',
        image: 'https://via.placeholder.com/300x200?text=Product+1',
        quantity: 2,
        price: 1299,
        size: 'M'
      }
    ],
    shippingInfo: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+91-9876543210',
      address: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    paymentMethod: 'stripe',
    paymentIntentId: 'pi_sample_1',
    totalAmount: 2598,
    shippingCost: 100,
    status: 'pending'
  },
  {
    user: null,
    items: [
      {
        product: null,
        name: 'Sample Product 2',
        image: 'https://via.placeholder.com/300x200?text=Product+2',
        quantity: 1,
        price: 899,
        size: 'L'
      }
    ],
    shippingInfo: {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91-9876543211',
      address: '456 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    paymentMethod: 'stripe',
    paymentIntentId: 'pi_sample_2',
    totalAmount: 899,
    shippingCost: 50,
    status: 'confirmed'
  },
  {
    user: null,
    items: [
      {
        product: null,
        name: 'Sample Product 3',
        image: 'https://via.placeholder.com/300x200?text=Product+3',
        quantity: 3,
        price: 599,
        size: 'S'
      }
    ],
    shippingInfo: {
      fullName: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+91-9876543212',
      address: '789 Oak Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    },
    paymentMethod: 'stripe',
    paymentIntentId: 'pi_sample_3',
    totalAmount: 1797,
    shippingCost: 75,
    status: 'shipped',
    trackingNumber: 'TRK123456789'
  },
  {
    user: null,
    items: [
      {
        product: null,
        name: 'Sample Product 4',
        image: 'https://via.placeholder.com/300x200?text=Product+4',
        quantity: 1,
        price: 1499,
        size: 'XL'
      }
    ],
    shippingInfo: {
      fullName: 'Alice Brown',
      email: 'alice@example.com',
      phone: '+91-9876543213',
      address: '321 Pine Street',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001'
    },
    paymentMethod: 'stripe',
    paymentIntentId: 'pi_sample_4',
    totalAmount: 1499,
    shippingCost: 60,
    status: 'delivered',
    trackingNumber: 'TRK987654321',
    deliveredAt: new Date()
  }
];

async function seedOrders() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack-app');
    console.log('Connected to MongoDB');

    // Get a user (admin or create one if needed)
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      isAdmin: Boolean
    }));
    
    let user = await User.findOne({ email: 'jhansi.vandana1@gmail.com' });
    if (!user) {
      console.log('Creating admin user...');
      user = await User.create({
        name: 'Admin User',
        email: 'jhansi.vandana1@gmail.com',
        password: 'Janu@123',
        isAdmin: true
      });
    }

    // Get a product (or create one if needed)
    const Product = mongoose.model('Product', new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      category: String,
      stock: Number,
      images: [String],
      isActive: Boolean
    }));
    
    let product = await Product.findOne();
    if (!product) {
      console.log('Creating sample product...');
      product = await Product.create({
        name: 'Sample Product',
        description: 'A sample product for testing',
        price: 999,
        category: 'Electronics',
        stock: 100,
        images: ['https://via.placeholder.com/300x200?text=Sample+Product'],
        isActive: true
      });
    }

    // Clear existing orders
    await Order.deleteMany({});
    console.log('Cleared existing orders');

    // Create orders with proper user and product references
    const ordersWithRefs = sampleOrders.map(order => ({
      ...order,
      user: user._id,
      items: order.items.map(item => ({
        ...item,
        product: product._id
      }))
    }));

    const createdOrders = await Order.insertMany(ordersWithRefs);
    console.log(`Created ${createdOrders.length} sample orders`);

    // Display created orders
    console.log('\nCreated Orders:');
    createdOrders.forEach((order, index) => {
      console.log(`${index + 1}. Order ID: ${order._id}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Total: ₹${order.totalAmount}`);
      console.log(`   Customer: ${order.shippingInfo.fullName} (${order.shippingInfo.email})`);
      console.log('');
    });

    console.log('✅ Orders seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
}

seedOrders(); 