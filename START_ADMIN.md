# Quick Start - Admin Dashboard

## 🚀 Fast Setup (5 minutes)

### Step 1: Database Setup
```bash
# Start MySQL server
# Create database
mysql -u root -p
CREATE DATABASE bako_marketplace;
exit;

# Import schema
mysql -u root -p bako_marketplace < backend/database/schema.sql
```

### Step 2: Backend Setup
```bash
cd backend
npm install
npm run setup-admin
npm run dev
```

### Step 3: Frontend Setup
```bash
# Open new terminal
cd ..
npm install
npm run dev
```

### Step 4: Access Admin
1. Open browser: http://localhost:5173
2. Click "Admin" button in header
3. Login with:
   - Email: reponsekdz06@gmail.com
   - Password: 2025

## ✅ What You Get

### Immediate Access To:
- ✅ Full product CRUD operations
- ✅ Seller management system
- ✅ Dashboard analytics
- ✅ Translation management
- ✅ Activity logging
- ✅ Real-time updates

### Product Management:
- Create products with images
- Update prices and stock
- Delete products
- Search and filter
- Category management
- Status control (Published/Draft)

### Seller Management:
- View all sellers
- Activate/Deactivate accounts
- Monitor sales and ratings
- Shop information
- Performance tracking

### Dashboard Features:
- Total products count
- Order statistics
- Revenue tracking
- User analytics
- Recent activity
- Top products

## 🔐 Admin Credentials

**Email**: reponsekdz06@gmail.com  
**Password**: 2025

## 📊 Dashboard Tabs

1. **Dashboard** - Overview and statistics
2. **Products** - Full CRUD operations
3. **Sellers** - Seller management
4. **Translations** - Multi-language support
5. **Activity Logs** - Action tracking

## 🛠️ Common Operations

### Add Product:
1. Go to Products tab
2. Click "Add Product"
3. Fill form
4. Click "Create Product"

### Edit Product:
1. Find product in list
2. Click edit icon
3. Modify fields
4. Click "Update Product"

### Manage Seller:
1. Go to Sellers tab
2. Select seller
3. Change status dropdown
4. Status updates automatically

## 🌐 Translations

Supported languages:
- English, French, Spanish, Arabic
- Kinyarwanda, Swahili, Portuguese
- Chinese, Hindi, German

## 📝 Notes

- Backend runs on port 5000
- Frontend runs on port 5173
- All data stored in MySQL
- JWT authentication
- Activity logging enabled

## 🆘 Troubleshooting

**Can't login?**
```bash
cd backend
npm run setup-admin
```

**Database error?**
- Check MySQL is running
- Verify database exists
- Check .env file

**Port in use?**
- Change PORT in backend/.env
- Change port in vite.config.ts

## 🎯 Next Steps

1. Add your products
2. Manage sellers
3. Monitor analytics
4. Configure translations
5. Review activity logs

---

**Ready to manage your marketplace!** 🎉
