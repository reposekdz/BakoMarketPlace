import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/track/view', async (req, res) => {
  try {
    const { product_id, user_id, session_id, duration } = req.body;
    
    await pool.query(
      'INSERT INTO product_views (product_id, user_id, session_id, ip_address, user_agent, duration) VALUES (?, ?, ?, ?, ?, ?)',
      [product_id, user_id, session_id, req.ip, req.headers['user-agent'], duration]
    );
    
    await pool.query('UPDATE products SET views = views + 1 WHERE id = ?', [product_id]);
    
    const [product] = await pool.query('SELECT shop_id FROM products WHERE id = ?', [product_id]);
    if (product.length > 0) {
      await pool.query(
        'INSERT INTO shop_analytics (shop_id, date, product_views) VALUES (?, CURDATE(), 1) ON DUPLICATE KEY UPDATE product_views = product_views + 1',
        [product[0].shop_id]
      );
    }
    
    res.json({ message: 'View tracked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/shop/:shopId', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const [analytics] = await pool.query(`
      SELECT * FROM shop_analytics 
      WHERE shop_id = ? AND date BETWEEN ? AND ?
      ORDER BY date DESC
    `, [req.params.shopId, startDate || '2024-01-01', endDate || new Date().toISOString().split('T')[0]]);
    
    const [summary] = await pool.query(`
      SELECT 
        SUM(views) as total_views,
        SUM(unique_visitors) as total_visitors,
        SUM(orders) as total_orders,
        SUM(revenue) as total_revenue,
        AVG(conversion_rate) as avg_conversion,
        AVG(avg_order_value) as avg_order_val
      FROM shop_analytics
      WHERE shop_id = ? AND date BETWEEN ? AND ?
    `, [req.params.shopId, startDate || '2024-01-01', endDate || new Date().toISOString().split('T')[0]]);
    
    res.json({ analytics, summary: summary[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/recommendations/:userId', async (req, res) => {
  try {
    const [views] = await pool.query(`
      SELECT product_id, COUNT(*) as view_count
      FROM product_views
      WHERE user_id = ?
      GROUP BY product_id
      ORDER BY view_count DESC
      LIMIT 10
    `, [req.params.userId]);
    
    if (views.length === 0) {
      const [trending] = await pool.query(`
        SELECT p.*, 
          (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image
        FROM products p
        ORDER BY p.views DESC, p.sales DESC
        LIMIT 20
      `);
      return res.json(trending);
    }
    
    const categoryIds = views.map(v => v.product_id);
    const [categories] = await pool.query(
      'SELECT DISTINCT category FROM products WHERE id IN (?)',
      [categoryIds]
    );
    
    const [recommendations] = await pool.query(`
      SELECT p.*, 
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image,
        (p.views * 0.3 + p.sales * 0.5 + p.rating * 0.2) as score
      FROM products p
      WHERE p.category IN (?) AND p.id NOT IN (?) AND p.status = 'active'
      ORDER BY score DESC
      LIMIT 20
    `, [categories.map(c => c.category), categoryIds]);
    
    for (const rec of recommendations) {
      await pool.query(
        'INSERT INTO product_recommendations (user_id, product_id, score, reason) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE score = ?, reason = ?',
        [req.params.userId, rec.id, rec.score, 'Based on your browsing', rec.score, 'Based on your browsing']
      );
    }
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/price-alert', authMiddleware, async (req, res) => {
  try {
    const { product_id, target_price } = req.body;
    
    await pool.query(
      'INSERT INTO price_alerts (user_id, product_id, target_price) VALUES (?, ?, ?)',
      [req.userId, product_id, target_price]
    );
    
    res.json({ message: 'Price alert created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/price-alerts', authMiddleware, async (req, res) => {
  try {
    const [alerts] = await pool.query(`
      SELECT pa.*, p.name, p.price,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image
      FROM price_alerts pa
      JOIN products p ON pa.product_id = p.id
      WHERE pa.user_id = ? AND pa.is_active = TRUE
      ORDER BY pa.created_at DESC
    `, [req.userId]);
    
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
