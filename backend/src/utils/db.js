const mysql = require('mysql2/promise');
const { createPool } = require('mysql2/promise');
const config = require('../config/config');
const logger = require('./logger');

class Database {
  constructor() {
    this.pool = createPool({
      host: config.DB_HOST,
      user: config.DB_USER,
      password: config.DB_PASS,
      database: config.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });

    this.initialize();
  }

  async initialize() {
    try {
      const connection = await this.pool.getConnection();
      logger.info('Database connected successfully');
      connection.release();
    } catch (error) {
      logger.error(`Database connection failed: ${error.message}`);
      process.exit(1);
    }
  }

  async query(sql, params) {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      logger.error(`Database query error: ${error.message}`);
      throw error;
    }
  }

  async transaction() {
    const conn = await this.pool.getConnection();
    await conn.beginTransaction();
    
    return {
      query: async (sql, params) => {
        try {
          const [rows] = await conn.query(sql, params);
          return rows;
        } catch (error) {
          await conn.rollback();
          conn.release();
          throw error;
        }
      },
      commit: async () => {
        try {
          await conn.commit();
          conn.release();
        } catch (error) {
          await conn.rollback();
          conn.release();
          throw error;
        }
      },
      rollback: async () => {
        try {
          await conn.rollback();
          conn.release();
        } catch (error) {
          conn.release();
          throw error;
        }
      }
    };
  }
}

// Create a singleton instance
const db = new Database();

// Handle process termination
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Closing database pool...');
  try {
    await db.pool.end();
    logger.info('Database pool closed');
    process.exit(0);
  } catch (error) {
    logger.error(`Error closing database pool: ${error.message}`);
    process.exit(1);
  }
});

module.exports = db;
