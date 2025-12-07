import BaseModel from './BaseModel.js';
import pool from '../config/database.js';

class ProductModel extends BaseModel {
  constructor() {
    super('products');
  }

  async findWithShopAndImagesById(id) {
    const [products] = await pool.query(
      `SELECT p.*, s.shop_name, s.verified as seller_verified, s.rating as seller_rating, s.followers, s.total_sales
       FROM products p
       JOIN shops s ON p.shop_id = s.id
       WHERE p.id = ?`,
      [id]
    );
    if (!products.length) return null;

    const product = products[0];
    const [images] = await pool.query(
      'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order',
      [product.id]
    );
    product.images = images.map(img => img.image_url);

    const [variations] = await pool.query(
      'SELECT * FROM product_variations WHERE product_id = ?',
      [product.id]
    );
    product.variations = variations;

    return product;
  }

  async searchAndFilter({ category, search, minPrice, maxPrice, minRating, sort, page = 1, limit = 20 }) {
    let query = `
      SELECT p.*, s.shop_name, s.verified as seller_verified, s.rating as seller_rating,
      (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
      FROM products p
      JOIN shops s ON p.shop_id = s.id
      WHERE p.status = 'active'
    `;
    const params = [];

    if (category && category !== 'all') {
      query += ' AND p.category = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND MATCH(p.name, p.description) AGAINST (?)';
      params.push(search);
    }
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(maxPrice);
    }
    if (minRating) {
      query += ' AND p.rating >= ?';
      params.push(minRating);
    }

    if (sort === 'price_asc') query += ' ORDER BY p.price ASC';
    else if (sort === 'price_desc') query += ' ORDER BY p.price DESC';
    else if (sort === 'rating') query += ' ORDER BY p.rating DESC';
    else if (sort === 'newest') query += ' ORDER BY p.created_at DESC';
    else query += ' ORDER BY p.views DESC';

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), offset);

    const [products] = await pool.query(query, params);

    for (const product of products) {
      const [images] = await pool.query(
        'SELECT image_url FROM product_images WHERE product_id = ? ORDER BY display_order',
        [product.id]
      );
      product.images = images.map(img => img.image_url);
    }

    return products;
  }

  async incrementViews(productId) {
    await pool.query('UPDATE products SET views = views + 1 WHERE id = ?', [productId]);
  }
}

const Product = new ProductModel();
export default Product;
