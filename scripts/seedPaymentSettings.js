import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Define the PaymentSettings schema inline since it uses ES6 imports
const paymentSettingsSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
    trim: true,
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true,
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true,
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true,
  },
  branchName: {
    type: String,
    trim: true,
  },
  upiId: {
    type: String,
    required: true,
    trim: true,
  },
  upiName: {
    type: String,
    trim: true,
  },
  qrCodeImage: {
    type: String,
    required: true,
  },
  gpayNumber: {
    type: String,
    trim: true,
  },
  phonepeNumber: {
    type: String,
    trim: true,
  },
  paytmNumber: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  paymentInstructions: {
    type: String,
    trim: true,
    default: 'Please make payment to the provided UPI ID or bank account. Share the payment screenshot for order confirmation.',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const PaymentSettings = mongoose.model('PaymentSettings', paymentSettingsSchema);

// Define User schema inline for seeding purposes
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: Boolean
}));

const samplePaymentSettings = [
  {
    bankName: 'State Bank of India',
    accountNumber: '1234567890',
    accountHolderName: 'Janu Collections',
    ifscCode: 'SBIN0001234',
    branchName: 'Main Branch',
    upiId: 'janucollections@upi',
    upiName: 'Janu Collections',
    qrCodeImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://janucollections@upi',
    gpayNumber: '9876543210',
    phonepeNumber: '9876543210',
    paytmNumber: '9876543210',
    paymentInstructions: 'Please make payment to the provided UPI ID or bank account. After payment, please share the screenshot for order confirmation. You can use any UPI app like Google Pay, PhonePe, Paytm, or any other UPI-enabled app.',
    isActive: true,
  },
  {
    bankName: 'HDFC Bank',
    accountNumber: '0987654321',
    accountHolderName: 'Janu Collections Pvt Ltd',
    ifscCode: 'HDFC0001234',
    branchName: 'Corporate Branch',
    upiId: 'janucollections@hdfc',
    upiName: 'Janu Collections',
    qrCodeImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://janucollections@hdfc',
    gpayNumber: '8765432109',
    phonepeNumber: '8765432109',
    paytmNumber: '8765432109',
    paymentInstructions: 'Please transfer the amount to our HDFC Bank account or scan the QR code. After payment, please share the screenshot for order confirmation.',
    isActive: false,
  }
];

const seedPaymentSettings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack-app');
    console.log('Connected to MongoDB');

    // Clear existing payment settings
    await PaymentSettings.deleteMany({});
    console.log('Cleared existing payment settings');

    // Find admin user
    const adminUser = await User.findOne({ isAdmin: true });
    if (!adminUser) {
      console.log('No admin user found. Creating one...');
      const newAdmin = new User({
        name: 'Admin User',
        email: 'admin@janucollections.com',
        password: 'hashedpassword',
        isAdmin: true
      });
      await newAdmin.save();
      console.log('Admin user created');
    }

    const adminUserId = adminUser ? adminUser._id : (await User.findOne({ isAdmin: true }))._id;

    // Insert sample payment settings
    const paymentSettingsToInsert = samplePaymentSettings.map(settings => ({
      ...settings,
      createdBy: adminUserId
    }));

    await PaymentSettings.insertMany(paymentSettingsToInsert);
    console.log('Payment settings seeded successfully');

    // Display the seeded data
    const seededSettings = await PaymentSettings.find().populate('createdBy', 'name email');
    console.log('Seeded payment settings:');
    seededSettings.forEach((setting, index) => {
      console.log(`${index + 1}. ${setting.bankName} - ${setting.accountNumber}`);
      console.log(`   UPI: ${setting.upiId}`);
      console.log(`   Active: ${setting.isActive}`);
      console.log(`   Created by: ${setting.createdBy.name}`);
      console.log('');
    });

    console.log('Payment settings seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding payment settings:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedPaymentSettings(); 