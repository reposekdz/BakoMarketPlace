import BaseModel from './BaseModel.js';
import pool from '../config/database.js';

class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  async getProfileWithShop(userId) {
    const [rows] = await pool.query(
      `SELECT u.*, s.id as shop_id, s.shop_name, s.shop_category, s.business_type, s.rating as shop_rating,
              s.total_sales, s.followers, s.verified as shop_verified
       FROM users u
       LEFT JOIN shops s ON u.id = s.user_id
       WHERE u.id = ?`,
      [userId]
    );
    return rows[0] || null;
  }

  async incrementLoginMetadata(userId) {
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
  }
}

const User = new UserModel();
export default User;
