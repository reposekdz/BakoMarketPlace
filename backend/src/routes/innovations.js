import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/live-stream/start', authMiddleware, async (req, res) => {
  try {
    const { title, description, products_featured } = req.body;
    
    const [shops] = await pool.query('SELECT id FROM shops WHERE user_id = ?', [req.userId]);
    if (shops.length === 0) {
      return res.status(400).json({ error: 'No shop found' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO live_streams (shop_id, title, description, status, started_at, products_featured) VALUES (?, ?, ?, ?, NOW(), ?)',
      [shops[0].id, title, description, 'live', JSON.stringify(products_featured)]
    );
    
    res.json({ stream_id: result.insertId, message: 'Live stream started' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/live-stream/:id/end', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE live_streams SET status = ?, ended_at = NOW() WHERE id = ?',
      ['ended', req.params.id]
    );
    res.json({ message: 'Live stream ended' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/live-stream/:id/view', async (req, res) => {
  try {
    await pool.query(
      'UPDATE live_streams SET viewers_count = viewers_count + 1, total_views = total_views + 1, peak_viewers = GREATEST(peak_viewers, viewers_count + 1) WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'View tracked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/live-streams', async (req, res) => {
  try {
    const [streams] = await pool.query(`
      SELECT ls.*, s.shop_name, s.logo
      FROM live_streams ls
      JOIN shops s ON ls.shop_id = s.id
      WHERE ls.status = 'live'
      ORDER BY ls.viewers_count DESC
    `);
    res.json(streams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/gamification/action', authMiddleware, async (req, res) => {
  try {
    const { action_type } = req.body;
    let points = 0;
    
    switch (action_type) {
      case 'purchase': points = 100; break;
      case 'review': points = 50; break;
      case 'referral': points = 200; break;
      case 'daily_login': points = 10; break;
      case 'share': points = 25; break;
      default: points = 5;
    }
    
    await pool.query(
      'INSERT INTO gamification (user_id, points) VALUES (?, ?) ON DUPLICATE KEY UPDATE points = points + ?, last_activity = CURDATE()',
      [req.userId, points, points]
    );
    
    const [user] = await pool.query('SELECT points, level FROM gamification WHERE user_id = ?', [req.userId]);
    const newLevel = Math.floor(user[0].points / 1000) + 1;
    
    if (newLevel > user[0].level) {
      await pool.query('UPDATE gamification SET level = ? WHERE user_id = ?', [newLevel, req.userId]);
    }
    
    res.json({ points_earned: points, total_points: user[0].points, level: newLevel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/gamification/leaderboard', async (req, res) => {
  try {
    const [leaderboard] = await pool.query(`
      SELECT g.*, u.first_name, u.last_name, u.avatar
      FROM gamification g
      JOIN users u ON g.user_id = u.id
      ORDER BY g.points DESC
      LIMIT 100
    `);
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/flash-sales', async (req, res) => {
  try {
    const [sales] = await pool.query(`
      SELECT fs.*, p.name, p.brand,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image
      FROM flash_sales fs
      JOIN products p ON fs.product_id = p.id
      WHERE fs.status = 'active' AND fs.end_time > NOW()
      ORDER BY fs.end_time ASC
    `);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/flash-sales', authMiddleware, async (req, res) => {
  try {
    const { product_id, sale_price, quantity_available, start_time, end_time } = req.body;
    
    const [product] = await pool.query('SELECT price FROM products WHERE id = ?', [product_id]);
    const discount = ((product[0].price - sale_price) / product[0].price * 100).toFixed(2);
    
    const [result] = await pool.query(
      'INSERT INTO flash_sales (product_id, original_price, sale_price, discount_percentage, quantity_available, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [product_id, product[0].price, sale_price, discount, quantity_available, start_time, end_time, 'upcoming']
    );
    
    res.json({ id: result.insertId, message: 'Flash sale created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ar-try-on', authMiddleware, async (req, res) => {
  try {
    const { product_id, ar_model_url, ar_type } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO ar_try_on (product_id, ar_model_url, ar_type) VALUES (?, ?, ?)',
      [product_id, ar_model_url, ar_type]
    );
    
    res.json({ id: result.insertId, message: 'AR model added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ar-try-on/:productId', async (req, res) => {
  try {
    const [ar] = await pool.query('SELECT * FROM ar_try_on WHERE product_id = ?', [req.params.productId]);
    
    if (ar.length > 0) {
      await pool.query('UPDATE ar_try_on SET usage_count = usage_count + 1 WHERE id = ?', [ar[0].id]);
    }
    
    res.json(ar[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
