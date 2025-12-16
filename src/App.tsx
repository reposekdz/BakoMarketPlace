import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { AuthPages } from './components/AuthPages';
import { Header } from './components/Header';
import { AdvancedSidebar } from './components/AdvancedSidebar';
import { ProductGrid } from './components/ProductGrid';
import { ComparisonBar } from './components/ComparisonBar';
import { LiveChat } from './components/LiveChat';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { RecentlyViewed } from './components/RecentlyViewed';
import { FlashDeals } from './components/FlashDeals';
import { RewardsProgram } from './components/RewardsProgram';
import { Toaster } from 'sonner';

// ... (keep the interfaces Product, Review, Question as they are)

export default function App() {
  const [user, setUser] = useState<any>(null);
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
  
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const viewProduct = (product: Product) => {
    if (!recentlyViewed.find(p => p.id === product.id)) {
      setRecentlyViewed([product, ...recentlyViewed.slice(0, 9)]);
    }
    navigate(`/product/${product.id}`);
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

  const handleLogin = (userData: any) => {
    setUser(userData);
    if (userData.isSeller) {
      navigate('/seller-dashboard');
    }
  };

  if (!user) {
    return <AuthPages onLogin={handleLogin} />;
  }

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
        user={user}
        onNavigate={(path) => navigate(path)}
        currentView={location.pathname}
      />
      
      {location.pathname === '/' && (
        <>
          <FlashDeals onViewProduct={viewProduct} currency={currency} />
          
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
                currency={currency}
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
      )}

      <Outlet context={{ user, addToCart, toggleWishlist, addToComparison, wishlist, viewProduct, params }} />

      {comparisonList.length > 0 && (
        <ComparisonBar 
          products={comparisonList}
          onRemove={removeFromComparison}
          onClear={() => setComparisonList([])}
          currency={currency}
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
          currency={currency}
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
