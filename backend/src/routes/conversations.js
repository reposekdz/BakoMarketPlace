import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [conversations] = await pool.query(`
      SELECT c.*, 
        CASE WHEN c.buyer_id = ? THEN s.first_name ELSE b.first_name END as other_name,
        CASE WHEN c.buyer_id = ? THEN s.avatar ELSE b.avatar END as other_avatar,
        p.name as product_name, p.price as product_price
      FROM conversations c
      LEFT JOIN users b ON c.buyer_id = b.id
      LEFT JOIN users s ON c.seller_id = s.id
      LEFT JOIN products p ON c.product_id = p.id
      WHERE c.buyer_id = ? OR c.seller_id = ?
      ORDER BY c.last_message_at DESC
    `, [req.userId, req.userId, req.userId, req.userId]);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { seller_id, product_id, message } = req.body;
    const [existing] = await pool.query(
      'SELECT id FROM conversations WHERE buyer_id = ? AND seller_id = ? AND product_id = ?',
      [req.userId, seller_id, product_id]
    );
    
    let conversationId;
    if (existing.length > 0) {
      conversationId = existing[0].id;
    } else {
      const [result] = await pool.query(
        'INSERT INTO conversations (buyer_id, seller_id, product_id, last_message) VALUES (?, ?, ?, ?)',
        [req.userId, seller_id, product_id, message]
      );
      conversationId = result.insertId;
    }
    
    await pool.query(
      'INSERT INTO conversation_messages (conversation_id, sender_id, message) VALUES (?, ?, ?)',
      [conversationId, req.userId, message]
    );
    
    await pool.query(
      'UPDATE conversations SET last_message = ?, last_message_at = NOW(), unread_seller = unread_seller + 1 WHERE id = ?',
      [message, conversationId]
    );
    
    res.json({ conversationId, message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const [messages] = await pool.query(`
      SELECT cm.*, u.first_name, u.avatar
      FROM conversation_messages cm
      JOIN users u ON cm.sender_id = u.id
      WHERE cm.conversation_id = ?
      ORDER BY cm.created_at ASC
    `, [req.params.id]);
    
    await pool.query(
      'UPDATE conversation_messages SET is_read = TRUE WHERE conversation_id = ? AND sender_id != ?',
      [req.params.id, req.userId]
    );
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/messages', authMiddleware, async (req, res) => {
  try {
    const { message, attachment_url, attachment_type } = req.body;
    await pool.query(
      'INSERT INTO conversation_messages (conversation_id, sender_id, message, attachment_url, attachment_type) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, req.userId, message, attachment_url, attachment_type]
    );
    
    const [conv] = await pool.query('SELECT buyer_id, seller_id FROM conversations WHERE id = ?', [req.params.id]);
    const isBuyer = conv[0].buyer_id === req.userId;
    
    await pool.query(
      `UPDATE conversations SET last_message = ?, last_message_at = NOW(), ${isBuyer ? 'unread_seller' : 'unread_buyer'} = ${isBuyer ? 'unread_seller' : 'unread_buyer'} + 1 WHERE id = ?`,
      [message, req.params.id]
    );
    
    res.json({ message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
