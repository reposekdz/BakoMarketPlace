import BaseModel from './BaseModel.js';
import pool from '../config/database.js';

class CartModel extends BaseModel {
  constructor() {
    super('cart');
  }

  async getUserCart(userId) {
    const [rows] = await pool.query(
      `SELECT c.id, c.product_id as productId, c.quantity, c.variation_details as variationDetails,
              p.name, p.price, p.stock, p.status,
              (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primaryImage
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    const items = rows.map((row) => ({
      id: row.id,
      productId: row.productId,
      quantity: row.quantity,
      variationDetails: row.variationDetails,
      name: row.name,
      price: Number(row.price),
      stock: row.stock,
      status: row.status,
      primaryImage: row.primaryImage,
      subtotal: Number(row.price) * row.quantity,
    }));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    return { items, totalItems, totalAmount };
  }

  async addOrUpdateItem(userId, productId, quantity, variationDetails = null) {
    const [existingRows] = await pool.query(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND JSON_EXTRACT(variation_details, "$") <=> JSON_EXTRACT(?, "$")',
      [userId, productId, JSON.stringify(variationDetails)]
    );

    if (existingRows.length > 0) {
      const existing = existingRows[0];
      const newQuantity = existing.quantity + quantity;
      await pool.query('UPDATE cart SET quantity = ? WHERE id = ?', [newQuantity, existing.id]);
      return existing.id;
    }

    const [result] = await pool.query(
      'INSERT INTO cart (user_id, product_id, quantity, variation_details) VALUES (?, ?, ?, ?)',
      [userId, productId, quantity, JSON.stringify(variationDetails)]
    );

    return result.insertId;
  }

  async updateItem(itemId, userId, updates) {
    const fields = [];
    const params = [];

    if (updates.quantity != null) {
      fields.push('quantity = ?');
      params.push(updates.quantity);
    }
    if (updates.variationDetails !== undefined) {
      fields.push('variation_details = ?');
      params.push(JSON.stringify(updates.variationDetails));
    }

    if (!fields.length) return false;

    params.push(itemId, userId);

    const [result] = await pool.query(
      `UPDATE cart SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      params
    );
    return result.affectedRows > 0;
  }

  async removeItem(itemId, userId) {
    const [result] = await pool.query(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [itemId, userId]
    );
    return result.affectedRows > 0;
  }

  async clearUserCart(userId) {
    await pool.query('DELETE FROM cart WHERE user_id = ?', [userId]);
  }
}

const Cart = new CartModel();
export default Cart;
