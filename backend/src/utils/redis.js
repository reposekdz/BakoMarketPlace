const { createClient } = require('redis');
const config = require('../config/config');
const logger = require('./logger');

class RedisClient {
  constructor() {
    this.client = createClient({
      url: `redis://${config.REDIS_HOST}:${config.REDIS_PORT}`,
      password: config.REDIS_PASSWORD || undefined,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            logger.error('Too many retries on Redis. Connection Terminated');
            return new Error('Too many retries on Redis. Connection Terminated');
          }
          return Math.min(retries * 100, 5000);
        },
      },
    });

    this.client.on('error', (err) => {
      logger.error(`Redis Client Error: ${err.message}`);
    });

    this.client.on('connect', () => {
      logger.info('Redis client connected');
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready');
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis client reconnecting...');
    });

    this.initialize();
  }

  async initialize() {
    try {
      await this.client.connect();
    } catch (error) {
      logger.error(`Redis connection failed: ${error.message}`);
      // Don't exit process for Redis connection failure as it's not critical
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
      if (ttl) {
        return await this.client.set(key, stringValue, { EX: ttl });
      }
      return await this.client.set(key, stringValue);
    } catch (error) {
      logger.error(`Redis set error: ${error.message}`);
      throw error;
    }
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    } catch (error) {
      logger.error(`Redis get error: ${error.message}`);
      throw error;
    }
  }

  async del(key) {
    try {
      return await this.client.del(key);
    } catch (error) {
      logger.error(`Redis delete error: ${error.message}`);
      throw error;
    }
  }

  async keys(pattern) {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      logger.error(`Redis keys error: ${error.message}`);
      throw error;
    }
  }

  async flushAll() {
    try {
      return await this.client.flushAll();
    } catch (error) {
      logger.error(`Redis flushAll error: ${error.message}`);
      throw error;
    }
  }

  async quit() {
    try {
      return await this.client.quit();
    } catch (error) {
      logger.error(`Redis quit error: ${error.message}`);
      throw error;
    }
  }

  // Rate limiting methods
  async rateLimit(key, limit, windowMs) {
    try {
      const current = await this.client.incr(key);
      if (current === 1) {
        await this.client.expire(key, Math.ceil(windowMs / 1000));
      }
      return { current, limit, remaining: Math.max(0, limit - current) };
    } catch (error) {
      logger.error(`Redis rateLimit error: ${error.message}`);
      throw error;
    }
  }
}

// Create a singleton instance
const redis = new RedisClient();

// Handle process termination
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Closing Redis connection...');
  try {
    await redis.quit();
    logger.info('Redis connection closed');
  } catch (error) {
    logger.error(`Error closing Redis connection: ${error.message}`);
  }
});

module.exports = redis;
