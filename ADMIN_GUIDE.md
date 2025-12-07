# Admin Dashboard Guide

## Overview
Complete admin/seller management system with full CRUD operations, authentication, and multi-language support.

## Admin Credentials
- **Email**: reponsekdz06@gmail.com
- **Password**: 2025

## Features

### 1. Product Management
- ✅ Create, Read, Update, Delete products
- ✅ Product search and filtering
- ✅ Category management
- ✅ Stock management
- ✅ Price management
- ✅ Product status (Published/Draft)
- ✅ SKU tracking
- ✅ Image management

### 2. Seller Management
- ✅ View all sellers
- ✅ Activate/Deactivate sellers
- ✅ View seller statistics
- ✅ Shop information
- ✅ Sales tracking
- ✅ Rating management

### 3. Dashboard Analytics
- ✅ Total products count
- ✅ Total orders count
- ✅ Revenue tracking
- ✅ User statistics
- ✅ Vendor statistics
- ✅ Recent orders
- ✅ Top products

### 4. Translation System
- ✅ Multi-language support
- ✅ Translation management
- ✅ Language switching (EN, FR, ES, AR, etc.)
- ✅ Dynamic content translation

### 5. Activity Logs
- ✅ Track all admin actions
- ✅ User activity monitoring
- ✅ IP address logging
- ✅ Timestamp tracking

## Setup Instructions

### 1. Database Setup
```bash
# Import the schema
mysql -u root -p bako_marketplace < backend/database/schema.sql

# Or create database manually
mysql -u root -p
CREATE DATABASE bako_marketplace;
USE bako_marketplace;
SOURCE backend/database/schema.sql;
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run setup-admin  # Creates admin user
npm run dev          # Start server on port 5000
```

### 3. Frontend Setup
```bash
npm install
npm run dev          # Start frontend on port 5173
```

## Accessing Admin Dashboard

### Method 1: Header Button
1. Click "Admin" button in the top header
2. Login with credentials above
3. Access full dashboard

### Method 2: Direct URL
1. Navigate to the app
2. Click Admin in header
3. Login automatically redirects to dashboard

## Admin Dashboard Sections

### Dashboard Tab
- Overview statistics
- Quick metrics
- Revenue tracking
- User counts

### Products Tab
- Product listing table
- Search functionality
- Add new product button
- Edit/Delete actions
- Category filtering
- Status management

### Sellers Tab
- All sellers list
- Shop information
- Sales statistics
- Status management (Active/Inactive)
- Rating display

### Translations Tab
- Language selector
- Translation key management
- Multi-language content
- Add/Edit translations

### Activity Logs Tab
- All admin actions
- User activity
- Timestamp tracking
- Action details

## API Endpoints

### Authentication
```
POST /api/admin/login
Body: { email, password }
```

### Products
```
GET    /api/admin/products?search=&category=&status=&page=1&limit=20
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
```

### Categories
```
GET  /api/admin/categories
POST /api/admin/categories
```

### Sellers
```
GET /api/admin/sellers
PUT /api/admin/sellers/:id/status
```

### Statistics
```
GET /api/admin/stats
```

### Translations
```
GET  /api/admin/translations?language=en
POST /api/admin/translations
```

### Activity Logs
```
GET /api/admin/logs?page=1&limit=50
```

## Database Tables

### users
- Admin user with role='admin'
- Email: reponsekdz06@gmail.com
- Hashed password for security

### products
- All product information
- Linked to vendor (admin)
- Category relationships
- Stock and pricing

### shops
- Seller shop information
- Ratings and sales
- Status management

### translations
- Multi-language content
- Key-value pairs
- Language codes

### activity_logs
- All admin actions
- User tracking
- IP addresses
- Timestamps

## Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Admin role verification
- ✅ Protected routes
- ✅ Activity logging
- ✅ SQL injection prevention
- ✅ XSS protection

## Translation Support

Supported languages:
- English (en)
- French (fr)
- Spanish (es)
- Arabic (ar)
- Kinyarwanda (rw)
- Swahili (sw)
- Portuguese (pt)
- Chinese (zh)
- Hindi (hi)
- German (de)

## Product Operations

### Create Product
1. Click "Add Product" button
2. Fill in product details:
   - Name
   - Description
   - Price
   - Compare at price
   - SKU
   - Quantity
   - Category
   - Published status
3. Click "Create Product"

### Update Product
1. Click edit icon on product row
2. Modify fields
3. Click "Update Product"

### Delete Product
1. Click delete icon on product row
2. Confirm deletion
3. Product removed from database

## Seller Operations

### View Sellers
- See all registered sellers
- View shop information
- Check sales statistics
- Monitor ratings

### Manage Seller Status
1. Select seller from list
2. Choose status (Active/Inactive)
3. Status updates immediately
4. Logged in activity logs

## Best Practices

1. **Regular Backups**: Backup database regularly
2. **Monitor Logs**: Check activity logs frequently
3. **Update Products**: Keep inventory updated
4. **Manage Sellers**: Review seller performance
5. **Translation Updates**: Keep translations current

## Troubleshooting

### Cannot Login
- Verify credentials: reponsekdz06@gmail.com / 2025
- Run: `npm run setup-admin` to reset password
- Check database connection

### Products Not Showing
- Verify database connection
- Check product status (published)
- Review category assignments

### API Errors
- Check backend server is running (port 5000)
- Verify JWT token in localStorage
- Check CORS settings

## Support

For issues or questions:
1. Check activity logs
2. Review database tables
3. Verify API responses
4. Check browser console

## Future Enhancements

- Bulk product import/export
- Advanced analytics charts
- Email notifications
- Order management
- Customer support chat
- Report generation
- Inventory alerts
- Multi-admin support
