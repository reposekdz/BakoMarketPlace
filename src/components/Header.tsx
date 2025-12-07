import { Search, ShoppingCart, Heart, User, Bell, Globe, TrendingUp, Sparkles, DollarSign, Award, Store, TrendingDown, Calendar, LogOut, Settings, Package, Home, MapPin, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from './LanguageProvider';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  currency: string;
  setCurrency: (currency: string) => void;
  rewardPoints: number;
  user?: any;
  onNavigate?: (view: string) => void;
  currentView?: string;
  onSignInClick?: () => void;
  onHomeClick?: () => void;
  onAdminClick?: () => void;
}

export function Header({ 
  searchQuery, 
  setSearchQuery, 
  cartCount, 
  wishlistCount,
  onCartClick,
  onWishlistClick,
  currency,
  setCurrency,
  rewardPoints,
  user,
  onNavigate,
  currentView,
  onSignInClick,
  onHomeClick,
  onAdminClick
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 px-6 py-2 text-white">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Premium Member Benefits - Free Shipping on All Orders</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-white/20 px-3 py-1 rounded text-white border-none outline-none cursor-pointer"
            >
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="GBP">GBP £</option>
              <option value="JPY">JPY ¥</option>
              <option value="RWF">RWF Fr</option>
              <option value="KES">KES KSh</option>
              <option value="UGX">UGX USh</option>
              <option value="TZS">TZS TSh</option>
              <option value="ETB">ETB Br</option>
              <option value="GHS">GHS ₵</option>
              <option value="NGN">NGN ₦</option>
              <option value="ZAR">ZAR R</option>
            </select>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/20 px-3 py-1 rounded text-white border-none outline-none cursor-pointer flex items-center gap-1"
            >
              <option value="en">🇺🇸 EN</option>
              <option value="rw">🇷🇼 RW</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="sw">🇹🇿 SW</option>
              <option value="es">🇪🇸 ES</option>
              <option value="pt">🇵🇹 PT</option>
              <option value="ar">🇸🇦 AR</option>
              <option value="zh">🇨🇳 ZH</option>
              <option value="hi">🇮🇳 HI</option>
              <option value="de">🇩🇪 DE</option>
            </select>
            <button 
              onClick={() => onNavigate?.('expo')}
              className="flex items-center gap-1 hover:opacity-80"
            >
              <Calendar className="w-4 h-4" />
              <span>Online Expo</span>
            </button>
            {user?.isSeller && (
              <button 
                onClick={() => onNavigate?.('seller-dashboard')}
                className="flex items-center gap-1 hover:opacity-80"
              >
                <Store className="w-4 h-4" />
                <span>My Shop</span>
              </button>
            )}
            <button 
              onClick={() => onNavigate?.('shops')}
              className="flex items-center gap-1 hover:opacity-80"
            >
              <Store className="w-4 h-4" />
              <span>{language === 'rw' ? 'Amaduka' : 'Shops'}</span>
            </button>
            <button 
              onClick={() => onNavigate?.('nearby')}
              className="flex items-center gap-1 hover:opacity-80"
            >
              <MapPin className="w-4 h-4" />
              <span>{language === 'rw' ? 'Hafi' : 'Nearby'}</span>
            </button>
            {user && (
              <button 
                onClick={() => onNavigate?.('messages')}
                className="flex items-center gap-1 hover:opacity-80"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </button>
            )}
            <button 
              onClick={() => onNavigate?.('sponsorship')}
              className="flex items-center gap-1 hover:opacity-80"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{t('nav.becomeSponsor')}</span>
            </button>
            <button 
              onClick={onAdminClick}
              className="flex items-center gap-1 hover:opacity-80"
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </button>
            <div className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded">
              <Award className="w-4 h-4" />
              <span>{rewardPoints} pts</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="max-w-[1920px] mx-auto flex items-center gap-8">
          <button 
            onClick={onHomeClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">B</span>
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-bold text-xl">bako</span>
          </button>

          <div className="flex-1 max-w-3xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Laptops', 'Headphones', 'Smart Watch', 'Camera'].map((term) => (
                    <button 
                      key={term}
                      className="px-3 py-1 bg-gray-100 rounded-full hover:bg-purple-100 hover:text-purple-600 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user && <NotificationCenter />}

            <button 
              onClick={onWishlistClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Heart className="w-6 h-6 text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button 
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button 
              onClick={onSignInClick}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              <User className="w-5 h-5" />
              <span>{user ? t('auth.signOut') : t('auth.signIn')}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Settings className="w-4 h-4" />
                  <span>Account Settings</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Profile', 'Orders', 'Wishlist', 'Addresses'].map((term) => (
                    <button 
                      key={term}
                      className="px-3 py-1 bg-gray-100 rounded-full hover:bg-purple-100 hover:text-purple-600 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-gray-500 mt-2">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-3">
        <div className="max-w-[1920px] mx-auto flex items-center gap-6">
          {[
            'Flash Deals',
            'Top Sellers',
            'New Arrivals',
            'Electronics',
            'Fashion',
            'Home & Living',
            'Sports & Outdoors',
            'Beauty & Health'
          ].map((item) => (
            <button 
              key={item}
              className="text-gray-700 hover:text-purple-600 transition-colors whitespace-nowrap"
            >
              {t(`nav.${item.toLowerCase().replace(/\s+/g, '')}`) || item}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}