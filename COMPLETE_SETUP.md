# 🚀 Complete Admin System Setup

## ✅ What's Included

### Admin Features
- ✅ Full product CRUD operations
- ✅ Seller management & activation
- ✅ Dashboard analytics & statistics
- ✅ Multi-language translations (10+ languages)
- ✅ Activity logging & monitoring
- ✅ Category management
- ✅ Real-time notifications
- ✅ Coupon system
- ✅ Shipping rate management

### Advanced Features
- ✅ Notification center with real-time updates
- ✅ Coupon validation & discount system
- ✅ Activity logs with IP tracking
- ✅ Multi-language support
- ✅ Advanced analytics
- ✅ Shipping rate calculator
- ✅ Review management
- ✅ Order tracking

## 📋 Prerequisites

- Node.js (v16+)
- MySQL (v8+)
- npm or yarn

## 🔧 Installation Steps

### 1. Database Setup

```bash
# Start MySQL
mysql -u root -p

# Create database
CREATE DATABASE bakomarketplace;
exit;
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will:
- Auto-create all tables
- Set up foreign keys
- Initialize database structure

### 3. Create Admin User

```bash
# In backend directory
npm run setup-admin
```

This creates admin with:
- Email: reponsekdz06@gmail.com
- Password: 2025

### 4. Frontend Setup

```bash
# In root directory
npm install
npm run dev
```

## 🎯 Access Admin Dashboard

1. Open: http://localhost:5173
2. Click "Admin" button in header
3. Login with credentials above
4. Full dashboard access granted

## 📊 Database Tables Created

### Core Tables
- `users` - User accounts with roles
- `shops` - Seller shop information
- `products` - Product catalog
- `product_images` - Product photos
- `product_variations` - Size/color variants
- `categories` - Product categories
- `orders` - Order management
- `order_items` - Order line items
- `reviews` - Product reviews
- `review_images` - Review photos

### Advanced Tables
- `notifications` - Real-time user notifications
- `coupons` - Discount codes
- `shipping_rates` - Shipping calculator
- `translations` - Multi-language content
- `activity_logs` - Admin action tracking
- `messages` - User messaging
- `wishlist` - Saved products
- `cart` - Shopping cart
- `expos` - Online expo events
- `expo_booths` - Expo booth management
- `analytics` - Shop analytics

## 🎨 Admin Dashboard Features

### Dashboard Tab
- Total products, orders, revenue
- User & vendor statistics
- Recent orders list
- Top selling products
- Revenue charts

### Products Tab
- Search & filter products
- Add new products
- Edit existing products
- Delete products
- Manage categories
- Set product status
- Track inventory

### Sellers Tab
- View all sellers
- Activate/deactivate accounts
- Monitor sales performance
- View shop ratings
- Track total sales
- Manage seller status

### Translations Tab
- 10+ language support
- Add/edit translations
- Language switcher
- Dynamic content

### Activity Logs Tab
- All admin actions
- User activity tracking
- IP address logging
- Timestamp records

## 🔐 Security Features

- JWT authentication
- Bcrypt password hashing
- Admin role verification
- Protected API routes
- SQL injection prevention
- XSS protection
- CORS configuration
- Activity logging

## 🌐 Supported Languages

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

## 📱 API Endpoints

### Admin Routes
```
POST   /api/admin/login
GET    /api/admin/stats
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
GET    /api/admin/categories
POST   /api/admin/categories
GET    /api/admin/sellers
PUT    /api/admin/sellers/:id/status
GET    /api/admin/translations
POST   /api/admin/translations
GET    /api/admin/logs
```

### Notification Routes
```
GET    /api/notifications
PUT    /api/notifications/:id/read
DELETE /api/notifications/:id
```

### Coupon Routes
```
POST   /api/coupons/validate
POST   /api/coupons/apply
```

## 🛠️ Product Management

### Create Product
1. Click "Add Product"
2. Fill in details:
   - Name, description
   - Price, compare price
   - SKU, quantity
   - Category
   - Published status
3. Click "Create Product"

### Update Product
1. Find product in list
2. Click edit icon
3. Modify fields
4. Click "Update Product"

### Delete Product
1. Click delete icon
2. Confirm deletion
3. Product removed

## 👥 Seller Management

### View Sellers
- All registered sellers
- Shop information
- Sales statistics
- Rating display

### Manage Status
1. Select seller
2. Choose Active/Inactive
3. Auto-updates

## 🔔 Notification System

- Real-time notifications
- Order updates
- Message alerts
- Review notifications
- System announcements
- Mark as read
- Delete notifications

## 🎟️ Coupon System

### Features
- Percentage discounts
- Fixed amount discounts
- Minimum order amount
- Usage limits
- Date range validity
- Auto-validation

### Usage
```javascript
// Validate coupon
POST /api/coupons/validate
{
  "code": "SAVE20",
  "orderAmount": 100
}

// Apply coupon
POST /api/coupons/apply
{
  "code": "SAVE20"
}
```

## 📦 Shipping Rates

- Country-based rates
- Region-specific pricing
- Estimated delivery days
- Active/inactive status
- Shop-specific rates

## 📈 Analytics Features

- Daily shop views
- Click tracking
- Sales monitoring
- Revenue tracking
- Date-based reports

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
# Verify credentials in .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bakomarketplace
```

### Can't Login
```bash
cd backend
npm run setup-admin
```

### Port Already in Use
```bash
# Change backend port in .env
PORT=5001

# Change frontend port in vite.config.ts
server: { port: 5174 }
```

### Foreign Key Errors
```bash
# Drop and recreate database
mysql -u root -p
DROP DATABASE bakomarketplace;
CREATE DATABASE bakomarketplace;
exit;

# Restart backend
npm run dev
```

## 🎯 Quick Commands

```bash
# Backend
cd backend
npm install          # Install dependencies
npm run dev          # Start server
npm run setup-admin  # Create admin user

# Frontend
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production

# Database
mysql -u root -p     # Access MySQL
USE bakomarketplace; # Select database
SHOW TABLES;         # List tables
```

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=bakomarketplace
JWT_SECRET=bako_marketplace_secret_key_2024_secure
JWT_EXPIRE=7d
NODE_ENV=development
```

## 🚀 Production Deployment

1. Build frontend: `npm run build`
2. Set NODE_ENV=production
3. Use process manager (PM2)
4. Configure reverse proxy (Nginx)
5. Enable SSL/HTTPS
6. Set up database backups
7. Configure monitoring

## 📞 Support

- Check activity logs for errors
- Review browser console
- Verify API responses
- Check database connections
- Review server logs

## 🎉 Success!

Your admin system is now fully functional with:
- Complete product management
- Seller administration
- Real-time notifications
- Coupon system
- Multi-language support
- Advanced analytics
- Activity logging

**Admin Login**: reponsekdz06@gmail.com / 2025

Start managing your marketplace! 🚀
