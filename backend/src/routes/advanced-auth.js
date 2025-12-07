import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'bako-marketplace-secret-key-2025';

// Enhanced registration with email verification
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, country, language } = req.body;
    
    // Check if user exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const result = await pool.query(`
      INSERT INTO users (email, password, first_name, last_name, phone, country, language, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, email, first_name, last_name
    `, [email, hashedPassword, firstName, lastName, phone, country || 'US', language || 'en']);
    
    const user = result.rows[0];
    
    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    
    // Create welcome notification
    await pool.query(`
      INSERT INTO notifications (user_id, type, title, message, created_at)
      VALUES ($1, 'welcome', 'Welcome to Bako!', 'Thank you for joining our marketplace', NOW())
    `, [user.id]);
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enhanced login with session tracking
router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    
    // Get user
    const result = await pool.query(`
      SELECT id, email, password, first_name, last_name, is_seller, is_admin, status
      FROM users WHERE email = $1
    `, [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Check if account is active
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is suspended or inactive' });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const expiresIn = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      JWT_SECRET,
      { expiresIn }
    );
    
    // Update last login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);
    
    // Create login session
    await pool.query(`
      INSERT INTO user_sessions (user_id, token, ip_address, user_agent, created_at, expires_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW() + INTERVAL '${rememberMe ? '30' : '7'} days')
    `, [user.id, token, req.ip, req.headers['user-agent']]);
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isSeller: user.is_seller,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Social login (Google, Facebook, Apple)
router.post('/social-login', async (req, res) => {
  try {
    const { provider, token, email, firstName, lastName, avatar } = req.body;
    
    // Check if user exists
    let result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    let user;
    if (result.rows.length === 0) {
      // Create new user
      result = await pool.query(`
        INSERT INTO users (email, first_name, last_name, avatar, auth_provider, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id, email, first_name, last_name
      `, [email, firstName, lastName, avatar, provider]);
      user = result.rows[0];
    } else {
      user = result.rows[0];
    }
    
    // Generate JWT
    const jwtToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
    
    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Password reset request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    const userId = result.rows[0].id;
    const resetToken = jwt.sign({ userId, type: 'reset' }, JWT_SECRET, { expiresIn: '1h' });
    
    // Store reset token
    await pool.query(`
      INSERT INTO password_resets (user_id, token, created_at, expires_at)
      VALUES ($1, $2, NOW(), NOW() + INTERVAL '1 hour')
    `, [userId, resetToken]);
    
    // In production, send email here
    res.json({ success: true, message: 'Password reset link sent to email', resetToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'reset') {
      return res.status(400).json({ error: 'Invalid token' });
    }
    
    // Check if token is still valid
    const result = await pool.query(`
      SELECT user_id FROM password_resets 
      WHERE token = $1 AND expires_at > NOW() AND used = false
    `, [token]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Token expired or already used' });
    }
    
    const userId = result.rows[0].user_id;
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
    
    // Mark token as used
    await pool.query('UPDATE password_resets SET used = true WHERE token = $1', [token]);
    
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify email
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    await pool.query(`
      UPDATE users SET email_verified = true, verified_at = NOW() 
      WHERE id = $1
    `, [decoded.userId]);
    
    res.json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout (invalidate session)
router.post('/logout', async (req, res) => {
  try {
    const { token } = req.body;
    
    await pool.query(`
      UPDATE user_sessions SET active = false, logged_out_at = NOW()
      WHERE token = $1
    `, [token]);
    
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const result = await pool.query(`
      SELECT id, email, first_name, last_name, phone, avatar, country, language,
        is_seller, is_admin, email_verified, created_at
      FROM users WHERE id = $1
    `, [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
