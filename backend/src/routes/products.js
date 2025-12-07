import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';
import Product from '../models/Product.js';

const router = express.Router();

// Advanced search & listing, still compatible with existing query params
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      minRating,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const products = await Product.searchAndFilter({
      category,
      search,
      minPrice,
      maxPrice,
      minRating,
      sort,
      page: Number(page) || 1,
      limit: Number(limit) || 20,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findWithShopAndImagesById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Increment views, but don't block response if it fails
    Product.incrementViews(product.id).catch(() => {});

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Related products: same category or same shop, excluding current product
router.get('/:id/related', async (req, res) => {
  try {
    const baseProduct = await Product.findById(req.params.id);
    if (!baseProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const [rows] = await pool.query(
      `SELECT p.*, s.shop_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
       FROM products p
       JOIN shops s ON p.shop_id = s.id
       WHERE p.id != ?
         AND (p.category = ? OR p.shop_id = ?)
         AND p.status = 'active'
       ORDER BY p.rating DESC, p.sales DESC, p.views DESC
       LIMIT 12`,
      [baseProduct.id, baseProduct.category, baseProduct.shop_id]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, originalPrice, category, brand, sku, stock, images } = req.body;
    const [shop] = await pool.query('SELECT id FROM shops WHERE user_id = ?', [req.userId]);
    
    if (shop.length === 0) {
      return res.status(403).json({ error: 'No shop found for user' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO products (shop_id, name, description, price, original_price, category, brand, sku, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [shop[0].id, name, description, price, originalPrice, category, brand, sku, stock]
    );
    
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await pool.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)',
          [result.insertId, images[i], i === 0, i]
        );
      }
    }
    
    res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, stock, status } = req.body;
    await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, status = ? WHERE id = ?',
      [name, description, price, stock, status, req.params.id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
