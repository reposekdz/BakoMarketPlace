import { useState } from 'react';
import { Grid, List, ArrowUpDown, TrendingUp, Eye, GitCompare, Heart, ShoppingCart, Star, Award, Zap, Truck, Shield } from 'lucide-react';
import { Product } from '../App';
import { toast } from 'sonner@2.0.3';

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  setSortBy: (sort: string) => void;
  priceRange: [number, number];
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onQuickView: (product: Product) => void;
  onAddToComparison: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  wishlist: Product[];
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Ultrabook Pro 15"',
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviews: 2847,
    image: 'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjQ5NDcyNzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'computers',
    seller: { name: 'TechGlobal Store', verified: true, rating: 4.9 },
    stock: 45,
    features: ['Intel i7 12th Gen', '16GB RAM', '512GB SSD', '15.6" 4K Display'],
    discount: 19,
    badges: ['Best Seller', 'Fast Shipping']
  },
  {
    id: '2',
    name: 'Wireless Noise Cancelling Headphones',
    price: 299,
    originalPrice: 399,
    rating: 4.7,
    reviews: 1923,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzY0ODYxMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'electronics',
    seller: { name: 'AudioPro', verified: true, rating: 4.8 },
    stock: 120,
    features: ['Active Noise Cancelling', '40hr Battery', 'Premium Sound', 'Foldable Design'],
    discount: 25,
    badges: ['Top Rated', 'Free Shipping']
  },
  {
    id: '3',
    name: 'Flagship Smartphone 5G',
    price: 899,
    originalPrice: 1099,
    rating: 4.9,
    reviews: 3421,
    image: 'https://images.unsplash.com/photo-1732998369893-af4c9a4695fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZGV2aWNlfGVufDF8fHx8MTc2NDg5MTMyN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'electronics',
    seller: { name: 'MobileMart', verified: true, rating: 4.9 },
    stock: 87,
    features: ['6.7" AMOLED', '256GB Storage', '108MP Camera', '5000mAh Battery'],
    discount: 18,
    badges: ['New Arrival', 'Premium']
  },
  {
    id: '4',
    name: 'Smart Watch Ultra',
    price: 449,
    rating: 4.6,
    reviews: 1654,
    image: 'https://images.unsplash.com/photo-1719744755507-a4c856c57cf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwd2VhcmFibGV8ZW58MXx8fHwxNzY0ODQ4ODg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'electronics',
    seller: { name: 'Wearable Tech Co.', verified: true, rating: 4.7 },
    stock: 203,
    features: ['GPS Tracking', 'Health Monitoring', 'Water Resistant', '7 Day Battery'],
    badges: ['Trending']
  },
  {
    id: '5',
    name: 'Professional DSLR Camera Kit',
    price: 1899,
    originalPrice: 2299,
    rating: 4.9,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1579535984712-92fffbbaa266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NjQ5MjA3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'electronics',
    seller: { name: 'PhotoPro', verified: true, rating: 4.9 },
    stock: 34,
    features: ['45MP Sensor', '4K Video', '2 Lens Kit', 'Professional Grade'],
    discount: 17,
    badges: ['Pro Choice', 'Limited Stock']
  },
  {
    id: '6',
    name: 'Next-Gen Gaming Console',
    price: 499,
    rating: 4.8,
    reviews: 5234,
    image: 'https://images.unsplash.com/photo-1580234797602-22c37b2a6230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb25zb2xlfGVufDF8fHx8MTc2NDk0OTY2Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'electronics',
    seller: { name: 'Gaming World', verified: true, rating: 4.8 },
    stock: 156,
    features: ['4K 120fps', '1TB SSD', 'Ray Tracing', 'Wireless Controller'],
    badges: ['Hot Deal', 'Best Seller']
  },
  {
    id: '7',
    name: 'Pro Tablet 12.9"',
    price: 1099,
    originalPrice: 1299,
    rating: 4.7,
    reviews: 1432,
    image: 'https://images.unsplash.com/photo-1760708369071-e8a50a8979cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBkZXZpY2V8ZW58MXx8fHwxNzY0OTM4MDkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'computers',
    seller: { name: 'TabletZone', verified: true, rating: 4.8 },
    stock: 92,
    features: ['12.9" Liquid Retina', 'M2 Chip', 'Apple Pencil Support', '256GB'],
    discount: 15,
    badges: ['Premium', 'Free Stylus']
  },
  {
    id: '8',
    name: '4K Drone with Camera',
    price: 799,
    originalPrice: 999,
    rating: 4.6,
    reviews: 743,
    image: 'https://images.unsplash.com/photo-1583824904181-a8bbedd1e1c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMHF1YWRjb3B0ZXJ8ZW58MXx8fHwxNzY0ODk3Mzc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'electronics',
    seller: { name: 'SkyTech', verified: true, rating: 4.7 },
    stock: 67,
    features: ['4K Camera', '30min Flight Time', 'GPS Return', 'Obstacle Avoidance'],
    discount: 20,
    badges: ['New Technology']
  }
];

export function ProductGrid({
  searchQuery,
  selectedCategory,
  sortBy,
  setSortBy,
  priceRange,
  viewMode,
  setViewMode,
  onQuickView,
  onAddToComparison,
  onToggleWishlist,
  onAddToCart,
  wishlist
}: ProductGridProps) {
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'reviews': return b.reviews - a.reviews;
      default: return 0;
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="mb-1">
            {selectedCategory === 'all' ? 'All Products' : selectedCategory}
          </h2>
          <p className="text-gray-600">{sortedProducts.length} products found</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="relevance">Most Relevant</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
            </select>
          </div>

          <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        : 'flex flex-col gap-4'
      }>
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            onQuickView={onQuickView}
            onAddToComparison={onAddToComparison}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
            isInWishlist={wishlist.some(p => p.id === product.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onQuickView: (product: Product) => void;
  onAddToComparison: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isInWishlist: boolean;
}

function ProductCard({ 
  product, 
  viewMode, 
  onQuickView, 
  onAddToComparison, 
  onToggleWishlist,
  onAddToCart,
  isInWishlist 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    onToggleWishlist(product);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const handleAddToComparison = () => {
    onAddToComparison(product);
    toast.success('Added to comparison!');
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex gap-6">
          <div className="w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  {product.seller.verified && <Award className="w-4 h-4 text-blue-500" />}
                  <span className="text-gray-600">{product.seller.name}</span>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-600">{product.seller.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleToggleWishlist}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} />
                </button>
                <button 
                  onClick={handleAddToComparison}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <GitCompare className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{product.reviews.toLocaleString()} reviews</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {product.badges?.map((badge, index) => (
                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs">
                  {badge}
                </span>
              ))}
            </div>

            <ul className="space-y-1 mb-4">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-600">${product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-gray-400 line-through">${product.originalPrice}</span>
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded">-{product.discount}%</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Truck className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onQuickView(product)}
                  className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  Quick View
                </button>
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        
        {product.discount && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-red-500 text-white rounded-full">
            -{product.discount}%
          </div>
        )}

        {product.badges && product.badges[0] && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-purple-600 text-white rounded-full text-sm">
            {product.badges[0]}
          </div>
        )}

        <div className={`absolute inset-x-0 bottom-0 p-4 flex gap-2 justify-center transition-all ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <button
            onClick={() => onQuickView(product)}
            className="p-2 bg-white rounded-lg shadow-lg hover:bg-purple-50 transition-colors"
            title="Quick View"
          >
            <Eye className="w-5 h-5 text-purple-600" />
          </button>
          <button
            onClick={handleAddToComparison}
            className="p-2 bg-white rounded-lg shadow-lg hover:bg-purple-50 transition-colors"
            title="Compare"
          >
            <GitCompare className="w-5 h-5 text-purple-600" />
          </button>
          <button
            onClick={handleToggleWishlist}
            className="p-2 bg-white rounded-lg shadow-lg hover:bg-pink-50 transition-colors"
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-pink-500 text-pink-500' : 'text-pink-500'}`} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {product.seller.verified && <Award className="w-4 h-4 text-blue-500" />}
          <span className="text-sm text-gray-600">{product.seller.name}</span>
        </div>

        <h3 className="mb-2 line-clamp-2 min-h-[3rem]">{product.name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{product.rating}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">{product.reviews.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-purple-600">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
