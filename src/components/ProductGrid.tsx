import { useState, useEffect } from 'react';
import { Grid, List, ArrowUpDown, TrendingUp, Eye, GitCompare, Heart, ShoppingCart, Star, Award, Zap, Truck, Shield } from 'lucide-react';
import { Product } from '../App';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { formatCurrency, convertCurrency } from '../utils/currency';

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string;
  sortBy: string;
  setSortBy: (sort: string) => void;
  priceRange: [number, number];
  selectedBrands: string[];
  selectedColors: string[];
  selectedSizes: string[];
  minRating: number;
  freeShipping: boolean;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  onQuickView: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  onAddToComparison: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  wishlist: Product[];
  currency: string;
}

export function ProductGrid({
  searchQuery,
  selectedCategory,
  sortBy,
  setSortBy,
  priceRange,
  selectedBrands,
  selectedColors,
  selectedSizes,
  minRating,
  freeShipping,
  viewMode,
  setViewMode,
  onQuickView,
  onViewProduct,
  onAddToComparison,
  onToggleWishlist,
  onAddToCart,
  wishlist,
  currency
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        const adaptedProducts: Product[] = data.map((p: any) => ({
          id: p.id.toString(),
          name: p.name,
          price: parseFloat(p.price),
          image: p.imageUrl,
          description: p.description,
          rating: 4.5,
          reviews: 0,
          category: 'electronics',
          seller: { name: 'Backend Seller', verified: true, rating: 4.8 },
          stock: 50,
          features: [p.description],
          badges: ['From Backend']
        }));
        setProducts(adaptedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesBrands = selectedBrands.length === 0 || selectedBrands.includes(product.seller.name);
    const matchesColors = selectedColors.length === 0 || (product.features && selectedColors.some(color => product.features.includes(color)));
    const matchesSizes = selectedSizes.length === 0 || (product.features && selectedSizes.some(size => product.features.includes(size)));
    const matchesRating = product.rating >= minRating;
    const matchesFreeShipping = !freeShipping || (product.badges && product.badges.includes('Free Shipping'));
    return matchesSearch && matchesCategory && matchesPrice && matchesBrands && matchesColors && matchesSizes && matchesRating && matchesFreeShipping;
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
            {selectedCategory === 'all' ? t('all_products') : selectedCategory}
          </h2>
          <p className="text-gray-600">{t('products_found', { count: sortedProducts.length })}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            >
              <option value="relevance">{t('relevance')}</option>
              <option value="price-low">{t('price_low_high')}</option>
              <option value="price-high">{t('price_high_low')}</option>
              <option value="rating">{t('highest_rated')}</option>
              <option value="reviews">{t('most_reviews')}</option>
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
            onViewProduct={onViewProduct}
            onAddToComparison={onAddToComparison}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
            isInWishlist={wishlist.some(p => p.id === product.id)}
            currency={currency}
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
  onViewProduct: (product: Product) => void;
  onAddToComparison: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isInWishlist: boolean;
  currency: string;
}

function ProductCard({ 
  product, 
  viewMode, 
  onQuickView, 
  onViewProduct,
  onAddToComparison, 
  onToggleWishlist,
  onAddToCart,
  isInWishlist,
  currency
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  const handleAddToCart = () => {
    onAddToCart(product);
    toast.success(t('added_to_cart', { productName: product.name }));
  };

  const handleToggleWishlist = () => {
    onToggleWishlist(product);
    toast.success(isInWishlist ? t('remove_from_wishlist') : t('add_to_wishlist'));
  };

  const handleAddToComparison = () => {
    onAddToComparison(product);
    toast.success(t('added_to_comparison'));
  };
  
  const convertedPrice = convertCurrency(product.price, 'USD', currency);
  const originalPrice = product.originalPrice ? convertCurrency(product.originalPrice, 'USD', currency) : null;

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
              <span className="text-gray-600">{product.reviews.toLocaleString()} {t('reviews')}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {product.badges?.map((badge, index) => (
                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs">
                  {badge}
                </span>
              ))}
            </div>

            <ul className="space-y-1 mb-4">
              {product.features?.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-600">{formatCurrency(convertedPrice, currency)}</span>
                  {originalPrice && (
                    <>
                      <span className="text-gray-400 line-through">{formatCurrency(originalPrice, currency)}</span>
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded">-{product.discount}%</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Truck className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">{t('free_shipping')}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onQuickView(product)}
                  className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  {t('quick_view')}
                </button>
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  {t('add_to_cart')}
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
            title={t('quick_view')}
          >
            <Eye className="w-5 h-5 text-purple-600" />
          </button>
          <button
            onClick={handleAddToComparison}
            className="p-2 bg-white rounded-lg shadow-lg hover:bg-purple-50 transition-colors"
            title={t('compare')}
          >
            <GitCompare className="w-5 h-5 text-purple-600" />
          </button>
          <button
            onClick={handleToggleWishlist}
            className="p-2 bg-white rounded-lg shadow-lg hover:bg-pink-50 transition-colors"
            title={t('wishlist')}
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
          <span className="text-purple-600">{formatCurrency(convertedPrice, currency)}</span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">{formatCurrency(originalPrice, currency)}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {t('add_to_cart')}
        </button>
      </div>
    </div>
  );
}