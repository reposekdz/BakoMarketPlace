import express from 'express';
import pool from '../config/database.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { placement } = req.query;
    const now = new Date().toISOString();
    
    let query = `
      SELECT * FROM advertisements 
      WHERE status = 'active' 
      AND start_date <= ? 
      AND end_date >= ?
    `;
    const params = [now, now];
    
    if (placement) {
      query += ' AND placement = ?';
      params.push(placement);
    }
    
    query += ' ORDER BY priority DESC, RAND() LIMIT 5';
    
    const [ads] = await pool.query(query, params);
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/track', async (req, res) => {
  try {
    const { ad_id, user_id, interaction_type, device_type, browser } = req.body;
    
    await pool.query(
      'INSERT INTO ad_interactions (ad_id, user_id, interaction_type, device_type, browser, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [ad_id, user_id, interaction_type, device_type, browser, req.ip]
    );
    
    if (interaction_type === 'impression') {
      await pool.query('UPDATE advertisements SET impressions = impressions + 1 WHERE id = ?', [ad_id]);
    } else if (interaction_type === 'click') {
      await pool.query('UPDATE advertisements SET clicks = clicks + 1 WHERE id = ?', [ad_id]);
      await pool.query('UPDATE advertisements SET ctr = (clicks / NULLIF(impressions, 0)) * 100 WHERE id = ?', [ad_id]);
    } else if (interaction_type === 'conversion') {
      await pool.query('UPDATE advertisements SET conversions = conversions + 1 WHERE id = ?', [ad_id]);
    }
    
    res.json({ message: 'Interaction tracked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin', adminAuthMiddleware, async (req, res) => {
  try {
    const [ads] = await pool.query(`
      SELECT a.*, 
        (SELECT COUNT(*) FROM ad_interactions WHERE ad_id = a.id AND interaction_type = 'impression') as total_impressions,
        (SELECT COUNT(*) FROM ad_interactions WHERE ad_id = a.id AND interaction_type = 'click') as total_clicks
      FROM advertisements a
      ORDER BY a.created_at DESC
    `);
    res.json(ads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/admin', adminAuthMiddleware, async (req, res) => {
  try {
    const { title, description, image_url, video_url, link_url, ad_type, placement, sponsor_name, sponsor_logo, start_date, end_date, budget, priority, target_audience } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO advertisements (title, description, image_url, video_url, link_url, ad_type, placement, sponsor_id, sponsor_name, sponsor_logo, start_date, end_date, budget, priority, target_audience, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, image_url, video_url, link_url, ad_type, placement, req.userId, sponsor_name, sponsor_logo, start_date, end_date, budget, priority, JSON.stringify(target_audience), 'active']
    );
    
    res.status(201).json({ id: result.insertId, message: 'Advertisement created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/admin/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const { title, description, image_url, video_url, link_url, ad_type, placement, start_date, end_date, budget, priority, status } = req.body;
    
    await pool.query(
      'UPDATE advertisements SET title = ?, description = ?, image_url = ?, video_url = ?, link_url = ?, ad_type = ?, placement = ?, start_date = ?, end_date = ?, budget = ?, priority = ?, status = ? WHERE id = ?',
      [title, description, image_url, video_url, link_url, ad_type, placement, start_date, end_date, budget, priority, status, req.params.id]
    );
    
    res.json({ message: 'Advertisement updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/admin/:id', adminAuthMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM advertisements WHERE id = ?', [req.params.id]);
    res.json({ message: 'Advertisement deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/analytics/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const [ad] = await pool.query('SELECT * FROM advertisements WHERE id = ?', [req.params.id]);
    const [interactions] = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        interaction_type,
        COUNT(*) as count
      FROM ad_interactions
      WHERE ad_id = ?
      GROUP BY DATE(created_at), interaction_type
      ORDER BY date DESC
    `, [req.params.id]);
    
    res.json({ ad: ad[0], interactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
