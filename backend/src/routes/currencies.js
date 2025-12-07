import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all active currencies
router.get('/', async (req, res) => {
  try {
    const [currencies] = await pool.query(
      'SELECT * FROM currencies WHERE is_active = TRUE ORDER BY code'
    );
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific currency
router.get('/:code', async (req, res) => {
  try {
    const [currencies] = await pool.query(
      'SELECT * FROM currencies WHERE code = ?',
      [req.params.code]
    );
    res.json(currencies[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Convert price
router.post('/convert', async (req, res) => {
  try {
    const { amount, from_currency, to_currency } = req.body;
    
    const [fromCurr] = await pool.query('SELECT exchange_rate FROM currencies WHERE code = ?', [from_currency]);
    const [toCurr] = await pool.query('SELECT exchange_rate FROM currencies WHERE code = ?', [to_currency]);
    
    if (!fromCurr[0] || !toCurr[0]) {
      return res.status(404).json({ error: 'Currency not found' });
    }
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromCurr[0].exchange_rate;
    const convertedAmount = usdAmount * toCurr[0].exchange_rate;
    
    res.json({
      original_amount: amount,
      original_currency: from_currency,
      converted_amount: parseFloat(convertedAmount.toFixed(2)),
      target_currency: to_currency,
      exchange_rate: toCurr[0].exchange_rate / fromCurr[0].exchange_rate
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update exchange rates (admin only)
router.post('/update-rates', async (req, res) => {
  try {
    const { rates } = req.body; // Array of {code, exchange_rate}
    
    for (const rate of rates) {
      await pool.query(
        'UPDATE currencies SET exchange_rate = ?, last_updated = NOW() WHERE code = ?',
        [rate.exchange_rate, rate.code]
      );
    }
    
    res.json({ success: true, updated: rates.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new currency
router.post('/', async (req, res) => {
  try {
    const { code, name, symbol, exchange_rate } = req.body;
    
    await pool.query(
      'INSERT INTO currencies (code, name, symbol, exchange_rate) VALUES (?, ?, ?, ?)',
      [code, name, symbol, exchange_rate]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch live exchange rates (integration placeholder)
router.post('/fetch-live-rates', async (req, res) => {
  try {
    // In production, integrate with exchangerate-api.com, fixer.io, or similar
    // For now, return mock data
    const liveRates = {
      USD: 1.00,
      EUR: 0.92,
      GBP: 0.79,
      RWF: 1320.00,
      KES: 129.50,
      UGX: 3720.00,
      TZS: 2510.00,
      JPY: 149.50,
      CNY: 7.24,
      INR: 83.12
    };
    
    // Update database
    for (const [code, rate] of Object.entries(liveRates)) {
      await pool.query(
        'UPDATE currencies SET exchange_rate = ?, last_updated = NOW() WHERE code = ?',
        [rate, code]
      );
    }
    
    res.json({ success: true, rates: liveRates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
