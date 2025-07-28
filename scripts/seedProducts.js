import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Elegant Silk Saree',
    description: 'Beautiful handwoven silk saree with intricate gold border. Perfect for special occasions and festivals.',
    price: 2499,
    originalPrice: 3499,
    category: 'sarees',
    sizes: ['Free Size'],
    colors: ['Red', 'Blue', 'Green'],
    images: [
      'https://images.pexels.com/photos/8839772/pexels-photo-8839772.jpeg',
      'https://images.pexels.com/photos/8839775/pexels-photo-8839775.jpeg',
    ],
    stock: 25,
    rating: 4.8,
    numReviews: 45,
    tags: ['silk', 'traditional', 'festive'],
    material: 'Pure Silk',
    careInstructions: 'Dry clean only',
  },
  {
    name: 'Cotton Anarkali Kurti',
    description: 'Comfortable cotton kurti with beautiful embroidery. Perfect for daily wear and casual occasions.',
    price: 899,
    originalPrice: 1299,
    category: 'kurtis',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Pink', 'Yellow'],
    images: [
      'https://images.pexels.com/photos/8839774/pexels-photo-8839774.jpeg',
    ],
    stock: 40,
    rating: 4.5,
    numReviews: 32,
    tags: ['cotton', 'comfortable', 'daily wear'],
    material: '100% Cotton',
    careInstructions: 'Machine wash cold',
  },
  {
    name: 'Designer Western Dress',
    description: 'Trendy western dress with modern cuts and stylish design. Perfect for parties and outings.',
    price: 1799,
    originalPrice: 2499,
    category: 'western',
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Navy', 'Maroon'],
    images: [
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',
    ],
    stock: 20,
    rating: 4.6,
    numReviews: 28,
    tags: ['trendy', 'party wear', 'stylish'],
    material: 'Polyester Blend',
    careInstructions: 'Hand wash recommended',
  },
  {
    name: 'Traditional Lehenga Set',
    description: 'Complete lehenga set with blouse and dupatta. Beautifully crafted for weddings and special events.',
    price: 4999,
    originalPrice: 6999,
    category: 'ethnic',
    sizes: ['S', 'M', 'L'],
    colors: ['Red', 'Pink', 'Orange'],
    images: [
      'https://images.pexels.com/photos/8839775/pexels-photo-8839775.jpeg',
    ],
    stock: 15,
    rating: 4.9,
    numReviews: 18,
    tags: ['wedding', 'traditional', 'ethnic'],
    material: 'Silk and Net',
    careInstructions: 'Dry clean only',
  },
  {
    name: 'Ethnic Jewelry Set',
    description: 'Beautiful traditional jewelry set with necklace and earrings. Perfect complement to ethnic wear.',
    price: 699,
    originalPrice: 999,
    category: 'accessories',
    sizes: ['One Size'],
    colors: ['Gold', 'Silver'],
    images: [
      'https://images.pexels.com/photos/8839772/pexels-photo-8839772.jpeg',
    ],
    stock: 35,
    rating: 4.4,
    numReviews: 22,
    tags: ['jewelry', 'traditional', 'accessories'],
    material: 'Artificial Jewelry',
    careInstructions: 'Store in dry place',
  },
  {
    name: 'Printed Cotton Saree',
    description: 'Light and comfortable cotton saree with beautiful prints. Ideal for daily wear and office.',
    price: 799,
    originalPrice: 1199,
    category: 'sarees',
    sizes: ['Free Size'],
    colors: ['Blue', 'Green', 'Purple'],
    images: [
      'https://images.pexels.com/photos/8839772/pexels-photo-8839772.jpeg',
    ],
    stock: 30,
    rating: 4.3,
    numReviews: 38,
    tags: ['cotton', 'printed', 'daily wear'],
    material: '100% Cotton',
    careInstructions: 'Machine wash gentle',
  },
  {
    name: 'Embroidered Kurti Top',
    description: 'Stylish kurti top with intricate embroidery. Can be paired with jeans or palazzo pants.',
    price: 649,
    originalPrice: 899,
    category: 'kurtis',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Black'],
    images: [
      'https://images.pexels.com/photos/8839774/pexels-photo-8839774.jpeg',
    ],
    stock: 45,
    rating: 4.2,
    numReviews: 55,
    tags: ['embroidered', 'versatile', 'trendy'],
    material: 'Cotton Blend',
    careInstructions: 'Machine wash cold',
  },
  {
    name: 'Casual Western Top',
    description: 'Comfortable and stylish western top perfect for casual outings and everyday wear.',
    price: 549,
    originalPrice: 799,
    category: 'western',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Pink', 'White', 'Grey'],
    images: [
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',
    ],
    stock: 50,
    rating: 4.1,
    numReviews: 42,
    tags: ['casual', 'comfortable', 'everyday'],
    material: 'Cotton Jersey',
    careInstructions: 'Machine wash',
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/janu-collections');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();