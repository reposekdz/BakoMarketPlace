import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Apply for expo booth
router.post('/apply', async (req, res) => {
  try {
    const { expo_id, shop_id, booth_type, company_name, contact_email, contact_phone, description } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO expo_booth_applications (expo_id, shop_id, booth_type, company_name, contact_email, contact_phone, description, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [expo_id, shop_id, booth_type, company_name, contact_email, contact_phone, description]
    );
    
    res.json({ success: true, application_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all applications
router.get('/applications', async (req, res) => {
  try {
    const [applications] = await pool.query(
      `SELECT eba.*, e.name as expo_name, s.shop_name 
       FROM expo_booth_applications eba 
       LEFT JOIN expo_events e ON eba.expo_id = e.id 
       LEFT JOIN shops s ON eba.shop_id = s.id 
       ORDER BY eba.created_at DESC`
    );
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve application
router.put('/applications/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('UPDATE expo_booth_applications SET status = ? WHERE id = ?', ['approved', id]);
    
    const [app] = await pool.query('SELECT * FROM expo_booth_applications WHERE id = ?', [id]);
    
    if (app[0]) {
      await pool.query(
        'INSERT INTO expo_booths (expo_id, shop_id, booth_type, booth_number) VALUES (?, ?, ?, ?)',
        [app[0].expo_id, app[0].shop_id, app[0].booth_type, `B${Date.now()}`]
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject application
router.put('/applications/:id/reject', async (req, res) => {
  try {
    await pool.query('UPDATE expo_booth_applications SET status = ? WHERE id = ?', ['rejected', req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply for sponsorship
router.post('/sponsor', async (req, res) => {
  try {
    const { expo_id, company_name, contact_name, email, phone, package_type, amount, logo_url, website } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO expo_sponsors (expo_id, company_name, contact_name, email, phone, package_type, amount, logo_url, website, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [expo_id, company_name, contact_name, email, phone, package_type, amount, logo_url, website]
    );
    
    res.json({ success: true, sponsor_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all sponsors
router.get('/sponsors', async (req, res) => {
  try {
    const [sponsors] = await pool.query(
      'SELECT es.*, e.name as expo_name FROM expo_sponsors es LEFT JOIN expo_events e ON es.expo_id = e.id ORDER BY es.created_at DESC'
    );
    res.json(sponsors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Activate sponsor
router.put('/sponsors/:id/activate', async (req, res) => {
  try {
    await pool.query('UPDATE expo_sponsors SET status = ? WHERE id = ?', ['active', req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
