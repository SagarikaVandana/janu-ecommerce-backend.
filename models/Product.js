import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: ['sarees', 'kurtis', 'western', 'ethnic', 'accessories'],
    lowercase: true,
  },
  sizes: [{
    type: String,
    trim: true,
  }],
  colors: [{
    type: String,
    trim: true,
  }],
  images: [{
    type: String,
    required: true,
  }],
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  material: {
    type: String,
    trim: true,
  },
  careInstructions: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes for better performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);