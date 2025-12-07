import { useState, useEffect } from 'react';
import { AuthPages } from './components/AuthPages';
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
import { SellerDashboard } from './components/SellerDashboard';
import { OnlineExpo } from './components/OnlineExpo';
import { UltimateExpoHub } from './components/UltimateExpoHub';
import { ExpoApplicationForm } from './components/ExpoApplicationForm';
import { SponsorshipForm } from './components/SponsorshipForm';
import { SponsorshipPage } from './components/SponsorshipPage';
import { BackToTop } from './components/BackToTop';
import { LanguageProvider } from './components/LanguageProvider';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { ConversationHub } from './components/ConversationHub';
import { NearbyProducts } from './components/NearbyProducts';
import { NotificationCenter } from './components/NotificationCenter';
import { ShopBrowser } from './components/ShopBrowser';
import { ShopView } from './components/ShopView';
import { ModernAuthPanel } from './components/ModernAuthPanel';
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
    id?: string;
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
  deliveryOptions?: {
    delivery: boolean;
    pickup: boolean;
  };
  biddingEnabled?: boolean;
  currentBid?: number;
  biddingEndTime?: string;
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
  const [user, setUser] = useState<any>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'product' | 'seller-dashboard' | 'expo' | 'sponsorship' | 'admin' | 'messages' | 'nearby' | 'shops' | 'shop-view' | 'expo-apply' | 'sponsor-apply'>('home');
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
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
  const [showAuthPanel, setShowAuthPanel] = useState(false);



  const viewProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setCurrentView('product');
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
    setShowAuthPanel(false);
    setCurrentView('home');
  };

  const handleSignInClick = () => {
    if (user) {
      setUser(null);
    } else {
      setShowAuthPanel(true);
    }
  };

  const handleAdminLogin = (token: string, user: any) => {
    setAdminUser(user);
    setShowAdminLogin(false);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    setCurrentView('home');
  };

  // Check for admin session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedAdmin = localStorage.getItem('adminUser');
    if (token && savedAdmin) {
      setAdminUser(JSON.parse(savedAdmin));
    }
  }, []);

  // Show admin dashboard if logged in as admin
  if (adminUser && currentView === 'admin') {
    return (
      <LanguageProvider>
        <AdminDashboard onLogout={handleAdminLogout} />
        <Toaster position="bottom-right" />
      </LanguageProvider>
    );
  }

  // Show admin login
  if (showAdminLogin) {
    return (
      <LanguageProvider>
        <AdminLogin onLogin={handleAdminLogin} />
        <Toaster position="bottom-right" />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
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
          onNavigate={setCurrentView}
          currentView={currentView}
          onSignInClick={handleSignInClick}
          onHomeClick={() => setCurrentView('home')}
          onAdminClick={() => setShowAdminLogin(true)}
        />
      
      <div className="pt-[180px]">
      {currentView === 'home' && (
        <>
          <FlashDeals onViewProduct={viewProduct} />
          
          <div className="flex max-w-[1920px] mx-auto pt-4">
            <div className="w-80 flex-shrink-0">
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
            </div>
            
            <main className="flex-1 p-6 overflow-y-auto">
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
      )}

      {currentView === 'product' && (
        <FullProductPage 
          productId={selectedProductId!}
          onBack={backToHome}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          onAddToComparison={addToComparison}
          isInWishlist={wishlist.some(p => p.id === selectedProductId)}
          onViewProduct={viewProduct}
          user={user}
        />
      )}

      {currentView === 'seller-dashboard' && (
        <SellerDashboard 
          user={user}
          onNavigate={setCurrentView}
        />
      )}

      {currentView === 'expo' && (
        <UltimateExpoHub 
          onViewProduct={viewProduct}
          user={user}
        />
      )}

      {currentView === 'expo-apply' && (
        <div className="max-w-2xl mx-auto p-6">
          <ExpoApplicationForm 
            expoId={1}
            expoName="Tech Innovation Expo 2025"
            shopId={user?.shopId}
            onSuccess={() => setCurrentView('expo')}
          />
        </div>
      )}

      {currentView === 'sponsor-apply' && (
        <div className="max-w-2xl mx-auto p-6">
          <SponsorshipForm 
            expoId={1}
            expoName="Tech Innovation Expo 2025"
            onSuccess={() => setCurrentView('expo')}
          />
        </div>
      )}

      {currentView === 'sponsorship' && (
        <SponsorshipPage 
          user={user}
          onBack={() => setCurrentView('home')}
        />
      )}

      {currentView === 'messages' && user && (
        <div className="max-w-7xl mx-auto p-6">
          <ConversationHub userId={user.userId} />
        </div>
      )}

      {currentView === 'nearby' && (
        <div className="max-w-7xl mx-auto p-6">
          <NearbyProducts onViewProduct={viewProduct} />
        </div>
      )}

      {currentView === 'shops' && (
        <div className="max-w-7xl mx-auto p-6">
          <ShopBrowser onViewShop={(shopId) => { setSelectedShopId(shopId); setCurrentView('shop-view'); }} />
        </div>
      )}

      {currentView === 'shop-view' && selectedShopId && (
        <div className="max-w-7xl mx-auto p-6">
          <ShopView 
            shopId={selectedShopId} 
            onBack={() => setCurrentView('shops')} 
            onAddToCart={addToCart}
            user={user}
          />
        </div>
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

        <BackToTop />

        <ModernAuthPanel 
          isOpen={showAuthPanel}
          onClose={() => setShowAuthPanel(false)}
          onLogin={handleLogin}
        />

        <Toaster position="bottom-right" />
      </div>
      </div>
    </LanguageProvider>
  );
}
