import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, province, district, search, page = 1, limit = 20 } = req.query;
    let query = `
      SELECT s.*, u.first_name, u.last_name, u.avatar,
        (SELECT COUNT(*) FROM products WHERE shop_id = s.id AND status = 'active') as product_count,
        (SELECT COUNT(*) FROM orders WHERE shop_id = s.id) as order_count
      FROM shops s
      JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND s.shop_category = ?';
      params.push(category);
    }
    if (province) {
      query += ' AND s.province = ?';
      params.push(province);
    }
    if (district) {
      query += ' AND s.district = ?';
      params.push(district);
    }
    if (search) {
      query += ' AND (s.shop_name LIKE ? OR s.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    const offset = (page - 1) * limit;
    query += ' ORDER BY s.verified DESC, s.rating DESC, s.total_sales DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const [shops] = await pool.query(query, params);
    res.json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [shops] = await pool.query(`
      SELECT s.*, u.first_name, u.last_name, u.email, u.phone, u.avatar,
        (SELECT COUNT(*) FROM products WHERE shop_id = s.id AND status = 'active') as product_count,
        (SELECT COUNT(*) FROM orders WHERE shop_id = s.id) as order_count,
        (SELECT COUNT(*) FROM reviews r JOIN products p ON r.product_id = p.id WHERE p.shop_id = s.id) as review_count
      FROM shops s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `, [req.params.id]);

    if (shops.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(shops[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/products', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort = 'newest' } = req.query;
    let query = `
      SELECT p.*,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image
      FROM products p
      WHERE p.shop_id = ? AND p.status = 'active'
    `;
    const params = [req.params.id];

    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(maxPrice);
    }

    if (sort === 'price_asc') query += ' ORDER BY p.price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY p.price DESC';
    else if (sort === 'popular') query += ' ORDER BY p.sales DESC, p.views DESC';
    else query += ' ORDER BY p.created_at DESC';

    const [products] = await pool.query(query, params);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/follow', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const [existing] = await pool.query(
      'SELECT id FROM shop_followers WHERE user_id = ? AND shop_id = ?',
      [userId, req.params.id]
    );
    
    if (existing.length > 0) {
      await pool.query('DELETE FROM shop_followers WHERE user_id = ? AND shop_id = ?', [userId, req.params.id]);
      await pool.query('UPDATE shops SET followers = GREATEST(followers - 1, 0) WHERE id = ?', [req.params.id]);
      return res.json({ message: 'Shop unfollowed', following: false });
    }
    
    await pool.query('INSERT INTO shop_followers (user_id, shop_id) VALUES (?, ?)', [userId, req.params.id]);
    await pool.query('UPDATE shops SET followers = followers + 1 WHERE id = ?', [req.params.id]);
    
    const [shop] = await pool.query('SELECT user_id, shop_name FROM shops WHERE id = ?', [req.params.id]);
    if (shop.length > 0) {
      await pool.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        [shop[0].user_id, 'New Follower', `Someone started following ${shop[0].shop_name}`, 'system']
      );
    }
    
    res.json({ message: 'Shop followed', following: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/followers', async (req, res) => {
  try {
    const [followers] = await pool.query(`
      SELECT u.id, u.first_name, u.last_name, u.avatar, sf.created_at
      FROM shop_followers sf
      JOIN users u ON sf.user_id = u.id
      WHERE sf.shop_id = ?
      ORDER BY sf.created_at DESC
    `, [req.params.id]);
    res.json(followers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/analytics', async (req, res) => {
  try {
    const [analytics] = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as views
      FROM product_views pv
      JOIN products p ON pv.product_id = p.id
      WHERE p.shop_id = ?
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `, [req.params.id]);
    
    const [stats] = await pool.query(`
      SELECT 
        COUNT(DISTINCT pv.user_id) as unique_visitors,
        COUNT(*) as total_views,
        AVG(pv.duration) as avg_duration
      FROM product_views pv
      JOIN products p ON pv.product_id = p.id
      WHERE p.shop_id = ? AND pv.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `, [req.params.id]);
    
    res.json({ analytics, stats: stats[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/update', async (req, res) => {
  try {
    const { shop_name, description, shop_category, province, district, sector, cell, latitude, longitude, offers_delivery, delivery_radius } = req.body;
    
    await pool.query(
      'UPDATE shops SET shop_name = ?, description = ?, shop_category = ?, province = ?, district = ?, sector = ?, cell = ?, latitude = ?, longitude = ?, offers_delivery = ?, delivery_radius = ? WHERE id = ?',
      [shop_name, description, shop_category, province, district, sector, cell, latitude, longitude, offers_delivery, delivery_radius, req.params.id]
    );
    
    res.json({ message: 'Shop updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
