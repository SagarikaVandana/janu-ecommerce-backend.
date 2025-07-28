import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  lastEmailSent: {
    type: Date,
    default: null,
  },
  source: {
    type: String,
    default: 'website',
    enum: ['website', 'admin', 'api'],
  },
  userAgent: {
    type: String,
    trim: true,
  },
  ipAddress: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for better performance
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ isActive: 1 });
newsletterSchema.index({ subscribedAt: -1 });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

export default Newsletter; 