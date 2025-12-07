import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [items] = await pool.query(`
      SELECT w.*, p.name, p.price, p.rating, p.reviews_count,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
    `, [req.userId]);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    await pool.query('INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)', [req.userId, productId]);
    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:productId', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM wishlist WHERE user_id = ? AND product_id = ?', [req.userId, req.params.productId]);
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
