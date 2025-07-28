import express from 'express';
import { body, validationResult } from 'express-validator';
import Newsletter from '../models/Newsletter.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email } = req.body;
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ email });
    
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(400).json({ 
          message: 'This email is already subscribed to our newsletter' 
        });
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        existingSubscription.subscribedAt = new Date();
        existingSubscription.userAgent = userAgent;
        existingSubscription.ipAddress = ipAddress;
        await existingSubscription.save();
        
        return res.json({ 
          message: 'Welcome back! You have been resubscribed to our newsletter',
          subscription: existingSubscription
        });
      }
    }

    // Create new subscription
    const subscription = new Newsletter({
      email,
      userAgent,
      ipAddress,
      source: 'website'
    });

    await subscription.save();

    res.status(201).json({
      message: 'Successfully subscribed to our newsletter!',
      subscription
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      message: 'Failed to subscribe to newsletter. Please try again.' 
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email } = req.body;

    const subscription = await Newsletter.findOne({ email });
    
    if (!subscription) {
      return res.status(404).json({ 
        message: 'Email not found in our newsletter subscriptions' 
      });
    }

    if (!subscription.isActive) {
      return res.status(400).json({ 
        message: 'This email is already unsubscribed from our newsletter' 
      });
    }

    subscription.isActive = false;
    await subscription.save();

    res.json({
      message: 'Successfully unsubscribed from our newsletter',
      subscription
    });

  } catch (error) {
    console.error('Newsletter unsubscription error:', error);
    res.status(500).json({ 
      message: 'Failed to unsubscribe from newsletter. Please try again.' 
    });
  }
});

// Admin: Get all newsletter subscriptions
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', status = '' } = req.query;
    
    const query = {};
    
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { subscribedAt: -1 }
    };

    const subscriptions = await Newsletter.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit);

    const total = await Newsletter.countDocuments(query);

    res.json({
      subscriptions,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit)
      }
    });

  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    res.status(500).json({ 
      message: 'Error fetching newsletter subscriptions' 
    });
  }
});

// Admin: Get newsletter statistics
router.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalSubscribers = await Newsletter.countDocuments({ isActive: true });
    const totalUnsubscribed = await Newsletter.countDocuments({ isActive: false });
    const totalEmails = await Newsletter.countDocuments();
    
    const recentSubscriptions = await Newsletter.find({ isActive: true })
      .sort({ subscribedAt: -1 })
      .limit(5);

    const monthlyStats = await Newsletter.aggregate([
      {
        $match: {
          subscribedAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$subscribedAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      totalSubscribers,
      totalUnsubscribed,
      totalEmails,
      recentSubscriptions,
      monthlyStats
    });

  } catch (error) {
    console.error('Error fetching newsletter statistics:', error);
    res.status(500).json({ 
      message: 'Error fetching newsletter statistics' 
    });
  }
});

// Admin: Delete newsletter subscription
router.delete('/admin/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const subscription = await Newsletter.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ 
        message: 'Newsletter subscription not found' 
      });
    }

    await Newsletter.findByIdAndDelete(req.params.id);

    res.json({ 
      message: 'Newsletter subscription deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting newsletter subscription:', error);
    res.status(500).json({ 
      message: 'Error deleting newsletter subscription' 
    });
  }
});

// Admin: Toggle subscription status
router.patch('/admin/:id/toggle', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const subscription = await Newsletter.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ 
        message: 'Newsletter subscription not found' 
      });
    }

    subscription.isActive = !subscription.isActive;
    await subscription.save();

    res.json({
      message: `Newsletter subscription ${subscription.isActive ? 'activated' : 'deactivated'} successfully`,
      subscription
    });

  } catch (error) {
    console.error('Error toggling newsletter subscription:', error);
    res.status(500).json({ 
      message: 'Error toggling newsletter subscription' 
    });
  }
});

export default router; 