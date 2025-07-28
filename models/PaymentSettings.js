import mongoose from 'mongoose';

const paymentSettingsSchema = new mongoose.Schema({
  // Bank Account Details
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

  // UPI Details
  upiId: {
    type: String,
    required: true,
    trim: true,
  },
  upiName: {
    type: String,
    trim: true,
  },

  // QR Code
  qrCodeImage: {
    type: String,
    required: true,
  },

  // Additional Payment Methods
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

  // Settings
  isActive: {
    type: Boolean,
    default: true,
  },
  paymentInstructions: {
    type: String,
    trim: true,
    default: 'Please make payment to the provided UPI ID or bank account. Share the payment screenshot for order confirmation.',
  },

  // Created/Updated by admin
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure only one active payment settings
paymentSettingsSchema.index({ isActive: 1 });

const PaymentSettings = mongoose.model('PaymentSettings', paymentSettingsSchema);

export default PaymentSettings; 