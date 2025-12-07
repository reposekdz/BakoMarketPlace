import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM expo_events WHERE 1=1';
    const params = [];
    
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY start_date DESC';
    
    const [expos] = await pool.query(query, params);
    
    for (const expo of expos) {
      const [booths] = await pool.query('SELECT COUNT(*) as count FROM expo_booths WHERE expo_id = ?', [expo.id]);
      expo.booths_count = booths[0].count;
    }
    
    res.json(expos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [expos] = await pool.query('SELECT * FROM expo_events WHERE id = ?', [req.params.id]);
    if (expos.length === 0) {
      return res.status(404).json({ error: 'Expo not found' });
    }
    
    const [booths] = await pool.query(`
      SELECT eb.*, s.shop_name, s.logo, s.rating
      FROM expo_booths eb
      JOIN shops s ON eb.shop_id = s.id
      WHERE eb.expo_id = ?
    `, [req.params.id]);
    
    const [attendees] = await pool.query('SELECT COUNT(*) as count FROM expo_attendees WHERE expo_id = ?', [req.params.id]);
    
    res.json({ expo: expos[0], booths, attendees_count: attendees[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', adminAuthMiddleware, async (req, res) => {
  try {
    const { name, description, category, start_date, end_date, banner_image, video_url, location, is_virtual, max_booths, booth_price, featured } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO expo_events (name, description, category, start_date, end_date, banner_image, video_url, location, is_virtual, max_booths, booth_price, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, category, start_date, end_date, banner_image, video_url, location, is_virtual, max_booths, booth_price, featured, 'upcoming']
    );
    
    res.status(201).json({ id: result.insertId, message: 'Expo created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/register', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'INSERT INTO expo_attendees (expo_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE registration_date = CURRENT_TIMESTAMP',
      [req.params.id, req.userId]
    );
    
    await pool.query('UPDATE expo_events SET attendees_count = attendees_count + 1 WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Registered for expo' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/booth', authMiddleware, async (req, res) => {
  try {
    const { booth_type, booth_design } = req.body;
    
    const [shops] = await pool.query('SELECT id FROM shops WHERE user_id = ? LIMIT 1', [req.userId]);
    if (shops.length === 0) {
      return res.status(400).json({ error: 'No shop found' });
    }
    
    const [expo] = await pool.query('SELECT booth_price FROM expo_events WHERE id = ?', [req.params.id]);
    const price = expo[0].booth_price;
    
    const [boothCount] = await pool.query('SELECT COUNT(*) as count FROM expo_booths WHERE expo_id = ?', [req.params.id]);
    const boothNumber = `B${String(boothCount[0].count + 1).padStart(3, '0')}`;
    
    const [result] = await pool.query(
      'INSERT INTO expo_booths (expo_id, shop_id, booth_number, booth_type, booth_design) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, shops[0].id, boothNumber, booth_type, JSON.stringify(booth_design)]
    );
    
    res.status(201).json({ id: result.insertId, booth_number: boothNumber, message: 'Booth booked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/booth/:id/live', authMiddleware, async (req, res) => {
  try {
    const { is_live } = req.body;
    
    await pool.query('UPDATE expo_booths SET is_live = ? WHERE id = ?', [is_live, req.params.id]);
    
    res.json({ message: 'Booth status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/booth/:id/visit', authMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE expo_booths SET viewers_count = viewers_count + 1, total_views = total_views + 1 WHERE id = ?', [req.params.id]);
    
    const [booth] = await pool.query('SELECT expo_id FROM expo_booths WHERE id = ?', [req.params.id]);
    if (booth.length > 0) {
      await pool.query(
        'UPDATE expo_attendees SET booths_visited = JSON_ARRAY_APPEND(COALESCE(booths_visited, \"[]\"), \"$\", ?) WHERE expo_id = ? AND user_id = ?',
        [req.params.id, booth[0].expo_id, req.userId]
      );
    }
    
    res.json({ message: 'Visit tracked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/analytics/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const [expo] = await pool.query('SELECT * FROM expo_events WHERE id = ?', [req.params.id]);
    const [booths] = await pool.query('SELECT COUNT(*) as count, SUM(revenue) as revenue FROM expo_booths WHERE expo_id = ?', [req.params.id]);
    const [attendees] = await pool.query('SELECT COUNT(*) as count FROM expo_attendees WHERE expo_id = ?', [req.params.id]);
    const [dailyStats] = await pool.query(`
      SELECT DATE(registration_date) as date, COUNT(*) as registrations
      FROM expo_attendees
      WHERE expo_id = ?
      GROUP BY DATE(registration_date)
      ORDER BY date DESC
    `, [req.params.id]);
    
    res.json({
      expo: expo[0],
      booths: booths[0],
      attendees: attendees[0].count,
      daily_stats: dailyStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
