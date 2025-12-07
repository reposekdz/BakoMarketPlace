import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

const router = express.Router();

router.post('/initial-data', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('2025', 10);
    
    const [adminUser] = await pool.query(
      'INSERT INTO users (role, email, password, first_name, last_name, is_seller) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
      ['admin', 'reponsekdz06@gmail.com', hashedPassword, 'Admin', 'Seller', true]
    );
    
    const adminId = adminUser.insertId || (await pool.query('SELECT id FROM users WHERE email = ?', ['reponsekdz06@gmail.com']))[0][0].id;
    
    const [shop] = await pool.query(
      'INSERT INTO shops (user_id, shop_name, shop_category, description, province, district, latitude, longitude, offers_delivery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)',
      [adminId, 'Bako Official Store', 'Electronics', 'Official Bako Marketplace Store', 'Kigali City', 'Gasabo', -1.9403, 29.8739, true]
    );
    
    const shopId = shop.insertId || (await pool.query('SELECT id FROM shops WHERE user_id = ?', [adminId]))[0][0].id;
    
    await pool.query('INSERT IGNORE INTO categories (name, slug, description) VALUES (?, ?, ?)', ['Electronics', 'electronics', 'Electronic devices and gadgets']);
    await pool.query('INSERT IGNORE INTO categories (name, slug, description) VALUES (?, ?, ?)', ['Fashion', 'fashion', 'Clothing and accessories']);
    await pool.query('INSERT IGNORE INTO categories (name, slug, description) VALUES (?, ?, ?)', ['Home & Living', 'home-living', 'Home decor and furniture']);
    
    res.json({ message: 'Initial data seeded successfully', adminId, shopId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
