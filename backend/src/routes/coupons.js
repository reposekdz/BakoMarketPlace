import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/validate', authMiddleware, async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    const [coupons] = await pool.query(
      'SELECT * FROM coupons WHERE code = ? AND is_active = TRUE AND start_date <= NOW() AND end_date >= NOW()',
      [code]
    );
    
    if (coupons.length === 0) {
      return res.status(404).json({ error: 'Invalid or expired coupon' });
    }
    
    const coupon = coupons[0];
    
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }
    
    if (orderAmount < coupon.min_order_amount) {
      return res.status(400).json({ error: `Minimum order amount is ${coupon.min_order_amount}` });
    }
    
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (orderAmount * coupon.discount_value) / 100;
    } else {
      discount = coupon.discount_value;
    }
    
    res.json({ valid: true, discount, coupon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/apply', authMiddleware, async (req, res) => {
  try {
    const { code } = req.body;
    await pool.query('UPDATE coupons SET used_count = used_count + 1 WHERE code = ?', [code]);
    res.json({ message: 'Coupon applied successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
