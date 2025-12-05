import { Smartphone, Laptop, Shirt, Home, Dumbbell, Sparkles, Star, Award, Zap } from 'lucide-react';

interface SidebarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const categories = [
  { id: 'all', name: 'All Products', icon: Sparkles },
  { id: 'electronics', name: 'Electronics', icon: Smartphone },
  { id: 'computers', name: 'Computers & Laptops', icon: Laptop },
  { id: 'fashion', name: 'Fashion & Apparel', icon: Shirt },
  { id: 'home', name: 'Home & Living', icon: Home },
  { id: 'sports', name: 'Sports & Outdoors', icon: Dumbbell },
];

export function Sidebar({ selectedCategory, setSelectedCategory, priceRange, setPriceRange }: SidebarProps) {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 p-6 sticky top-[180px] h-[calc(100vh-180px)] overflow-y-auto">
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <h3>Categories</h3>
          </div>
          <div className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4">Price Range</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Min"
              />
              <span className="text-gray-500">—</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Max"
              />
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-purple-600"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4">Rating</h3>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                className="w-full flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">& Up</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4">Special Offers</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-purple-600" />
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Flash Deals</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-purple-600" />
              <Award className="w-4 h-4 text-blue-500" />
              <span>Top Rated</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-purple-600" />
              <Star className="w-4 h-4 text-purple-500" />
              <span>Premium Sellers</span>
            </label>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4">Shipping Options</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-purple-600" />
              <span>Free Shipping</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-purple-600" />
              <span>Express Delivery</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-purple-600" />
              <span>Same Day Delivery</span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
