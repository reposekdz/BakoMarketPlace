import { useState, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

// Component Imports
import { Header } from './components/Header';
import { AdvancedSidebar } from './components/AdvancedSidebar';
import { ProductGrid, products as allProducts } from './components/ProductGrid';
import { ComparisonBar } from './components/ComparisonBar';
import { LiveChat } from './components/LiveChat';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { RecentlyViewed } from './components/RecentlyViewed';
import { FlashDeals } from './components/FlashDeals';
import { RewardsProgram } from './components/RewardsProgram';
import { RecommendedForYou } from './components/RecommendedForYou';
import { ShopTheLook } from './components/ShopTheLook';
import { LiveAuctionsDrawer } from './components/LiveAuctions';
import { AuctionPulse } from './components/AuctionPulse';

// Lib Imports
import { getRecommendedProducts } from './lib/recommendations';

// Type Definitions
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string | string[];
  rating: number;
  reviews: number;
  description: string;
  marketId?: string;
  discount?: number;
  stock?: number;
  tags?: string[];
}

export interface Review { id: string; author: string; rating: number; title: string; text: string; date: string; verifiedPurchase: boolean; images?: string[]; }
export interface Question { id: string; author: string; question: string; answer: string | null; date: string; }
export interface Market { id: string; name: string; description: string; logo: File | null | string; banner: File | null | string; category: string; tags?: string[]; contactEmail: string; website?: string; isFeatured?: boolean; productCount?: number; rating?: number; }
export interface Look { id: string; title: string; image: string; products: Product[]; }

// App Context Type
export type AppContext = {
    user: any;
    cart: Array<Product & { quantity: number }>;
    wishlist: Product[];
    currency: string;
    rewardPoints: number;
    addToCart: (product: Product, quantity: number) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    toggleWishlist: (product: Product) => void;
    setQuickViewProduct: (product: Product | null) => void;
    viewProduct: (product: Product) => void;
};

// Mock Data for Looks
const looksData: Look[] = [
  {
    id: 'look-1',
    title: 'Modern Home Office',
    image: 'https://picsum.photos/seed/office/800/600',
    products: allProducts.filter(p => ['prod-4', 'prod-12', 'prod-15'].includes(p.id))
  },
  {
    id: 'look-2',
    title: 'Cozy Living Room',
    image: 'https://picsum.photos/seed/living/800/600',
    products: allProducts.filter(p => ['prod-9', 'prod-18', 'prod-20'].includes(p.id))
  },
  {
    id: 'look-3',
    title: 'Gamer Setup',
    image: 'https://picsum.photos/seed/gamer/800/600',
    products: allProducts.filter(p => ['prod-1', 'prod-2', 'prod-13'].includes(p.id))
  }
];


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
  const [isAuctionDrawerOpen, setIsAuctionDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currency, setCurrency] = useState('USD');
  const [rewardPoints, setRewardPoints] = useState(1250);
  
  const navigate = useNavigate();
  const location = useLocation();

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
    setWishlist(prev => 
      prev.find(p => p.id === product.id) 
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
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
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => 
        quantity === 0
            ? prev.filter(item => item.id !== productId)
            : prev.map(item => item.id === productId ? { ...item, quantity } : item)
    );
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    if (userData.isSeller) {
      navigate('/seller-dashboard');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    if (!user) {
      handleLogin({ name: 'Demo User', isSeller: false, email: 'demo@example.com' });
    }
  }, []);

  const recommendations = useMemo(() => getRecommendedProducts({
    allProducts,
    recentlyViewed,
    cart,
    wishlist,
    count: 12
  }), [recentlyViewed, cart, wishlist]);
  
  const appContext: AppContext = {
      user, cart, wishlist, currency, rewardPoints,
      addToCart, updateCartQuantity, toggleWishlist, setQuickViewProduct, viewProduct
  };

  return (
    <div className="min-h-screen bg-gray-50">
       <AuctionPulse onOpenAuctions={() => setIsAuctionDrawerOpen(true)} />
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
          <FlashDeals onViewProduct={viewProduct} currency={currency} onAddToCart={addToCart} />
          
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
              
              <RecommendedForYou recommendations={recommendations} context={appContext} />
              
              <ShopTheLook looks={looksData} context={appContext} />

              {recentlyViewed.length > 0 && (
                <RecentlyViewed 
                  products={recentlyViewed}
                  onViewProduct={viewProduct}
                  currency={currency}
                />
              )}
            </main>
          </div>
        </>
      )}

      <Outlet context={appContext} />

      {comparisonList.length > 0 && (
        <ComparisonBar 
          products={comparisonList}
          onRemove={removeFromComparison}
          onClear={() => setComparisonList([])}
          currency={currency}
        />
      )}

      <LiveChat user={user} />
      
      <RewardsProgram points={rewardPoints} />

      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          isInWishlist={wishlist.some(p => p.id === quickViewProduct.id)}
          onViewFull={() => {
            if(quickViewProduct) viewProduct(quickViewProduct);
            setQuickViewProduct(null);
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
        currency={currency}
      />

      <LiveAuctionsDrawer isOpen={isAuctionDrawerOpen} onClose={() => setIsAuctionDrawerOpen(false)} />

      <Toaster position="bottom-right" richColors />
    </div>
  );
}
