import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/expo/:expoId/stream/start', authMiddleware, async (req, res) => {
  try {
    const { title, description, products } = req.body;
    
    const [booths] = await pool.query(
      'SELECT id FROM expo_booths WHERE expo_id = ? AND shop_id IN (SELECT id FROM shops WHERE user_id = ?)',
      [req.params.expoId, req.userId]
    );
    
    if (booths.length === 0) {
      return res.status(400).json({ error: 'No booth found for this expo' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO live_streams (shop_id, expo_booth_id, title, description, status, started_at) VALUES ((SELECT id FROM shops WHERE user_id = ? LIMIT 1), ?, ?, ?, ?, NOW())',
      [req.userId, booths[0].id, title, description, 'live']
    );
    
    await pool.query(
      'INSERT INTO stream_participants (stream_id, user_id, role, is_camera_on, is_mic_on) VALUES (?, ?, ?, ?, ?)',
      [result.insertId, req.userId, 'host', true, true]
    );
    
    if (products && products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        await pool.query(
          'INSERT INTO stream_products (stream_id, product_id, display_order, special_price, quantity_available) VALUES (?, ?, ?, ?, ?)',
          [result.insertId, products[i].id, i, products[i].special_price, products[i].quantity]
        );
      }
    }
    
    await pool.query('UPDATE expo_booths SET is_live = TRUE WHERE id = ?', [booths[0].id]);
    
    res.json({ stream_id: result.insertId, message: 'Stream started' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/stream/:id/join', authMiddleware, async (req, res) => {
  try {
    const { role = 'viewer', camera_on = false, mic_on = false } = req.body;
    
    await pool.query(
      'INSERT INTO stream_participants (stream_id, user_id, role, is_camera_on, is_mic_on) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, req.userId, role, camera_on, mic_on]
    );
    
    await pool.query('UPDATE live_streams SET viewers_count = viewers_count + 1, peak_viewers = GREATEST(peak_viewers, viewers_count + 1) WHERE id = ?', [req.params.id]);
    
    const [stream] = await pool.query(`
      SELECT ls.*, s.shop_name, s.logo,
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', sp.id, 'product_id', sp.product_id, 'name', p.name, 'price', p.price, 'special_price', sp.special_price, 'image', (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1))) 
         FROM stream_products sp JOIN products p ON sp.product_id = p.id WHERE sp.stream_id = ls.id) as products
      FROM live_streams ls
      JOIN shops s ON ls.shop_id = s.id
      WHERE ls.id = ?
    `, [req.params.id]);
    
    res.json(stream[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/stream/:id/chat', authMiddleware, async (req, res) => {
  try {
    const { message, message_type = 'text', metadata } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO stream_chat (stream_id, user_id, message, message_type, metadata) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, req.userId, message, message_type, JSON.stringify(metadata)]
    );
    
    const [user] = await pool.query('SELECT first_name, last_name, avatar FROM users WHERE id = ?', [req.userId]);
    
    res.json({ 
      id: result.insertId, 
      user: user[0], 
      message, 
      message_type,
      created_at: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stream/:id/chat', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const [messages] = await pool.query(`
      SELECT sc.*, u.first_name, u.last_name, u.avatar
      FROM stream_chat sc
      JOIN users u ON sc.user_id = u.id
      WHERE sc.stream_id = ?
      ORDER BY sc.created_at DESC
      LIMIT ?
    `, [req.params.id, Number(limit)]);
    
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/stream/:id/reaction', authMiddleware, async (req, res) => {
  try {
    const { reaction_type } = req.body;
    
    await pool.query(
      'INSERT INTO stream_reactions (stream_id, user_id, reaction_type) VALUES (?, ?, ?)',
      [req.params.id, req.userId, reaction_type]
    );
    
    if (reaction_type === 'like') {
      await pool.query('UPDATE live_streams SET likes = likes + 1 WHERE id = ?', [req.params.id]);
    }
    
    res.json({ message: 'Reaction added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/stream/:id/product/:productId/click', authMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE stream_products SET clicks = clicks + 1 WHERE stream_id = ? AND product_id = ?', [req.params.id, req.params.productId]);
    res.json({ message: 'Click tracked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/stream/:id/end', authMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE live_streams SET status = ?, ended_at = NOW() WHERE id = ?', ['ended', req.params.id]);
    await pool.query('UPDATE stream_participants SET left_at = NOW() WHERE stream_id = ? AND left_at IS NULL', [req.params.id]);
    
    const [booth] = await pool.query('SELECT expo_booth_id FROM live_streams WHERE id = ?', [req.params.id]);
    if (booth.length > 0 && booth[0].expo_booth_id) {
      await pool.query('UPDATE expo_booths SET is_live = FALSE WHERE id = ?', [booth[0].expo_booth_id]);
    }
    
    res.json({ message: 'Stream ended' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/expo/:expoId/streams', async (req, res) => {
  try {
    const [streams] = await pool.query(`
      SELECT ls.*, s.shop_name, s.logo, s.rating, eb.booth_number
      FROM live_streams ls
      JOIN shops s ON ls.shop_id = s.id
      JOIN expo_booths eb ON ls.expo_booth_id = eb.id
      WHERE eb.expo_id = ? AND ls.status = 'live'
      ORDER BY ls.viewers_count DESC
    `, [req.params.expoId]);
    
    res.json(streams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stream/:id/participants', async (req, res) => {
  try {
    const [participants] = await pool.query(`
      SELECT sp.*, u.first_name, u.last_name, u.avatar
      FROM stream_participants sp
      JOIN users u ON sp.user_id = u.id
      WHERE sp.stream_id = ? AND sp.left_at IS NULL
      ORDER BY sp.role, sp.joined_at
    `, [req.params.id]);
    
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
