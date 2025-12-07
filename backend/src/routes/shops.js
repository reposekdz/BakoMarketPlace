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
    await pool.query('UPDATE shops SET followers = followers + 1 WHERE id = ?', [req.params.id]);
    res.json({ message: 'Shop followed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
