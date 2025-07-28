import express from 'express';
import Product from '../models/Product.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Add a new product (dress)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  // Add product logic here
  res.send({ message: "Product added successfully" });
});

// Update a product
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  // Update product logic here
  res.send({ message: "Product updated successfully" });
});

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 20,
      search,
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) {
      filter.category = category.toLowerCase();
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    let sortOption = {};
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Execute query
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    // Get total count for pagination
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.json({
      products,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalProducts,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!product.isActive) {
      return res.status(404).json({ message: 'Product not available' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Server error while fetching product' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { sort = 'newest', page = 1, limit = 20 } = req.query;

    const filter = { 
      category: category.toLowerCase(), 
      isActive: true 
    };

    let sortOption = {};
    switch (sort) {
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNumber)
      .lean();

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.json({
      products,
      category,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalProducts,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error('Get category products error:', error);
    res.status(500).json({ message: 'Server error while fetching category products' });
  }
});

// Get featured products
router.get('/featured/products', async (req, res) => {
  try {
    const products = await Product.find({ 
      isActive: true,
      rating: { $gte: 4 }
    })
      .sort({ rating: -1, numReviews: -1 })
      .limit(8)
      .lean();

    res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Server error while fetching featured products' });
  }
});

export default router;