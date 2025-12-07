import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all UI translations for a language
router.get('/ui/:languageCode', async (req, res) => {
  try {
    const { languageCode } = req.params;
    const [translations] = await pool.query(
      'SELECT key_name, translated_text FROM ui_translations WHERE language_code = ?',
      [languageCode]
    );
    
    const translationMap = {};
    translations.forEach(t => {
      translationMap[t.key_name] = t.translated_text;
    });
    
    res.json(translationMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product translations
router.get('/product/:productId/:languageCode', async (req, res) => {
  try {
    const { productId, languageCode } = req.params;
    const [translations] = await pool.query(
      'SELECT * FROM product_translations WHERE product_id = ? AND language_code = ?',
      [productId, languageCode]
    );
    
    res.json(translations[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get category translations
router.get('/category/:categoryId/:languageCode', async (req, res) => {
  try {
    const { categoryId, languageCode } = req.params;
    const [translations] = await pool.query(
      'SELECT * FROM category_translations WHERE category_id = ? AND language_code = ?',
      [categoryId, languageCode]
    );
    
    res.json(translations[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk create/update UI translations
router.post('/ui/bulk', async (req, res) => {
  try {
    const { translations } = req.body; // Array of {key_name, language_code, translated_text, context}
    
    for (const trans of translations) {
      await pool.query(
        `INSERT INTO ui_translations (key_name, language_code, translated_text, context) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE translated_text = VALUES(translated_text)`,
        [trans.key_name, trans.language_code, trans.translated_text, trans.context]
      );
    }
    
    res.json({ success: true, count: translations.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create/update product translation
router.post('/product', async (req, res) => {
  try {
    const { product_id, language_code, name, description, features, specifications } = req.body;
    
    await pool.query(
      `INSERT INTO product_translations (product_id, language_code, name, description, features, specifications) 
       VALUES (?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), 
       features = VALUES(features), specifications = VALUES(specifications)`,
      [product_id, language_code, name, description, JSON.stringify(features), JSON.stringify(specifications)]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-translate using AI (placeholder for integration)
router.post('/auto-translate', async (req, res) => {
  try {
    const { text, from_language, to_language } = req.body;
    
    // In production, integrate with Google Translate API, DeepL, or AWS Translate
    // For now, return placeholder
    res.json({ 
      translated_text: text, // Would be actual translation
      confidence: 0.95,
      service: 'AI Translation Service'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
