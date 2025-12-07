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
    let query = `
      SELECT p.*, c.name as category_name, s.shop_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image,
        (SELECT COUNT(*) FROM product_images WHERE product_id = p.id) as image_count,
        (SELECT COUNT(*) FROM product_variations WHERE product_id = p.id) as variation_count
      FROM products p 
      LEFT JOIN categories c ON p.category = c.slug
      LEFT JOIN shops s ON p.shop_id = s.id
      WHERE 1=1
    `;
    const params = [];
    
    if (search) {
      query += ' AND (p.name LIKE ? OR p.sku LIKE ? OR p.brand LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }
    if (status === 'active') {
      query += ' AND p.status = "active"';
    } else if (status === 'draft') {
      query += ' AND p.status = "draft"';
    } else if (status === 'out_of_stock') {
      query += ' AND p.stock <= 0';
    }
    
    const offset = (page - 1) * limit;
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);
    
    const [products] = await pool.query(query, params);
    const [total] = await pool.query('SELECT COUNT(*) as count FROM products');
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
        SUM(CASE WHEN stock <= 0 THEN 1 ELSE 0 END) as out_of_stock,
        SUM(views) as total_views,
        SUM(sales) as total_sales
      FROM products
    `);
    
    res.json({ products, total: total[0].count, stats: stats[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product
router.post('/products', adminAuthMiddleware, async (req, res) => {
  try {
    const { name, description, price, original_price, category, brand, sku, stock, images, variations, featured, status } = req.body;
    
    const [shops] = await pool.query('SELECT id FROM shops WHERE user_id = ? LIMIT 1', [req.userId]);
    const shopId = shops.length > 0 ? shops[0].id : null;
    
    if (!shopId) {
      return res.status(400).json({ error: 'No shop found for admin user' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO products (shop_id, name, description, price, original_price, category, brand, sku, stock, featured, status, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [shopId, name, description, price, original_price || price, category, brand, sku, stock, featured || false, status || 'active', 0]
    );
    
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await pool.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
          [result.insertId, images[i], i === 0, i]
        );
      }
    }
    
    if (variations && variations.length > 0) {
      for (const variation of variations) {
        await pool.query(
          'INSERT INTO product_variations (product_id, type, value, price_modifier, stock) VALUES (?, ?, ?, ?, ?)',
          [result.insertId, variation.type, variation.value, variation.price_modifier || 0, variation.stock || 0]
        );
      }
    }
    
    await pool.query('INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.userId, 'create', 'product', result.insertId, JSON.stringify({ name, price, category })]);
    
    res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.get('/products/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, s.shop_name,
        (SELECT JSON_ARRAYAGG(image_url) FROM product_images WHERE product_id = p.id) as images,
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('type', type, 'value', value, 'price_modifier', price_modifier, 'stock', stock)) FROM product_variations WHERE product_id = p.id) as variations
      FROM products p
      LEFT JOIN shops s ON p.shop_id = s.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/products/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const { name, description, price, original_price, category, brand, sku, stock, featured, status, images, variations } = req.body;
    
    await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, original_price = ?, category = ?, brand = ?, sku = ?, stock = ?, featured = ?, status = ? WHERE id = ?',
      [name, description, price, original_price, category, brand, sku, stock, featured, status, req.params.id]
    );
    
    if (images) {
      await pool.query('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);
      for (let i = 0; i < images.length; i++) {
        await pool.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
          [req.params.id, images[i], i === 0, i]
        );
      }
    }
    
    if (variations) {
      await pool.query('DELETE FROM product_variations WHERE product_id = ?', [req.params.id]);
      for (const variation of variations) {
        await pool.query(
          'INSERT INTO product_variations (product_id, type, value, price_modifier, stock) VALUES (?, ?, ?, ?, ?)',
          [req.params.id, variation.type, variation.value, variation.price_modifier || 0, variation.stock || 0]
        );
      }
    }
    
    await pool.query('INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.userId, 'update', 'product', req.params.id, JSON.stringify({ name, price, status })]);
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/products/:id', adminAuthMiddleware, async (req, res) => {
  try {
    const [product] = await pool.query('SELECT name FROM products WHERE id = ?', [req.params.id]);
    
    await pool.query('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);
    await pool.query('DELETE FROM product_variations WHERE product_id = ?', [req.params.id]);
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    
    await pool.query('INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)',
      [req.userId, 'delete', 'product', req.params.id, JSON.stringify({ name: product[0]?.name })]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products/bulk-update', adminAuthMiddleware, async (req, res) => {
  try {
    const { productIds, updates } = req.body;
    
    for (const id of productIds) {
      const updateFields = [];
      const updateValues = [];
      
      if (updates.status) {
        updateFields.push('status = ?');
        updateValues.push(updates.status);
      }
      if (updates.featured !== undefined) {
        updateFields.push('featured = ?');
        updateValues.push(updates.featured);
      }
      if (updates.price) {
        updateFields.push('price = ?');
        updateValues.push(updates.price);
      }
      
      if (updateFields.length > 0) {
        updateValues.push(id);
        await pool.query(
          `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
          updateValues
        );
      }
    }
    
    await pool.query('INSERT INTO activity_logs (user_id, action, entity_type, details) VALUES (?, ?, ?, ?)',
      [req.userId, 'bulk_update', 'product', JSON.stringify({ count: productIds.length, updates })]);
    
    res.json({ message: `${productIds.length} products updated successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products/bulk-delete', adminAuthMiddleware, async (req, res) => {
  try {
    const { productIds } = req.body;
    
    await pool.query('DELETE FROM product_images WHERE product_id IN (?)', [productIds]);
    await pool.query('DELETE FROM product_variations WHERE product_id IN (?)', [productIds]);
    await pool.query('DELETE FROM products WHERE id IN (?)', [productIds]);
    
    await pool.query('INSERT INTO activity_logs (user_id, action, entity_type, details) VALUES (?, ?, ?, ?)',
      [req.userId, 'bulk_delete', 'product', JSON.stringify({ count: productIds.length })]);
    
    res.json({ message: `${productIds.length} products deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products/:id/duplicate', adminAuthMiddleware, async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = products[0];
    const [result] = await pool.query(
      'INSERT INTO products (shop_id, name, description, price, original_price, category, brand, sku, stock, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [product.shop_id, `${product.name} (Copy)`, product.description, product.price, product.original_price, product.category, product.brand, `${product.sku}-COPY`, product.stock, false, 'draft']
    );
    
    const [images] = await pool.query('SELECT * FROM product_images WHERE product_id = ?', [req.params.id]);
    for (const img of images) {
      await pool.query(
        'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
        [result.insertId, img.image_url, img.is_primary, img.display_order]
      );
    }
    
    res.json({ id: result.insertId, message: 'Product duplicated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products/import', adminAuthMiddleware, async (req, res) => {
  try {
    const { products } = req.body;
    const imported = [];
    
    const [shops] = await pool.query('SELECT id FROM shops WHERE user_id = ? LIMIT 1', [req.userId]);
    const shopId = shops[0]?.id;
    
    for (const product of products) {
      const [result] = await pool.query(
        'INSERT INTO products (shop_id, name, description, price, original_price, category, brand, sku, stock, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [shopId, product.name, product.description, product.price, product.original_price, product.category, product.brand, product.sku, product.stock, 'draft']
      );
      imported.push(result.insertId);
    }
    
    res.json({ message: `${imported.length} products imported successfully`, imported });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/products/export', adminAuthMiddleware, async (req, res) => {
  try {
    const [products] = await pool.query(`
      SELECT p.*, s.shop_name,
        (SELECT GROUP_CONCAT(image_url) FROM product_images WHERE product_id = p.id) as images
      FROM products p
      LEFT JOIN shops s ON p.shop_id = s.id
    `);
    
    res.json(products);
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
