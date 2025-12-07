import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiverId, message, productId } = req.body;
    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, product_id, message) VALUES (?, ?, ?, ?)',
      [req.userId, receiverId, productId, message]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const [conversations] = await pool.query(`
      SELECT DISTINCT 
        CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as user_id,
        u.first_name, u.last_name, u.avatar
      FROM messages m
      JOIN users u ON u.id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END
      WHERE sender_id = ? OR receiver_id = ?
    `, [req.userId, req.userId, req.userId, req.userId]);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const [messages] = await pool.query(`
      SELECT m.*, u.first_name, u.last_name 
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `, [req.userId, req.params.userId, req.params.userId, req.userId]);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
