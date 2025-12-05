import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ProductGrid } from './components/ProductGrid';
import { ComparisonBar } from './components/ComparisonBar';
import { LiveChat } from './components/LiveChat';
import { QuickViewModal } from './components/QuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { Toaster } from 'sonner@2.0.3';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  seller: {
    name: string;
    verified: boolean;
    rating: number;
  };
  stock: number;
  features: string[];
  discount?: number;
  badges?: string[];
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<Array<Product & { quantity: number }>>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
      />
      
      <div className="flex max-w-[1920px] mx-auto">
        <Sidebar 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
        />
        
        <main className="flex-1 p-6">
          <ProductGrid 
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            priceRange={priceRange}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onQuickView={setQuickViewProduct}
            onAddToComparison={addToComparison}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            wishlist={wishlist}
          />
        </main>
      </div>

      {comparisonList.length > 0 && (
        <ComparisonBar 
          products={comparisonList}
          onRemove={removeFromComparison}
          onClear={() => setComparisonList([])}
        />
      )}

      <LiveChat />

      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          isInWishlist={wishlist.some(p => p.id === quickViewProduct.id)}
        />
      )}

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateCartQuantity}
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
