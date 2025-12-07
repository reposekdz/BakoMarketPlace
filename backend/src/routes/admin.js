import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import { adminAuthMiddleware } from '../middleware/adminAuth.js';

const router = express.Router();

// Admin login with static credentials
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email === 'reponsekdz06@gmail.com' && password === '2025') {
      const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, 'admin']);
      
      if (users.length === 0) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
          'INSERT INTO users (name, email, password, role, is_email_verified, is_active) VALUES (?, ?, ?, ?, ?, ?)',
          ['Admin Seller', email, hashedPassword, 'admin', true, true]
        );
        
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        return res.json({
          token,
          user: {
            id: result.insertId,
            name: 'Admin Seller',
            email,
            role: 'admin'
          }
        });
      }
      
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ userId: users[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      await pool.query('INSERT INTO activity_logs (user_id, action, entity_type, ip_address) VALUES (?, ?, ?, ?)',
        [users[0].id, 'login', 'admin', req.ip]);
      
      return res.json({
        token,
        user: {
          id: users[0].id,
          name: users[0].name,
          email: users[0].email,
          role: users[0].role
        }
      });
    }
    
    res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products with filters
router.get('/products', adminAuthMiddleware, async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 20 } = req.query;
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];
    
    if (search) {
      query += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }
    if (status) {
      query += ' AND p.is_published = ?';
      params.push(status === 'published' ? 1 : 0);
    }
    
    const offset = (page - 1) * limit;
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);
    
    const [products] = await pool.query(query, params);
    const [total] = await pool.query('SELECT COUNT(*) as count FROM products');
    
    res.json({ products, total: total[0].count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product
router.post('/products', adminAuthMiddleware, async (req, res) => {
  try {
    const { name, description, price, compare_at_price, sku, quantity, category_id, images, is_published } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO products (name, slug, description, price, compare_at_price, sku, quantity, category_id, vendor_id, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, name.toLowerCase().replace(/\s+/g, '-'), description, price, compare_at_price, sku, quantity, category_id, req.userId, is_published || false]
    );
    
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await pool.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)',
          [result.insertId, images[i], i === 0, i]
        );
      }
    }
    
    await pool.query('INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
      [req.userId, 'create', 'product', result.insertId]);
    
    res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/products/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const { name, description, price, compare_at_price, sku, quantity, category_id, is_published } = req.body;
    
    await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, compare_at_price = ?, sku = ?, quantity = ?, category_id = ?, is_published = ? WHERE id = ?',
      [name, description, price, compare_at_price, sku, quantity, category_id, is_published, req.params.id]
    );
    
    await pool.query('INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
      [req.userId, 'update', 'product', req.params.id]);
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/products/:id', adminAuthMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    
    await pool.query('INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
      [req.userId, 'delete', 'product', req.params.id]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all categories
router.get('/categories', adminAuthMiddleware, async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create category
router.post('/categories', adminAuthMiddleware, async (req, res) => {
  try {
    const { name, description, parent_id } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description, parent_id) VALUES (?, ?, ?, ?)',
      [name, slug, description, parent_id]
    );
    
    res.status(201).json({ id: result.insertId, message: 'Category created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
router.get('/stats', adminAuthMiddleware, async (req, res) => {
  try {
    const [products] = await pool.query('SELECT COUNT(*) as count FROM products');
    const [orders] = await pool.query('SELECT COUNT(*) as count, SUM(total) as revenue FROM orders');
    const [users] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    const [vendors] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "vendor"');
    
    const [recentOrders] = await pool.query(
      'SELECT o.*, u.name as customer_name FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 10'
    );
    
    const [topProducts] = await pool.query(
      'SELECT p.*, COUNT(oi.id) as order_count FROM products p LEFT JOIN order_items oi ON p.id = oi.product_id GROUP BY p.id ORDER BY order_count DESC LIMIT 10'
    );
    
    res.json({
      totalProducts: products[0].count,
      totalOrders: orders[0].count,
      totalRevenue: orders[0].revenue || 0,
      totalUsers: users[0].count,
      totalVendors: vendors[0].count,
      recentOrders,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get activity logs
router.get('/logs', adminAuthMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    
    const [logs] = await pool.query(
      'SELECT al.*, u.name as user_name FROM activity_logs al LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT ? OFFSET ?',
      [Number(limit), offset]
    );
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all sellers
router.get('/sellers', adminAuthMiddleware, async (req, res) => {
  try {
    const [sellers] = await pool.query(
      'SELECT u.*, s.shop_name, s.rating, s.total_sales, s.status FROM users u LEFT JOIN shops s ON u.id = s.user_id WHERE u.role IN ("vendor", "admin") ORDER BY u.created_at DESC'
    );
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update seller status
router.put('/sellers/:id/status', adminAuthMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [status === 'active', req.params.id]);
    
    await pool.query('INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES (?, ?, ?, ?)',
      [req.userId, 'update_status', 'seller', req.params.id]);
    
    res.json({ message: 'Seller status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Translations management
router.get('/translations', adminAuthMiddleware, async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const [translations] = await pool.query('SELECT * FROM translations WHERE language = ?', [language]);
    res.json(translations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/translations', adminAuthMiddleware, async (req, res) => {
  try {
    const { key, language, value } = req.body;
    await pool.query(
      'INSERT INTO translations (key, language, value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE value = ?',
      [key, language, value, value]
    );
    res.json({ message: 'Translation saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
