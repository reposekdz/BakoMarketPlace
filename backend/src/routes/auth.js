import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate JWT compatible with existing frontend
const signToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

router.post('/register', async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      isSeller,
      shopName,
      shopCategory,
      businessType,
      taxId,
    } = req.body;

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      phone,
      is_seller: !!isSeller,
    });

    if (isSeller) {
      await Shop.create({
        user_id: user.id,
        shop_name: shopName,
        shop_category: shopCategory,
        business_type: businessType,
        tax_id: taxId,
      });
    }

    const token = signToken(user.id);

    res.status(201).json({
      token,
      userId: user.id,
      email,
      firstName,
      lastName,
      isSeller: !!isSeller,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user.id);

    // Update last login metadata (non-blocking)
    User.incrementLoginMetadata(user.id).catch(() => {});

    res.json({
      token,
      userId: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      isSeller: user.is_seller,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current authenticated user profile (including shop info if seller)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const profile = await User.getProfileWithShop(req.userId);
    if (!profile) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
