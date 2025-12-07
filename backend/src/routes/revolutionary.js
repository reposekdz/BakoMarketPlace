import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/voice-search', async (req, res) => {
  try {
    const { query_text, user_id } = req.body;
    
    const [products] = await pool.query(`
      SELECT p.*, 
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image,
        MATCH(p.name, p.description) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
      FROM products p
      WHERE MATCH(p.name, p.description) AGAINST(? IN NATURAL LANGUAGE MODE)
      ORDER BY relevance DESC
      LIMIT 20
    `, [query_text, query_text]);
    
    await pool.query(
      'INSERT INTO voice_search (user_id, query_text, results_count) VALUES (?, ?, ?)',
      [user_id, query_text, products.length]
    );
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/ai-recommend', authMiddleware, async (req, res) => {
  try {
    const [userBehavior] = await pool.query(`
      SELECT p.category, p.brand, COUNT(*) as frequency
      FROM product_views pv
      JOIN products p ON pv.product_id = p.id
      WHERE pv.user_id = ?
      GROUP BY p.category, p.brand
      ORDER BY frequency DESC
      LIMIT 5
    `, [req.userId]);
    
    const [purchases] = await pool.query(`
      SELECT p.category, AVG(p.price) as avg_price
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = ?
      GROUP BY p.category
    `, [req.userId]);
    
    let query = 'SELECT p.*, (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image FROM products p WHERE p.status = \"active\"';
    const params = [];
    
    if (userBehavior.length > 0) {
      const categories = userBehavior.map(b => b.category);
      query += ' AND p.category IN (?)';
      params.push(categories);
    }
    
    query += ' ORDER BY (p.rating * 0.3 + p.sales * 0.4 + p.views * 0.3) DESC LIMIT 30';
    
    const [recommendations] = await pool.query(query, params);
    
    for (const rec of recommendations) {
      const score = (rec.rating * 30 + rec.sales * 40 + rec.views * 30) / 100;
      await pool.query(
        'INSERT INTO ai_recommendations (user_id, product_id, score, algorithm) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE score = ?, algorithm = ?',
        [req.userId, rec.id, score, 'collaborative_filtering', score, 'collaborative_filtering']
      );
    }
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/social-shopping/create', authMiddleware, async (req, res) => {
  try {
    const { friend_id, activity_type, product_ids } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO social_shopping (user_id, friend_id, activity_type, product_ids) VALUES (?, ?, ?, ?)',
      [req.userId, friend_id, activity_type, JSON.stringify(product_ids)]
    );
    
    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
      [friend_id, 'Social Shopping Invite', `You've been invited to ${activity_type}`, 'system']
    );
    
    res.json({ id: result.insertId, message: 'Social shopping session created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/social-shopping', authMiddleware, async (req, res) => {
  try {
    const [sessions] = await pool.query(`
      SELECT ss.*, 
        u1.first_name as user_name, u1.avatar as user_avatar,
        u2.first_name as friend_name, u2.avatar as friend_avatar
      FROM social_shopping ss
      JOIN users u1 ON ss.user_id = u1.id
      JOIN users u2 ON ss.friend_id = u2.id
      WHERE (ss.user_id = ? OR ss.friend_id = ?) AND ss.status = 'active'
      ORDER BY ss.created_at DESC
    `, [req.userId, req.userId]);
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/virtual-try-room', authMiddleware, async (req, res) => {
  try {
    const { products_tried, body_measurements, preferences } = req.body;
    const sessionId = `VTR-${Date.now()}-${req.userId}`;
    
    await pool.query(
      'INSERT INTO virtual_try_room (user_id, session_id, products_tried, body_measurements, preferences) VALUES (?, ?, ?, ?, ?)',
      [req.userId, sessionId, JSON.stringify(products_tried), JSON.stringify(body_measurements), JSON.stringify(preferences)]
    );
    
    res.json({ session_id: sessionId, message: 'Virtual try room session created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/virtual-try-room/history', authMiddleware, async (req, res) => {
  try {
    const [sessions] = await pool.query(
      'SELECT * FROM virtual_try_room WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [req.userId]
    );
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/blockchain/create-contract', authMiddleware, async (req, res) => {
  try {
    const { order_id, blockchain = 'ethereum' } = req.body;
    
    const contractAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    const [result] = await pool.query(
      'INSERT INTO smart_contracts (order_id, contract_address, blockchain, transaction_hash, status) VALUES (?, ?, ?, ?, ?)',
      [order_id, contractAddress, blockchain, transactionHash, 'executed']
    );
    
    res.json({ 
      contract_id: result.insertId, 
      contract_address: contractAddress,
      transaction_hash: transactionHash,
      message: 'Smart contract created' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/blockchain/verify/:orderId', async (req, res) => {
  try {
    const [contracts] = await pool.query(
      'SELECT * FROM smart_contracts WHERE order_id = ?',
      [req.params.orderId]
    );
    
    res.json(contracts[0] || { verified: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
