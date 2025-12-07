import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');
    
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', ['reponsekdz06@gmail.com']);
    
    if (existing.length > 0) {
      console.log('Admin user already exists');
      const hashedPassword = await bcrypt.hash('2025', 10);
      await pool.query('UPDATE users SET password = ?, role = ? WHERE email = ?', 
        [hashedPassword, 'admin', 'reponsekdz06@gmail.com']);
      console.log('Admin password updated successfully');
    } else {
      const hashedPassword = await bcrypt.hash('2025', 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role, is_email_verified, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        ['Admin Seller', 'reponsekdz06@gmail.com', hashedPassword, 'admin', true, true]
      );
      console.log('Admin user created successfully');
    }
    
    console.log('\nAdmin Credentials:');
    console.log('Email: reponsekdz06@gmail.com');
    console.log('Password: 2025');
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
}

setupAdmin();
