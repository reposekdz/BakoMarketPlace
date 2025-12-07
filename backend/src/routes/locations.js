import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

const rwandaLocations = {
  provinces: [
    { en: 'Kigali City', rw: 'Umujyi wa Kigali' },
    { en: 'Eastern Province', rw: 'Intara y\'Iburasirazuba' },
    { en: 'Northern Province', rw: 'Intara y\'Amajyaruguru' },
    { en: 'Southern Province', rw: 'Intara y\'Amajyepfo' },
    { en: 'Western Province', rw: 'Intara y\'Iburengerazuba' }
  ],
  districts: {
    'Kigali City': ['Gasabo', 'Kicukiro', 'Nyarugenge'],
    'Eastern Province': ['Bugesera', 'Gatsibo', 'Kayonza', 'Kirehe', 'Ngoma', 'Nyagatare', 'Rwamagana'],
    'Northern Province': ['Burera', 'Gakenke', 'Gicumbi', 'Musanze', 'Rulindo'],
    'Southern Province': ['Gisagara', 'Huye', 'Kamonyi', 'Muhanga', 'Nyamagabe', 'Nyanza', 'Nyaruguru', 'Ruhango'],
    'Western Province': ['Karongi', 'Ngororero', 'Nyabihu', 'Nyamasheke', 'Rubavu', 'Rusizi', 'Rutsiro']
  }
};

router.get('/provinces', (req, res) => {
  const { lang = 'en' } = req.query;
  const provinces = rwandaLocations.provinces.map(p => ({
    value: p.en,
    label: lang === 'rw' ? p.rw : p.en
  }));
  res.json(provinces);
});

router.get('/districts/:province', (req, res) => {
  const districts = rwandaLocations.districts[req.params.province] || [];
  res.json(districts.map(d => ({ value: d, label: d })));
});

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 4 } = req.query;
    
    const [shops] = await pool.query(`
      SELECT s.*, u.first_name, u.last_name,
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
      FROM shops s
      JOIN users u ON s.user_id = u.id
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      HAVING distance <= ?
      ORDER BY distance
    `, [lat, lng, lat, radius]);
    
    res.json(shops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/products/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 4, category, minPrice, maxPrice, deliveryOnly } = req.query;
    
    let query = `
      SELECT p.*, s.shop_name, s.latitude, s.longitude, s.offers_delivery,
        (6371 * acos(cos(radians(?)) * cos(radians(s.latitude)) * cos(radians(s.longitude) - radians(?)) + sin(radians(?)) * sin(radians(s.latitude)))) AS distance,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as image
      FROM products p
      JOIN shops s ON p.shop_id = s.id
      WHERE s.latitude IS NOT NULL AND s.longitude IS NOT NULL AND p.status = 'active'
    `;
    const params = [lat, lng, lat];
    
    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }
    if (minPrice) {
      query += ' AND p.price >= ?';
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ' AND p.price <= ?';
      params.push(maxPrice);
    }
    if (deliveryOnly === 'true') {
      query += ' AND s.offers_delivery = TRUE';
    }
    
    query += ' HAVING distance <= ? ORDER BY distance';
    params.push(radius);
    
    const [products] = await pool.query(query, params);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
