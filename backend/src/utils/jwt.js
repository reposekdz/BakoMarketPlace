const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/config');
const redis = require('./redis');
const logger = require('./logger');

class JWT {
  static generateToken(userId, expiresIn = config.JWT_EXPIRE) {
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomBytes(16).toString('hex'),
    };

    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn });
    return token;
  }

  static async generateAuthTokens(user) {
    const accessToken = this.generateToken(user.id, '15m');
    const refreshToken = this.generateToken(user.id, '7d');
    
    // Store refresh token in Redis with user ID as reference
    await redis.set(`refresh_token:${refreshToken}`, user.id, 7 * 24 * 60 * 60); // 7 days
    
    return {
      access: {
        token: accessToken,
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
      refresh: {
        token: refreshToken,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    };
  }

  static verifyToken(token, options = {}) {
    try {
      return jwt.verify(token, config.JWT_SECRET, options);
    } catch (error) {
      logger.error(`Token verification failed: ${error.message}`);
      return null;
    }
  }

  static async revokeToken(token) {
    try {
      const decoded = this.verifyToken(token, { ignoreExpiration: true });
      if (!decoded) return false;
      
      // Add token to blacklist with remaining TTL
      const remainingTime = Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
      if (remainingTime > 0) {
        await redis.set(`blacklist:${token}`, 'revoked', remainingTime);
      }
      
      // Remove refresh token if it's a refresh token
      await redis.del(`refresh_token:${token}`);
      
      return true;
    } catch (error) {
      logger.error(`Failed to revoke token: ${error.message}`);
      return false;
    }
  }

  static async isTokenRevoked(token) {
    try {
      const isBlacklisted = await redis.get(`blacklist:${token}`);
      return !!isBlacklisted;
    } catch (error) {
      logger.error(`Failed to check token revocation status: ${error.message}`);
      return true; // Assume token is revoked if we can't check
    }
  }

  static async refreshAccessToken(refreshToken) {
    try {
      // Verify the refresh token
      const decoded = this.verifyToken(refreshToken);
      if (!decoded) {
        throw new Error('Invalid refresh token');
      }

      // Check if the refresh token exists in Redis
      const userId = await redis.get(`refresh_token:${refreshToken}`);
      if (!userId || userId !== decoded.sub) {
        throw new Error('Refresh token not found or invalid');
      }

      // Generate new tokens
      const tokens = await this.generateAuthTokens({ id: decoded.sub });
      
      // Remove the old refresh token
      await redis.del(`refresh_token:${refreshToken}`);
      
      return tokens;
    } catch (error) {
      logger.error(`Failed to refresh token: ${error.message}`);
      throw error;
    }
  }

  static async invalidateUserSessions(userId) {
    try {
      // Find all refresh tokens for the user
      const refreshTokens = await redis.keys(`refresh_token:*`);
      
      for (const key of refreshTokens) {
        const token = key.replace('refresh_token:', '');
        const tokenUserId = await redis.get(key);
        
        if (tokenUserId === userId) {
          // Add to blacklist
          const decoded = this.verifyToken(token, { ignoreExpiration: true });
          if (decoded) {
            const remainingTime = Math.max(0, decoded.exp - Math.floor(Date.now() / 1000));
            if (remainingTime > 0) {
              await redis.set(`blacklist:${token}`, 'revoked', remainingTime);
            }
          }
          
          // Remove refresh token
          await redis.del(key);
        }
      }
      
      return true;
    } catch (error) {
      logger.error(`Failed to invalidate user sessions: ${error.message}`);
      throw error;
    }
  }
}

module.exports = JWT;
