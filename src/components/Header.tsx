import { Search, ShoppingCart, Heart, User, Bell, Globe, TrendingUp, Sparkles } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
}

export function Header({ 
  searchQuery, 
  setSearchQuery, 
  cartCount, 
  wishlistCount,
  onCartClick,
  onWishlistClick 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 px-6 py-2 text-white">
        <div className="max-w-[1920px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Premium Member Benefits - Free Shipping on All Orders</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 hover:opacity-80">
              <Globe className="w-4 h-4" />
              <span>EN</span>
            </button>
            <button className="flex items-center gap-1 hover:opacity-80">
              <TrendingUp className="w-4 h-4" />
              <span>Sell on Bako</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="max-w-[1920px] mx-auto flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white">B</span>
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">bako</span>
          </div>

          <div className="flex-1 max-w-3xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products, brands, categories..."
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
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

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

            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow">
              <User className="w-5 h-5" />
              <span>Sign In</span>
            </button>
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
              {item}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
