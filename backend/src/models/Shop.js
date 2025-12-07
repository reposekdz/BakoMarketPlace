import BaseModel from './BaseModel.js';
import pool from '../config/database.js';

class ShopModel extends BaseModel {
  constructor() {
    super('shops');
  }

  async findByUser(userId) {
    return this.findOne({ user_id: userId });
  }

  async getDashboardStats(shopId) {
    const [[ordersStats]] = await pool.query(
      'SELECT COUNT(*) as orders_count, SUM(total_amount) as revenue FROM orders WHERE shop_id = ?',
      [shopId]
    );

    const [[productStats]] = await pool.query(
      'SELECT COUNT(*) as products_count, SUM(sales) as total_sales FROM products WHERE shop_id = ?',
      [shopId]
    );

    const [[analytics]] = await pool.query(
      'SELECT SUM(views) as views, SUM(clicks) as clicks, SUM(sales) as sales FROM analytics WHERE shop_id = ?',
      [shopId]
    );

    return {
      orders: ordersStats || { orders_count: 0, revenue: 0 },
      products: productStats || { products_count: 0, total_sales: 0 },
      analytics: analytics || { views: 0, clicks: 0, sales: 0 },
    };
  }
}

const Shop = new ShopModel();
export default Shop;
