import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import paymentSettingsRoutes from './routes/paymentSettings.js';
import newsletterRoutes from './routes/newsletter.js';
import userRoutes from './routes/users.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
}));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// MongoDB connection
const mongoUri = process.env.MONGODB_URI;
const isProduction = process.env.NODE_ENV === 'production';

if (!mongoUri) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  if (isProduction) {
    console.error('🚨 PRODUCTION ERROR: MONGODB_URI is required in production!');
    console.error('Please set MONGODB_URI in your Render environment variables.');
    console.error('Use MongoDB Atlas connection string: mongodb+srv://username:password@cluster.mongodb.net/database');
    process.exit(1);
  } else {
    console.error('⚠️ DEVELOPMENT: Using local MongoDB fallback');
    console.error('For production, set MONGODB_URI environment variable');
  }
}

// Determine connection string
let connectionString;
if (mongoUri) {
  connectionString = mongoUri;
} else {
  // Development fallback
  connectionString = 'mongodb://localhost:27017/janu-collections';
  console.log('🔧 Using development MongoDB: localhost:27017');
}

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log('📊 Database:', mongoose.connection.name);
  if (mongoUri) {
    console.log('🔗 Connection URL:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
  }
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.error('🔍 Connection details:');
  console.error('   - Environment:', process.env.NODE_ENV || 'development');
  console.error('   - URI provided:', !!mongoUri);
  console.error('   - Using fallback:', !mongoUri);
  
  if (isProduction) {
    console.error('🚨 PRODUCTION ERROR: Cannot connect to MongoDB Atlas');
    console.error('Please ensure:');
    console.error('1. MONGODB_URI is set in Render environment variables');
    console.error('2. MongoDB Atlas cluster is running');
    console.error('3. Network access is configured for 0.0.0.0/0');
    console.error('4. Database user has proper permissions');
    process.exit(1);
  } else {
    console.error('⚠️ DEVELOPMENT: Make sure MongoDB is running locally');
    console.error('Run: mongod (or start MongoDB service)');
    process.exit(1);
  }
});

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment-settings', paymentSettingsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/users', userRoutes);

console.log('✅ All routes registered successfully');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});