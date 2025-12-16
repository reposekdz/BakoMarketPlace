import { useMemo } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Star, LayoutGrid, List, ChevronsUpDown, Search, Building, Mail, Link as LinkIcon, Phone, MapPin } from 'lucide-react';
import { Market, Product, AppContext } from '../App'; // Assuming types are exported from App
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ProductCard } from '../components/ProductGrid'; // Reuse ProductCard

// --- MOCK DATA ---
// In a real app, this would be fetched based on the market ID from the URL
const allProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
  id: `prod-${i + 1}`,
  name: `Product ${i + 1}`,
  price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
  image: `https://picsum.photos/seed/${i + 1}/400/400`,
  category: ['Electronics', 'Fashion', 'Home'][i % 3],
  rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
  reviews: Math.floor(Math.random() * 150),
  marketId: `market-${(i % 6) + 1}`,
  description: 'A great product to fulfill your needs.',
  discount: Math.random() > 0.7 ? 15 : 0,
  stock: Math.floor(Math.random() * 100),
}));

const allMarkets: Market[] = Array.from({ length: 6 }, (_, i) => ({
  id: `market-${i + 1}`,
  name: ['Sustainable Goods', 'Handmade Haven', 'Gadget Galaxy', 'Vintage Vogue', 'FitLife Essentials', 'Pixel & Press'][i],
  description: 'A wonderful market with amazing products.',
  logo: `https://picsum.photos/seed/logo${i}/200`,
  banner: `https://picsum.photos/seed/banner${i}/1200/400`,
  category: ['Home & Garden', 'Handmade', 'Electronics', 'Fashion', 'Sports', 'Art'][i],
  tags: [['eco'], ['crafts'], ['tech'], ['retro'], ['fitness'], ['digital']][i],
  contactEmail: `contact@market${i+1}.com`,
  isFeatured: i % 2 === 0,
  productCount: allProducts.filter(p => p.marketId === `market-${i + 1}`).length,
  rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
}));


export default function MarketPage() {
  const { marketId } = useParams<{ marketId: string }>();
  const context = useOutletContext<AppContext>();

  // In a real app, you'd fetch this data. Here we're filtering mock data.
  const market = useMemo(() => allMarkets.find(m => m.id === marketId), [marketId]);
  const products = useMemo(() => allProducts.filter(p => p.marketId === marketId), [marketId]);

  if (!market) {
    return <div className="text-center py-20">Market not found.</div>;
  }

  return (
    <div className="bg-background">
      {/* Market Header */}
      <header className="relative h-64 md:h-80 bg-muted">
        <img src={market.banner as string} alt={`${market.name} banner`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 max-w-7xl mx-auto px-8 flex items-end pb-8">
            <div className="flex items-center gap-6">
                <Avatar className="w-28 h-28 border-4 border-background shadow-lg">
                    <AvatarImage src={market.logo as string} alt={`${market.name} logo`} />
                    <AvatarFallback><Building size={40}/></AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-4xl font-bold text-white shadow-text">{market.name}</h1>
                    <p className="text-lg text-white/90 mt-1 shadow-text">{market.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-white">
                        <div className="flex items-center gap-1.5"><Star size={16} className="text-yellow-400"/><span>{market.rating}</span></div>
                        <div className="flex items-center gap-1.5"><LayoutGrid size={16}/><span>{products.length} Products</span></div>
                        <div className="flex items-center gap-1.5"><Tag size={16}/><span>{market.category}</span></div>
                    </div>
                </div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12 flex gap-12 items-start">
        {/* Left Sidebar - Market Info */}
        <aside className="w-1/4 sticky top-24 hidden lg:block">
            <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">About {market.name}</h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3"><Mail size={16} className="text-primary"/><a href={`mailto:${market.contactEmail}`} className="hover:underline">{market.contactEmail}</a></div>
                    {market.website && <div className="flex items-center gap-3"><LinkIcon size={16} className="text-primary"/><a href={market.website} target="_blank" rel="noreferrer" className="hover:underline">Visit Website</a></div>}
                    <div className="flex items-center gap-3"><Phone size={16} className="text-primary"/><span>(555) 123-4567</span></div>
                    <div className="flex items-center gap-3"><MapPin size={16} className="text-primary"/><span>123 Market St, Online</span></div>
                </div>
                <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                        {market.tags?.map(tag => <span key={tag} className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">{tag}</span>)}
                    </div>
                </div>
                <Button className="w-full mt-6">Contact Seller</Button>
            </div>
        </aside>

        {/* Right Content - Products */}
        <main className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Products from {market.name}</h2>
                {/* Add search/filter for products within the market */}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                    <ProductCard 
                        key={product.id}
                        product={product}
                        onAddToCart={() => context.addToCart(product, 1)}
                        onToggleWishlist={() => context.toggleWishlist(product)}
                        onQuickView={() => context.setQuickViewProduct(product)}
                        isInWishlist={context.wishlist.some(p => p.id === product.id)}
                        currency={context.currency}
                    />
                ))}
            </div>
        </main>
      </div>
    </div>
  );
}
