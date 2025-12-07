import express from 'express';
import pool from '../config/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { shopId, items, totalAmount, shippingAddress, paymentMethod } = req.body;
    const orderNumber = 'ORD-' + Date.now();
    
    const [result] = await pool.query(
      'INSERT INTO orders (user_id, shop_id, order_number, total_amount, shipping_address, payment_method) VALUES (?, ?, ?, ?, ?, ?)',
      [req.userId, shopId, orderNumber, totalAmount, shippingAddress, paymentMethod]
    );
    
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [result.insertId, item.productId, item.quantity, item.price]
      );
      await pool.query('UPDATE products SET stock = stock - ?, sales = sales + ? WHERE id = ?', [item.quantity, item.quantity, item.productId]);
    }
    
    res.status(201).json({ orderId: result.insertId, orderNumber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, s.shop_name 
      FROM orders o 
      JOIN shops s ON o.shop_id = s.id 
      WHERE o.user_id = ? 
      ORDER BY o.created_at DESC
    `, [req.userId]);
    
    for (let order of orders) {
      const [items] = await pool.query(`
        SELECT oi.*, p.name, p.image 
        FROM order_items oi 
        JOIN products p ON oi.product_id = p.id 
        WHERE oi.order_id = ?
      `, [order.id]);
      order.items = items;
    }
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
