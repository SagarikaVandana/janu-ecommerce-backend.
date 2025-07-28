import express from 'express';
import Stripe from 'stripe';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// Create payment intent
router.post('/create-payment-intent', authenticateToken, [
  body('amount').isNumeric().withMessage('Amount is required'),
], async (req, res) => {
  try {
    const { amount } = req.body;

    if (!stripe) {
      return res.status(400).json({ message: 'Stripe is not configured' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'inr',
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
});

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, totalAmount, shippingInfo, paymentMethod, transactionNumber } = req.body;
    
    console.log('Creating order for user:', req.user.userId);
    console.log('Order data:', { items: items.length, totalAmount, paymentMethod });

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    // Calculate total from items
    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(400).json({ message: `Product ${item._id} not found` });
      }

      const itemTotal = product.price * item.quantity;
      calculatedTotal += itemTotal;

        orderItems.push({
        product: item._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          size: item.size,
        image: product.images[0] || '',
        });
    }

    // Add shipping cost
    const shippingCost = 99;
    calculatedTotal += shippingCost;

    // Validate total amount
    if (Math.abs(calculatedTotal - totalAmount) > 1) {
      return res.status(400).json({ 
        message: 'Amount mismatch',
        calculated: calculatedTotal,
        provided: totalAmount
      });
    }

    // Create order
    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      shippingInfo,
      paymentMethod,
      totalAmount,
      shippingCost,
      status: 'pending',
      // Only add paymentIntentId for Stripe payments
      ...(paymentMethod === 'stripe' && { paymentIntentId: req.body.paymentIntentId }),
      // Add transaction number for non-Stripe payments
      ...(paymentMethod !== 'stripe' && transactionNumber && { transactionNumber }),
    });

    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Confirm payment with transaction number
router.put('/:id/confirm-payment', authenticateToken, async (req, res) => {
  try {
    const { transactionNumber } = req.body;
    const orderId = req.params.id;

    if (!transactionNumber || !transactionNumber.trim()) {
      return res.status(400).json({ message: 'Transaction number is required' });
    }

    // Find the order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order with transaction number
    order.transactionNumber = transactionNumber.trim();
    order.paymentStatus = 'completed';
    await order.save();

    res.json({
      message: 'Payment confirmed successfully',
      order,
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Get user orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test endpoint for user stats (remove in production)
router.get('/test-user-stats', async (req, res) => {
  try {
    console.log('Test user stats endpoint called');
    res.json({ 
      message: 'User stats endpoint is working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ message: 'Test endpoint error' });
  }
});

// Get user stats
router.get('/user-stats', authenticateToken, async (req, res) => {
  try {
    console.log('User stats request for user ID:', req.user.userId);
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('User not found for ID:', req.user.userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Found user:', user.email);

    // Get user's orders
    const orders = await Order.find({ user: req.user.userId });
    console.log('Found orders count:', orders.length);
    
    // Calculate stats
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }) : 'Jan 2024';

    const stats = {
      totalOrders,
      totalSpent,
      memberSince,
    };

    console.log('Sending stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Error fetching user stats' });
  }
});

// Get specific order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark payment as complete
router.patch('/:id/payment-complete', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order is not in pending status' });
    }

    // Update order status to confirmed
    order.status = 'confirmed';
    order.paymentStatus = 'completed';
    order.paymentCompletedAt = new Date();
    await order.save();

    res.json({
      message: 'Payment marked as complete',
      order,
    });
  } catch (error) {
    console.error('Payment complete error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Error marking payment complete' });
  }
});

export default router;