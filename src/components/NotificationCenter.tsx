import { useState } from 'react';
import { 
  X, 
  Bell, 
  Package, 
  ShoppingCart, 
  TrendingDown, 
  MessageCircle, 
  Star, 
  Calendar,
  Gift,
  AlertCircle,
  Check,
  Trash2,
  Filter
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Notification {
  id: string;
  type: 'order' | 'price_drop' | 'message' | 'review' | 'expo' | 'promo' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
  image?: string;
  actionUrl?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function NotificationCenter({ isOpen, onClose, user }: NotificationCenterProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'Order Shipped',
      message: 'Your order #12345 has been shipped and will arrive in 2-3 days',
      time: '5 min ago',
      read: false,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'
    },
    {
      id: '2',
      type: 'price_drop',
      title: 'Price Drop Alert!',
      message: 'The wireless headphones in your wishlist dropped by 25%',
      time: '1 hour ago',
      read: false,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message from TechStore',
      message: 'Your question about the laptop specifications has been answered',
      time: '2 hours ago',
      read: false,
    },
    {
      id: '4',
      type: 'expo',
      title: 'Live Expo Starting Soon',
      message: 'Global Tech Summit 2026 goes live in 30 minutes',
      time: '3 hours ago',
      read: true,
    },
    {
      id: '5',
      type: 'promo',
      title: 'Exclusive Offer: 500 Points Bonus',
      message: 'Complete your profile to earn 500 reward points',
      time: '5 hours ago',
      read: true,
    },
    {
      id: '6',
      type: 'review',
      title: 'Review Reminder',
      message: 'How was your recent purchase? Share your experience',
      time: '1 day ago',
      read: true,
    },
    {
      id: '7',
      type: 'alert',
      title: 'Stock Alert',
      message: 'iPhone 15 Pro is back in stock - only 5 units left!',
      time: '1 day ago',
      read: true,
    },
  ]);

  const getIcon = (type: string) => {
    switch(type) {
      case 'order': return <Package className="w-5 h-5 text-blue-500" />;
      case 'price_drop': return <TrendingDown className="w-5 h-5 text-green-500" />;
      case 'message': return <MessageCircle className="w-5 h-5 text-purple-500" />;
      case 'review': return <Star className="w-5 h-5 text-yellow-500" />;
      case 'expo': return <Calendar className="w-5 h-5 text-pink-500" />;
      case 'promo': return <Gift className="w-5 h-5 text-orange-500" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'important') return ['order', 'alert', 'price_drop'].includes(n.type);
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
              )}
            </SheetTitle>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-purple-600 hover:text-purple-700"
              >
                <Check className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* Filter Tabs */}
          <div className="flex gap-2 border-b pb-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'unread' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('important')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'important' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Important
            </button>
          </div>

          {/* Notification List */}
          <div className="space-y-2">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No notifications</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                    notification.read 
                      ? 'bg-white border-gray-200' 
                      : 'bg-purple-50 border-purple-200'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-semibold ${
                          notification.read ? 'text-gray-900' : 'text-purple-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      
                      {notification.image && (
                        <img 
                          src={notification.image} 
                          alt=""
                          className="w-16 h-16 rounded-lg object-cover mt-2"
                        />
                      )}
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-500">
                          {notification.time}
                        </span>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-4 mt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Notification Settings</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <span className="text-sm text-gray-700">Order updates</span>
                <input type="checkbox" defaultChecked className="rounded text-purple-600" />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <span className="text-sm text-gray-700">Price drop alerts</span>
                <input type="checkbox" defaultChecked className="rounded text-purple-600" />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <span className="text-sm text-gray-700">Expo reminders</span>
                <input type="checkbox" defaultChecked className="rounded text-purple-600" />
              </label>
              <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                <span className="text-sm text-gray-700">Promotional offers</span>
                <input type="checkbox" className="rounded text-purple-600" />
              </label>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
