import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// Get all expos with advanced filtering
router.get('/expos', async (req, res) => {
  try {
    const { status, category, search, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT e.*, 
        COUNT(DISTINCT eb.id) as booth_count,
        COUNT(DISTINCT ea.user_id) as attendee_count,
        AVG(er.rating) as avg_rating
      FROM expos e
      LEFT JOIN expo_booths eb ON e.id = eb.expo_id
      LEFT JOIN expo_attendees ea ON e.id = ea.expo_id
      LEFT JOIN expo_reviews er ON e.id = er.expo_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (status) {
      query += ` AND e.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    if (category) {
      query += ` AND e.category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (search) {
      query += ` AND (e.name ILIKE $${paramIndex} OR e.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    query += ` GROUP BY e.id ORDER BY e.start_date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expo statistics
router.get('/expos/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM expo_booths WHERE expo_id = $1) as total_booths,
        (SELECT COUNT(*) FROM expo_attendees WHERE expo_id = $1) as total_attendees,
        (SELECT COUNT(*) FROM expo_products WHERE expo_id = $1) as total_products,
        (SELECT COUNT(*) FROM expo_deals WHERE expo_id = $1 AND active = true) as active_deals,
        (SELECT COUNT(DISTINCT country) FROM expo_attendees WHERE expo_id = $1) as countries,
        (SELECT AVG(rating) FROM expo_reviews WHERE expo_id = $1) as avg_rating
    `, [id]);
    
    res.json(stats.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get live booths
router.get('/expos/:id/live-booths', async (req, res) => {
  try {
    const { id } = req.params;
    
    const booths = await pool.query(`
      SELECT eb.*, s.name as shop_name, s.logo, s.rating,
        COUNT(DISTINCT ep.id) as product_count,
        COUNT(DISTINCT ebv.user_id) as viewer_count,
        ed.discount_percentage as special_offer
      FROM expo_booths eb
      JOIN shops s ON eb.shop_id = s.id
      LEFT JOIN expo_products ep ON eb.id = ep.booth_id
      LEFT JOIN expo_booth_viewers ebv ON eb.id = ebv.booth_id AND ebv.is_active = true
      LEFT JOIN expo_deals ed ON eb.id = ed.booth_id AND ed.active = true
      WHERE eb.expo_id = $1 AND eb.is_live = true
      GROUP BY eb.id, s.id, ed.id
      ORDER BY viewer_count DESC
    `, [id]);
    
    res.json(booths.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join expo as attendee
router.post('/expos/:id/join', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, country } = req.body;
    
    await pool.query(`
      INSERT INTO expo_attendees (expo_id, user_id, country, joined_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (expo_id, user_id) DO UPDATE SET joined_at = NOW()
    `, [id, userId, country]);
    
    res.json({ success: true, message: 'Successfully joined expo' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Visit booth (track viewer)
router.post('/booths/:id/visit', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    await pool.query(`
      INSERT INTO expo_booth_viewers (booth_id, user_id, is_active, last_seen)
      VALUES ($1, $2, true, NOW())
      ON CONFLICT (booth_id, user_id) 
      DO UPDATE SET is_active = true, last_seen = NOW()
    `, [id, userId]);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leave booth
router.post('/booths/:id/leave', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    await pool.query(`
      UPDATE expo_booth_viewers 
      SET is_active = false 
      WHERE booth_id = $1 AND user_id = $2
    `, [id, userId]);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expo deals
router.get('/expos/:id/deals', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deals = await pool.query(`
      SELECT ed.*, p.name as product_name, p.image, p.price,
        s.name as shop_name, eb.booth_number
      FROM expo_deals ed
      JOIN products p ON ed.product_id = p.id
      JOIN expo_booths eb ON ed.booth_id = eb.id
      JOIN shops s ON eb.shop_id = s.id
      WHERE ed.expo_id = $1 AND ed.active = true
      ORDER BY ed.discount_percentage DESC
    `, [id]);
    
    res.json(deals.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rate expo
router.post('/expos/:id/rate', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, rating, review } = req.body;
    
    await pool.query(`
      INSERT INTO expo_reviews (expo_id, user_id, rating, review, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (expo_id, user_id) 
      DO UPDATE SET rating = $3, review = $4, updated_at = NOW()
    `, [id, userId, rating, review]);
    
    res.json({ success: true, message: 'Rating submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bookmark expo
router.post('/expos/:id/bookmark', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    await pool.query(`
      INSERT INTO expo_bookmarks (expo_id, user_id, created_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (expo_id, user_id) DO NOTHING
    `, [id, userId]);
    
    res.json({ success: true, message: 'Expo bookmarked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove bookmark
router.delete('/expos/:id/bookmark', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    await pool.query(`
      DELETE FROM expo_bookmarks 
      WHERE expo_id = $1 AND user_id = $2
    `, [id, userId]);
    
    res.json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
