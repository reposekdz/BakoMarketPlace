import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/product/:productId', async (req, res) => {
  try {
    const [reviews] = await pool.query(`
      SELECT r.*, u.first_name, u.last_name, u.avatar,
      (SELECT JSON_ARRAYAGG(image_url) FROM review_images WHERE review_id = r.id) as images
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `, [req.params.productId]);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, rating, comment, images } = req.body;
    const [result] = await pool.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [productId, req.userId, rating, comment]
    );
    
    if (images && images.length > 0) {
      for (const img of images) {
        await pool.query('INSERT INTO review_images (review_id, image_url) VALUES (?, ?)', [result.insertId, img]);
      }
    }
    
    await pool.query(`
      UPDATE products SET 
      rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ?),
      reviews_count = (SELECT COUNT(*) FROM reviews WHERE product_id = ?)
      WHERE id = ?
    `, [productId, productId, productId]);
    
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/helpful', authMiddleware, async (req, res) => {
  try {
    await pool.query('UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Marked as helpful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
