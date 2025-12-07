import pool from '../config/database.js';

export default class BaseModel {
  constructor(tableName) {
    this.table = tableName;
  }

  async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
    return rows[0] || null;
  }

  async findOne(where = {}, fields = '*') {
    const { clause, params } = this._buildWhere(where);
    const [rows] = await pool.query(
      `SELECT ${fields} FROM ${this.table} ${clause} LIMIT 1`,
      params
    );
    return rows[0] || null;
  }

  async findAll({ where = {}, fields = '*', orderBy, limit, offset } = {}) {
    const { clause, params } = this._buildWhere(where);
    let sql = `SELECT ${fields} FROM ${this.table} ${clause}`;
    if (orderBy) sql += ` ORDER BY ${orderBy}`;
    if (limit) {
      sql += ' LIMIT ?';
      params.push(Number(limit));
    }
    if (offset) {
      sql += ' OFFSET ?';
      params.push(Number(offset));
    }
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  async create(data) {
    const [result] = await pool.query(
      `INSERT INTO ${this.table} SET ?`,
      data
    );
    return { id: result.insertId, ...data };
  }

  async update(id, data) {
    await pool.query(
      `UPDATE ${this.table} SET ? WHERE id = ?`,
      [data, id]
    );
    return this.findById(id);
  }

  async delete(id) {
    const [result] = await pool.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  async count(where = {}) {
    const { clause, params } = this._buildWhere(where);
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count FROM ${this.table} ${clause}`,
      params
    );
    return rows[0]?.count || 0;
  }

  _buildWhere(where) {
    const keys = Object.keys(where || {});
    if (!keys.length) return { clause: '', params: [] };

    const conditions = [];
    const params = [];
    for (const key of keys) {
      const value = where[key];
      if (value === null) {
        conditions.push(`${key} IS NULL`);
      } else {
        conditions.push(`${key} = ?`);
        params.push(value);
      }
    }

    return {
      clause: `WHERE ${conditions.join(' AND ')}`,
      params,
    };
  }
}
