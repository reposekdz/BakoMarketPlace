import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const [shop] = await pool.query('SELECT id FROM shops WHERE user_id = ?', [req.userId]);
    if (shop.length === 0) return res.status(404).json({ error: 'Shop not found' });
    
    const [revenue] = await pool.query('SELECT SUM(total_amount) as total FROM orders WHERE shop_id = ? AND payment_status = "paid"', [shop[0].id]);
    const [orders] = await pool.query('SELECT COUNT(*) as count FROM orders WHERE shop_id = ?', [shop[0].id]);
    const [products] = await pool.query('SELECT COUNT(*) as count FROM products WHERE shop_id = ?', [shop[0].id]);
    const [analytics] = await pool.query('SELECT * FROM analytics WHERE shop_id = ? ORDER BY date DESC LIMIT 30', [shop[0].id]);
    
    res.json({
      revenue: revenue[0].total || 0,
      orders: orders[0].count,
      products: products[0].count,
      analytics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
