import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [expos] = await pool.query('SELECT * FROM expos ORDER BY start_date DESC');
    res.json(expos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/booths', async (req, res) => {
  try {
    const [booths] = await pool.query(`
      SELECT eb.*, s.shop_name, s.rating, s.verified
      FROM expo_booths eb
      JOIN shops s ON eb.shop_id = s.id
      WHERE eb.expo_id = ?
    `, [req.params.id]);
    res.json(booths);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
