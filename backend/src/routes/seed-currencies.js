import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

router.post('/currencies', async (req, res) => {
  try {
    const currencies = [
      { code: 'USD', name: 'US Dollar', symbol: '$', exchange_rate: 1.00 },
      { code: 'EUR', name: 'Euro', symbol: '€', exchange_rate: 0.92 },
      { code: 'GBP', name: 'British Pound', symbol: '£', exchange_rate: 0.79 },
      { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', exchange_rate: 1320.00 },
      { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', exchange_rate: 129.50 },
      { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', exchange_rate: 3720.00 },
      { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', exchange_rate: 2510.00 },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchange_rate: 149.50 },
      { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', exchange_rate: 7.24 },
      { code: 'INR', name: 'Indian Rupee', symbol: '₹', exchange_rate: 83.12 },
      { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', exchange_rate: 3.67 },
      { code: 'ZAR', name: 'South African Rand', symbol: 'R', exchange_rate: 18.75 }
    ];

    for (const curr of currencies) {
      await pool.query(
        `INSERT INTO currencies (code, name, symbol, exchange_rate) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE exchange_rate = VALUES(exchange_rate)`,
        [curr.code, curr.name, curr.symbol, curr.exchange_rate]
      );
    }

    res.json({ success: true, message: '12 currencies seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/translations', async (req, res) => {
  try {
    const translations = [
      // English
      { key_name: 'home', language_code: 'en', translated_text: 'Home', context: 'navigation' },
      { key_name: 'products', language_code: 'en', translated_text: 'Products', context: 'navigation' },
      { key_name: 'categories', language_code: 'en', translated_text: 'Categories', context: 'navigation' },
      { key_name: 'cart', language_code: 'en', translated_text: 'Cart', context: 'navigation' },
      { key_name: 'electronics', language_code: 'en', translated_text: 'Electronics', context: 'category' },
      { key_name: 'fashion', language_code: 'en', translated_text: 'Fashion', context: 'category' },
      
      // Kinyarwanda
      { key_name: 'home', language_code: 'rw', translated_text: 'Ahabanza', context: 'navigation' },
      { key_name: 'products', language_code: 'rw', translated_text: 'Ibicuruzwa', context: 'navigation' },
      { key_name: 'categories', language_code: 'rw', translated_text: 'Ibyiciro', context: 'navigation' },
      { key_name: 'cart', language_code: 'rw', translated_text: 'Agakarito', context: 'navigation' },
      { key_name: 'electronics', language_code: 'rw', translated_text: 'Ikoranabuhanga', context: 'category' },
      { key_name: 'fashion', language_code: 'rw', translated_text: 'Imyambarire', context: 'category' },
      
      // French
      { key_name: 'home', language_code: 'fr', translated_text: 'Accueil', context: 'navigation' },
      { key_name: 'products', language_code: 'fr', translated_text: 'Produits', context: 'navigation' },
      { key_name: 'categories', language_code: 'fr', translated_text: 'Catégories', context: 'navigation' },
      { key_name: 'cart', language_code: 'fr', translated_text: 'Panier', context: 'navigation' },
      { key_name: 'electronics', language_code: 'fr', translated_text: 'Électronique', context: 'category' },
      { key_name: 'fashion', language_code: 'fr', translated_text: 'Mode', context: 'category' }
    ];

    for (const trans of translations) {
      await pool.query(
        `INSERT INTO ui_translations (key_name, language_code, translated_text, context) 
         VALUES (?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE translated_text = VALUES(translated_text)`,
        [trans.key_name, trans.language_code, trans.translated_text, trans.context]
      );
    }

    res.json({ success: true, message: 'Translations seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
