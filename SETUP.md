# Bako Marketplace - Complete Setup Guide

## 🚀 Backend Setup (Node.js + MySQL)

### 1. Install MySQL
- Download and install MySQL from https://dev.mysql.com/downloads/
- Create a database named `bako_marketplace`
- Update credentials in `backend/.env`

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Configure Environment
Edit `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bako_marketplace
JWT_SECRET=your_secret_key
```

### 4. Start Backend Server
```bash
npm run dev
```
Server runs on http://localhost:5000

## 🎨 Frontend Setup (React + TypeScript)

### 1. Install Frontend Dependencies
```bash
cd ..
npm install
```

### 2. Start Frontend
```bash
npm run dev
```
App runs on http://localhost:5173

## 📊 Database Schema

The backend automatically creates these tables:
- **users** - User accounts
- **shops** - Seller shops
- **products** - Product listings
- **product_images** - Product images
- **product_variations** - Product variants
- **orders** - Customer orders
- **order_items** - Order line items
- **reviews** - Product reviews
- **messages** - Chat messages
- **wishlist** - User wishlists
- **cart** - Shopping carts
- **expos** - Virtual exhibitions
- **expo_booths** - Expo booths
- **analytics** - Business analytics

## 🔌 API Endpoints

### Authentication
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user

### Products
- GET `/api/products` - Get all products (with filters)
- GET `/api/products/:id` - Get product details
- POST `/api/products` - Create product (auth required)
- PUT `/api/products/:id` - Update product (auth required)
- DELETE `/api/products/:id` - Delete product (auth required)

### Orders
- POST `/api/orders` - Create order (auth required)
- GET `/api/orders` - Get user orders (auth required)
- PUT `/api/orders/:id/status` - Update order status (auth required)

### Shops
- GET `/api/shops/:id` - Get shop details
- GET `/api/shops/user/:userId` - Get user's shop (auth required)

### Messages
- POST `/api/messages` - Send message (auth required)
- GET `/api/messages/conversations` - Get conversations (auth required)
- GET `/api/messages/:userId` - Get messages with user (auth required)

### Expos
- GET `/api/expos` - Get all expos
- GET `/api/expos/:id/booths` - Get expo booths

### Analytics
- GET `/api/analytics/dashboard` - Get seller dashboard (auth required)

## 🌟 Features Implemented

### Backend Features
✅ RESTful API with Express.js
✅ MySQL database with connection pooling
✅ JWT authentication
✅ Password hashing with bcrypt
✅ Real-time messaging with Socket.IO
✅ File upload support
✅ Advanced search with full-text indexing
✅ Order management system
✅ Analytics tracking
✅ Security middleware (Helmet, CORS)
✅ Rate limiting
✅ Compression

### Frontend Features
✅ Connected to backend APIs
✅ Real authentication system
✅ Product CRUD operations
✅ Order management
✅ Real-time messaging
✅ Shopping cart & wishlist
✅ Multi-language support (10 languages)
✅ Multi-currency support (12 currencies)
✅ Scrollable header (not fixed)
✅ Advanced search & filters
✅ Seller dashboard
✅ Analytics dashboard
✅ Virtual expos
✅ Video/audio calls
✅ Product reviews
✅ Responsive design

## 🔒 Security Features

- JWT token authentication
- Password hashing
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting
- Helmet security headers
- Input validation

## 📱 Real-time Features

- Live chat messaging
- Order status updates
- Stock level updates
- Typing indicators
- Online/offline status

## 🎯 Advanced Features

### For Buyers
- Advanced product search
- Smart filters
- Product comparison
- Wishlist management
- Order tracking
- Real-time chat with sellers
- Video calls with sellers
- Product reviews
- Reward points

### For Sellers
- Complete dashboard
- Inventory management
- Order processing
- Sales analytics
- Customer insights
- Bulk operations
- Product management
- Message management
- Expo participation

## 🌐 Multi-Language Support

Supported languages:
- English (EN)
- Kinyarwanda (RW)
- French (FR)
- Swahili (SW)
- Spanish (ES)
- Portuguese (PT)
- Arabic (AR)
- Chinese (ZH)
- Hindi (HI)
- German (DE)

## 💰 Multi-Currency Support

Supported currencies:
- USD, EUR, GBP, JPY
- RWF, KES, UGX, TZS
- ETB, GHS, NGN, ZAR

## 🚀 Production Deployment

### Backend
1. Set NODE_ENV=production
2. Use PM2 for process management
3. Set up SSL certificates
4. Configure production database
5. Set up backup system

### Frontend
1. Run `npm run build`
2. Deploy to Vercel/Netlify
3. Configure environment variables
4. Set up CDN

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bako_marketplace
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend
API URL is configured in `src/services/api.ts`

## 🐛 Troubleshooting

### Database Connection Issues
- Check MySQL is running
- Verify credentials in .env
- Ensure database exists

### CORS Errors
- Check backend CORS configuration
- Verify frontend URL in backend

### Authentication Issues
- Clear localStorage
- Check JWT token expiry
- Verify API endpoints

## 📞 Support

For issues or questions:
1. Check database connection
2. Verify all dependencies installed
3. Check console for errors
4. Review API responses

---

**Built with React, TypeScript, Node.js, Express, MySQL, Socket.IO**
