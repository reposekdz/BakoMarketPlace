import BaseModel from './BaseModel.js';
import pool from '../config/database.js';

class OrderModel extends BaseModel {
  constructor() {
    super('orders');
  }

  async createOrderWithItems({ userId, shopId, items, shippingAddress, paymentMethod }) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const orderNumber = 'ORD-' + Date.now();
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, shop_id, order_number, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, shopId, orderNumber, subtotal, shippingAddress, paymentMethod]
      );

      const orderId = orderResult.insertId;

      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price, variation_details) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, item.price, JSON.stringify(item.variationDetails || null)]
        );

        // Update product stock and sales
        await connection.query(
          'UPDATE products SET stock = stock - ?, sales = sales + ? WHERE id = ? AND stock >= ?',
          [item.quantity, item.quantity, item.productId, item.quantity]
        );
      }

      await connection.commit();

      return { orderId, orderNumber, totalAmount: subtotal };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getUserOrders(userId) {
    const [orders] = await pool.query(
      `SELECT o.*, s.shop_name
       FROM orders o
       JOIN shops s ON o.shop_id = s.id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );

    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, p.name, 
                (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primaryImage
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    return orders;
  }

  async getShopOrders(shopId) {
    const [orders] = await pool.query(
      `SELECT o.*, u.email as buyer_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.shop_id = ?
       ORDER BY o.created_at DESC`,
      [shopId]
    );

    for (const order of orders) {
      const [items] = await pool.query(
        `SELECT oi.*, p.name,
                (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primaryImage
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    return orders;
  }
}

const Order = new OrderModel();
export default Order;
