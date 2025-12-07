import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [items] = await pool.query(`
      SELECT c.*, p.name, p.price, p.stock, 
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [req.userId]);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity, variationDetails } = req.body;
    const [existing] = await pool.query('SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?', [req.userId, productId]);
    
    if (existing.length > 0) {
      await pool.query('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity, existing[0].id]);
    } else {
      await pool.query('INSERT INTO cart (user_id, product_id, quantity, variation_details) VALUES (?, ?, ?, ?)', 
        [req.userId, productId, quantity, JSON.stringify(variationDetails)]);
    }
    res.json({ message: 'Added to cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity === 0) {
      await pool.query('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    } else {
      await pool.query('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.userId]);
    }
    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart WHERE user_id = ?', [req.userId]);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
