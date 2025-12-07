import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.query('SELECT * FROM users WHERE id = ? AND role = ?', [decoded.userId, 'admin']);
    
    if (users.length === 0) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.userId = decoded.userId;
    req.user = users[0];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
