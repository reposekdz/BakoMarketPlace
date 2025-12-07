import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// AI Chatbot
router.post('/chatbot/create', async (req, res) => {
  try {
    const { shop_id, bot_name, personality, knowledge_base } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO ai_chatbots (shop_id, bot_name, personality, knowledge_base) VALUES (?, ?, ?, ?)',
      [shop_id, bot_name, JSON.stringify(personality), JSON.stringify(knowledge_base)]
    );
    
    res.json({ success: true, bot_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/chatbot/:botId/chat', async (req, res) => {
  try {
    const { botId } = req.params;
    const { user_id, message, session_id } = req.body;
    
    // AI response generation would happen here
    const ai_response = `I understand you're asking about "${message}". How can I help you further?`;
    
    const [existing] = await pool.query(
      'SELECT messages FROM chatbot_conversations WHERE bot_id = ? AND session_id = ?',
      [botId, session_id]
    );
    
    let messages = existing[0] ? JSON.parse(existing[0].messages) : [];
    messages.push({ role: 'user', content: message, timestamp: new Date() });
    messages.push({ role: 'assistant', content: ai_response, timestamp: new Date() });
    
    if (existing[0]) {
      await pool.query(
        'UPDATE chatbot_conversations SET messages = ? WHERE bot_id = ? AND session_id = ?',
        [JSON.stringify(messages), botId, session_id]
      );
    } else {
      await pool.query(
        'INSERT INTO chatbot_conversations (bot_id, user_id, session_id, messages, sentiment_score) VALUES (?, ?, ?, ?, ?)',
        [botId, user_id, session_id, JSON.stringify(messages), 0.75]
      );
    }
    
    await pool.query('UPDATE ai_chatbots SET conversations_count = conversations_count + 1 WHERE id = ?', [botId]);
    
    res.json({ response: ai_response, messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Personalized Feed
router.get('/personalized-feed/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { feed_type = 'home' } = req.query;
    
    const [orders] = await pool.query(
      'SELECT product_id FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.user_id = ? ORDER BY o.created_at DESC LIMIT 10',
      [userId]
    );
    
    const [views] = await pool.query(
      'SELECT product_id, COUNT(*) as view_count FROM product_views WHERE user_id = ? GROUP BY product_id ORDER BY view_count DESC LIMIT 10',
      [userId]
    );
    
    const productIds = [...new Set([...orders.map(o => o.product_id), ...views.map(v => v.product_id)])];
    
    let [products] = await pool.query(
      'SELECT * FROM products WHERE category IN (SELECT DISTINCT category FROM products WHERE id IN (?)) AND id NOT IN (?) ORDER BY rating DESC, sales DESC LIMIT 20',
      [productIds.length ? productIds : [0], productIds.length ? productIds : [0]]
    );
    
    await pool.query(
      `INSERT INTO personalized_feeds (user_id, feed_type, products, algorithm_version, engagement_score) 
       VALUES (?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE products = VALUES(products), last_updated = NOW()`,
      [userId, feed_type, JSON.stringify(products.map(p => p.id)), 'v2.1', 0.88]
    );
    
    res.json({ products, algorithm: 'collaborative_filtering', confidence: 0.88 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Emotion Analytics
router.post('/emotion-analytics', async (req, res) => {
  try {
    const { user_id, session_id, detected_emotions, product_reactions } = req.body;
    
    const engagement_level = detected_emotions.reduce((sum, e) => sum + (e.intensity || 0), 0) / detected_emotions.length;
    
    await pool.query(
      'INSERT INTO emotion_analytics (user_id, session_id, detected_emotions, product_reactions, engagement_level) VALUES (?, ?, ?, ?, ?)',
      [user_id, session_id, JSON.stringify(detected_emotions), JSON.stringify(product_reactions), engagement_level]
    );
    
    res.json({ success: true, engagement_level });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Collaborative Filtering
router.post('/collaborative-filtering/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [userOrders] = await pool.query(
      'SELECT DISTINCT product_id FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.user_id = ?',
      [userId]
    );
    
    const userProductIds = userOrders.map(o => o.product_id);
    
    const [similarUsers] = await pool.query(
      `SELECT o.user_id, COUNT(DISTINCT oi.product_id) as common_products 
       FROM orders o 
       JOIN order_items oi ON o.id = oi.order_id 
       WHERE oi.product_id IN (?) AND o.user_id != ? 
       GROUP BY o.user_id 
       ORDER BY common_products DESC 
       LIMIT 10`,
      [userProductIds.length ? userProductIds : [0], userId]
    );
    
    const similarUserIds = similarUsers.map(u => u.user_id);
    
    let [recommendedProducts] = await pool.query(
      `SELECT p.*, COUNT(*) as recommendation_score 
       FROM products p 
       JOIN order_items oi ON p.id = oi.product_id 
       JOIN orders o ON oi.order_id = o.id 
       WHERE o.user_id IN (?) AND p.id NOT IN (?) 
       GROUP BY p.id 
       ORDER BY recommendation_score DESC 
       LIMIT 20`,
      [similarUserIds.length ? similarUserIds : [0], userProductIds.length ? userProductIds : [0]]
    );
    
    await pool.query(
      `INSERT INTO collaborative_filtering (user_id, similar_users, recommended_products, similarity_score) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE similar_users = VALUES(similar_users), recommended_products = VALUES(recommended_products)`,
      [userId, JSON.stringify(similarUserIds), JSON.stringify(recommendedProducts.map(p => p.id)), 0.82]
    );
    
    res.json({ recommended_products: recommendedProducts, similar_users: similarUserIds, confidence: 0.82 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inventory Predictions
router.post('/inventory-prediction/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const [sales] = await pool.query(
      'SELECT SUM(quantity) as total_sold FROM order_items WHERE product_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)',
      [productId]
    );
    
    const daily_avg = (sales[0].total_sold || 0) / 30;
    const predicted_demand = Math.ceil(daily_avg * 30);
    const reorder_point = Math.ceil(daily_avg * 7);
    const optimal_stock = Math.ceil(daily_avg * 45);
    
    await pool.query(
      `INSERT INTO inventory_predictions (product_id, predicted_demand, confidence_level, reorder_point, optimal_stock, prediction_date) 
       VALUES (?, ?, ?, ?, ?, CURDATE()) 
       ON DUPLICATE KEY UPDATE predicted_demand = VALUES(predicted_demand), reorder_point = VALUES(reorder_point)`,
      [productId, predicted_demand, 0.87, reorder_point, optimal_stock]
    );
    
    res.json({ predicted_demand, reorder_point, optimal_stock, confidence: 0.87 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Social Proof
router.post('/social-proof/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { proof_type, time_window = '24h' } = req.body;
    
    let message = '';
    let user_count = 0;
    
    if (proof_type === 'recent_purchase') {
      const [count] = await pool.query(
        'SELECT COUNT(*) as total FROM order_items WHERE product_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)',
        [productId]
      );
      user_count = count[0].total;
      message = `${user_count} people bought this in the last 24 hours`;
    }
    
    await pool.query(
      'INSERT INTO social_proof (product_id, proof_type, message, user_count, time_window) VALUES (?, ?, ?, ?, ?)',
      [productId, proof_type, message, user_count, time_window]
    );
    
    res.json({ message, user_count, proof_type });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Abandoned Cart Recovery
router.post('/abandoned-cart', async (req, res) => {
  try {
    const { user_id, cart_data, total_value } = req.body;
    
    const recovery_discount = 10;
    
    await pool.query(
      'INSERT INTO abandoned_carts (user_id, cart_data, total_value, recovery_discount) VALUES (?, ?, ?, ?)',
      [user_id, JSON.stringify(cart_data), total_value, recovery_discount]
    );
    
    res.json({ success: true, recovery_discount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
