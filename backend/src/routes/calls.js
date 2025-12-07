import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/initiate', authMiddleware, async (req, res) => {
  try {
    const { receiver_id, conversation_id, call_type } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO video_calls (caller_id, receiver_id, conversation_id, call_type, status) VALUES (?, ?, ?, ?, ?)',
      [req.userId, receiver_id, conversation_id, call_type, 'ringing']
    );
    
    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?)',
      [receiver_id, `Incoming ${call_type} call`, 'Someone is calling you', 'system', `/calls/${result.insertId}`]
    );
    
    res.json({ callId: result.insertId, status: 'ringing' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/accept', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE video_calls SET status = ?, started_at = NOW() WHERE id = ? AND receiver_id = ?',
      ['active', req.params.id, req.userId]
    );
    res.json({ message: 'Call accepted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/reject', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE video_calls SET status = ?, ended_at = NOW() WHERE id = ? AND receiver_id = ?',
      ['rejected', req.params.id, req.userId]
    );
    res.json({ message: 'Call rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/end', authMiddleware, async (req, res) => {
  try {
    const { duration } = req.body;
    await pool.query(
      'UPDATE video_calls SET status = ?, ended_at = NOW(), duration = ? WHERE id = ? AND (caller_id = ? OR receiver_id = ?)',
      ['ended', duration, req.params.id, req.userId, req.userId]
    );
    res.json({ message: 'Call ended' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', authMiddleware, async (req, res) => {
  try {
    const [calls] = await pool.query(`
      SELECT vc.*, 
        CASE WHEN vc.caller_id = ? THEN u2.first_name ELSE u1.first_name END as other_name,
        CASE WHEN vc.caller_id = ? THEN u2.avatar ELSE u1.avatar END as other_avatar
      FROM video_calls vc
      JOIN users u1 ON vc.caller_id = u1.id
      JOIN users u2 ON vc.receiver_id = u2.id
      WHERE vc.caller_id = ? OR vc.receiver_id = ?
      ORDER BY vc.created_at DESC
      LIMIT 50
    `, [req.userId, req.userId, req.userId, req.userId]);
    res.json(calls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
