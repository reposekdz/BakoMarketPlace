import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import shopRoutes from './routes/shops.js';
import messageRoutes from './routes/messages.js';
import expoRoutes from './routes/expos.js';
import analyticsRoutes from './routes/analytics.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';
import couponRoutes from './routes/coupons.js';
import conversationRoutes from './routes/conversations.js';
import locationRoutes from './routes/locations.js';
import callRoutes from './routes/calls.js';
import analyticsRoutes2 from './routes/analytics.js';
import seedRoutes from './routes/seed.js';
import advertisementRoutes from './routes/advertisements.js';
import expoRoutes2 from './routes/expos.js';
import innovationRoutes from './routes/innovations.js';
import streamingRoutes from './routes/streaming.js';
import revolutionaryRoutes from './routes/revolutionary.js';
import translationRoutes from './routes/translations.js';
import currencyRoutes from './routes/currencies.js';
import advancedFeaturesRoutes from './routes/advanced-features.js';
import aiFeaturesRoutes from './routes/ai-features.js';
import seedCurrenciesRoutes from './routes/seed-currencies.js';
import expoApplicationsRoutes from './routes/expo-applications.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', credentials: true }
});

app.use(helmet());
app.use(compression());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/expos', expoRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/track', analyticsRoutes2);
app.use('/api/seed', seedRoutes);
app.use('/api/ads', advertisementRoutes);
app.use('/api/expo', expoRoutes2);
app.use('/api/innovations', innovationRoutes);
app.use('/api/streaming', streamingRoutes);
app.use('/api/revolutionary', revolutionaryRoutes);
app.use('/api/translations', translationRoutes);
app.use('/api/currencies', currencyRoutes);
app.use('/api/advanced', advancedFeaturesRoutes);
app.use('/api/ai', aiFeaturesRoutes);
app.use('/api/seed-data', seedCurrenciesRoutes);
app.use('/api/expo-apply', expoApplicationsRoutes);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
  });
  
  socket.on('send-message', (data) => {
    io.to(data.roomId).emit('receive-message', data);
  });
  
  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('user-typing', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

initDatabase().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export { io };
