import express from 'express';
import PaymentSettings from '../models/PaymentSettings.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get payment settings (public - for users to see payment details)
router.get('/', async (req, res) => {
  try {
    const paymentSettings = await PaymentSettings.findOne({ isActive: true });
    
    if (!paymentSettings) {
      return res.status(404).json({ message: 'Payment settings not found' });
    }

    // Return only necessary details for users
    res.json({
      bankName: paymentSettings.bankName,
      accountNumber: paymentSettings.accountNumber,
      accountHolderName: paymentSettings.accountHolderName,
      ifscCode: paymentSettings.ifscCode,
      upiId: paymentSettings.upiId,
      upiName: paymentSettings.upiName,
      qrCodeImage: paymentSettings.qrCodeImage,
      gpayNumber: paymentSettings.gpayNumber,
      phonepeNumber: paymentSettings.phonepeNumber,
      paytmNumber: paymentSettings.paytmNumber,
      paymentInstructions: paymentSettings.paymentInstructions,
    });
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    res.status(500).json({ message: 'Error fetching payment settings' });
  }
});

// Admin: Get all payment settings
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const paymentSettings = await PaymentSettings.find().sort({ createdAt: -1 });
    res.json(paymentSettings);
  } catch (error) {
    console.error('Error fetching payment settings:', error);
    res.status(500).json({ message: 'Error fetching payment settings' });
  }
});

// Admin: Create new payment settings
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      bankName,
      accountNumber,
      accountHolderName,
      ifscCode,
      branchName,
      upiId,
      upiName,
      qrCodeImage,
      gpayNumber,
      phonepeNumber,
      paytmNumber,
      paymentInstructions,
    } = req.body;

    // Deactivate all existing payment settings
    await PaymentSettings.updateMany({}, { isActive: false });

    // Create new payment settings
    const newPaymentSettings = new PaymentSettings({
      bankName,
      accountNumber,
      accountHolderName,
      ifscCode,
      branchName,
      upiId,
      upiName,
      qrCodeImage,
      gpayNumber,
      phonepeNumber,
      paytmNumber,
      paymentInstructions,
      createdBy: req.user.userId,
      isActive: true,
    });

    await newPaymentSettings.save();

    res.status(201).json({
      message: 'Payment settings created successfully',
      paymentSettings: newPaymentSettings,
    });
  } catch (error) {
    console.error('Error creating payment settings:', error);
    res.status(500).json({ message: 'Error creating payment settings' });
  }
});

// Admin: Update payment settings
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      bankName,
      accountNumber,
      accountHolderName,
      ifscCode,
      branchName,
      upiId,
      upiName,
      qrCodeImage,
      gpayNumber,
      phonepeNumber,
      paytmNumber,
      paymentInstructions,
      isActive,
    } = req.body;

    const paymentSettings = await PaymentSettings.findById(req.params.id);
    
    if (!paymentSettings) {
      return res.status(404).json({ message: 'Payment settings not found' });
    }

    // If making this active, deactivate others
    if (isActive) {
      await PaymentSettings.updateMany(
        { _id: { $ne: req.params.id } },
        { isActive: false }
      );
    }

    // Update payment settings
    const updatedPaymentSettings = await PaymentSettings.findByIdAndUpdate(
      req.params.id,
      {
        bankName,
        accountNumber,
        accountHolderName,
        ifscCode,
        branchName,
        upiId,
        upiName,
        qrCodeImage,
        gpayNumber,
        phonepeNumber,
        paytmNumber,
        paymentInstructions,
        isActive,
      },
      { new: true }
    );

    res.json({
      message: 'Payment settings updated successfully',
      paymentSettings: updatedPaymentSettings,
    });
  } catch (error) {
    console.error('Error updating payment settings:', error);
    res.status(500).json({ message: 'Error updating payment settings' });
  }
});

// Admin: Delete payment settings
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const paymentSettings = await PaymentSettings.findById(req.params.id);
    
    if (!paymentSettings) {
      return res.status(404).json({ message: 'Payment settings not found' });
    }

    await PaymentSettings.findByIdAndDelete(req.params.id);

    res.json({ message: 'Payment settings deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment settings:', error);
    res.status(500).json({ message: 'Error deleting payment settings' });
  }
});

// Admin: Toggle payment settings active status
router.patch('/:id/toggle', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const paymentSettings = await PaymentSettings.findById(req.params.id);
    
    if (!paymentSettings) {
      return res.status(404).json({ message: 'Payment settings not found' });
    }

    // If making this active, deactivate others
    if (!paymentSettings.isActive) {
      await PaymentSettings.updateMany(
        { _id: { $ne: req.params.id } },
        { isActive: false }
      );
    }

    paymentSettings.isActive = !paymentSettings.isActive;
    await paymentSettings.save();

    res.json({
      message: `Payment settings ${paymentSettings.isActive ? 'activated' : 'deactivated'} successfully`,
      paymentSettings,
    });
  } catch (error) {
    console.error('Error toggling payment settings:', error);
    res.status(500).json({ message: 'Error toggling payment settings' });
  }
});

export default router; 