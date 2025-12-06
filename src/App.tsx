import { useState } from 'react';
import { Header } from './components/Header';
import { AdvancedSidebar } from './components/AdvancedSidebar';
import { ProductGrid } from './components/ProductGrid';
import { ComparisonBar } from './components/ComparisonBar';
import { LiveChat } from './components/LiveChat';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { FullProductPage } from './components/FullProductPage';
import { RecentlyViewed } from './components/RecentlyViewed';
import { FlashDeals } from './components/FlashDeals';
import { RewardsProgram } from './components/RewardsProgram';
import { Toaster } from 'sonner@2.0.3';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  category: string;
  brand?: string;
  seller: {
    name: string;
    verified: boolean;
    rating: number;
    followers?: number;
    products?: number;
  };
  stock: number;
  features: string[];
  discount?: number;
  badges?: string[];
  specifications?: Record<string, string>;
  description?: string;
  variations?: {
    colors?: string[];
    sizes?: string[];
  };
  shippingInfo?: {
    free: boolean;
    estimatedDays: string;
    countries?: string[];
  };
  warranty?: string;
  returnPolicy?: string;
  bundleDeals?: Array<{ id: string; discount: number }>;
  frequentlyBought?: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
}

export interface Question {
  id: string;
  userId: string;
  userName: string;
  question: string;
  answer?: string;
  date: string;
  helpful: number;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'product'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [freeShipping, setFreeShipping] = useState(false);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<Array<Product & { quantity: number }>>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currency, setCurrency] = useState('USD');
  const [rewardPoints, setRewardPoints] = useState(1250);

  const viewProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentView('product');
    // Add to recently viewed
    if (!recentlyViewed.find(p => p.id === product.id)) {
      setRecentlyViewed([product, ...recentlyViewed.slice(0, 9)]);
    }
  };

  const backToHome = () => {
    setCurrentView('home');
    setSelectedProductId(null);
  };

  const addToComparison = (product: Product) => {
    if (comparisonList.length < 4 && !comparisonList.find(p => p.id === product.id)) {
      setComparisonList([...comparisonList, product]);
    }
  };

  const removeFromComparison = (productId: string) => {
    setComparisonList(comparisonList.filter(p => p.id !== productId));
  };

  const toggleWishlist = (product: Product) => {
    if (wishlist.find(p => p.id === product.id)) {
      setWishlist(wishlist.filter(p => p.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    // Award points
    setRewardPoints(prev => prev + Math.floor(product.price * 0.1));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        currency={currency}
        setCurrency={setCurrency}
        rewardPoints={rewardPoints}
      />
      
      {currentView === 'home' ? (
        <>
          <FlashDeals onViewProduct={viewProduct} />
          
          <div className="flex max-w-[1920px] mx-auto">
            <AdvancedSidebar 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              selectedSizes={selectedSizes}
              setSelectedSizes={setSelectedSizes}
              minRating={minRating}
              setMinRating={setMinRating}
              freeShipping={freeShipping}
              setFreeShipping={setFreeShipping}
            />
            
            <main className="flex-1 p-6">
              <ProductGrid 
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                priceRange={priceRange}
                selectedBrands={selectedBrands}
                selectedColors={selectedColors}
                selectedSizes={selectedSizes}
                minRating={minRating}
                freeShipping={freeShipping}
                viewMode={viewMode}
                setViewMode={setViewMode}
                onQuickView={setQuickViewProduct}
                onViewProduct={viewProduct}
                onAddToComparison={addToComparison}
                onToggleWishlist={toggleWishlist}
                onAddToCart={addToCart}
                wishlist={wishlist}
              />
              
              {recentlyViewed.length > 0 && (
                <RecentlyViewed 
                  products={recentlyViewed}
                  onViewProduct={viewProduct}
                />
              )}
            </main>
          </div>
        </>
      ) : (
        <FullProductPage 
          productId={selectedProductId!}
          onBack={backToHome}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          onAddToComparison={addToComparison}
          isInWishlist={wishlist.some(p => p.id === selectedProductId)}
          onViewProduct={viewProduct}
        />
      )}

      {comparisonList.length > 0 && (
        <ComparisonBar 
          products={comparisonList}
          onRemove={removeFromComparison}
          onClear={() => setComparisonList([])}
        />
      )}

      <LiveChat />
      
      <RewardsProgram points={rewardPoints} />

      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          isInWishlist={wishlist.some(p => p.id === quickViewProduct.id)}
          onViewFull={() => {
            setQuickViewProduct(null);
            viewProduct(quickViewProduct);
          }}
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
        currency={currency}
      />

      <WishlistDrawer 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemove={(product) => toggleWishlist(product)}
        onAddToCart={addToCart}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}