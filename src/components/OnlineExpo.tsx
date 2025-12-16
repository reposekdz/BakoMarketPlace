import { useState, useMemo } from 'react';
import { Calendar, ChevronsUpDown, Check, Star, Zap, Trophy, TrendingUp, LayoutGrid, ShoppingCart, Search, Filter, Plus, Building, Eye, X, Tag, List, ArrowUpDown } from 'lucide-react';
import { Product } from '../App';
import { CreateMarket, Market } from './CreateMarket';

// Import UI components from the design system
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';


interface OnlineExpoProps {
  onViewProduct: (product: Product) => void;
  user: any;
}

// --- MOCK DATA ---
const initialMarkets: Market[] = [
  { id: 'market-1', name: 'Sustainable Goods Co.', description: 'A marketplace for eco-friendly and sustainable products.', logo: null, banner: null, category: 'Home & Garden', tags: ['eco-friendly', 'sustainable'], contactEmail: 'contact@sustainablegoods.com', isFeatured: true, productCount: 120, rating: 4.8 },
  { id: 'market-2', name: 'Handmade Haven', description: 'Discover unique, handcrafted items from artisans.', logo: null, banner: null, category: 'Handmade', tags: ['artisanal', 'crafts'], contactEmail: 'hello@handmadehaven.com', isFeatured: false, productCount: 250, rating: 4.9 },
  { id: 'market-3', name: 'Gadget Galaxy', description: 'The latest and greatest in tech and electronic gadgets.', logo: null, banner: null, category: 'Electronics', tags: ['tech', 'gadgets'], contactEmail: 'support@gadgetgalaxy.com', isFeatured: true, productCount: 1800, rating: 4.7 },
  { id: 'market-4', name: 'Vintage Vogue', description: 'Curated vintage fashion from the 70s, 80s, and 90s.', logo: null, banner: null, category: 'Fashion', tags: ['vintage', 'retro'], contactEmail: 'style@vintagevogue.com', isFeatured: false, productCount: 450, rating: 4.8 },
  { id: 'market-5', name: 'FitLife Essentials', description: 'High-quality gear and nutrition for your fitness journey.', logo: null, banner: null, category: 'Sports & Outdoors', tags: ['fitness', 'gym'], contactEmail: 'getfit@fitlife.com', isFeatured: true, productCount: 300, rating: 4.6 },
  { id: 'market-6', name: 'Pixel & Press', description: 'Unique digital art, prints, and media creations.', logo: null, banner: null, category: 'Arts & Crafts', tags: ['digital art', 'prints'], contactEmail: 'art@pixelpress.com', isFeatured: false, productCount: 85, rating: 4.9 },
];
const marketCategories = ["All", "Featured", "Electronics", "Fashion", "Home & Garden", "Sports & Outdoors", "Handmade", "Arts & Crafts"];
const sortOptions = { 'newest': 'Newest', 'rating': 'Highest Rated', 'products_desc': 'Most Products' };


// --- REUSABLE SUB-COMPONENTS ---

const MarketCard = ({ market }: { market: Market }) => (
  <Card className="overflow-hidden group transform hover:-translate-y-1 transition-all duration-300 hover:shadow-purple-200/50">
    <CardHeader className="p-0 h-36 bg-gray-200 relative overflow-hidden">
      {market.banner ? <img src={URL.createObjectURL(market.banner)} alt={`${market.name} banner`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/> : <div className='w-full h-full bg-gradient-to-r from-gray-300 to-gray-400'></div>}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <div className="flex items-end -mt-10 mb-4">
        <div className="w-20 h-20 rounded-full bg-white border-4 border-background shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
          {market.logo ? <img src={URL.createObjectURL(market.logo)} alt={`${market.name} logo`} className="w-full h-full object-cover rounded-full"/> : <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full"><Building size={32} className="text-gray-500"/></div>}
        </div>
        <div className='flex-grow flex justify-end items-center text-sm gap-4 text-muted-foreground'>
          <div className='flex items-center gap-1.5' title='Rating'><Star size={16} className="text-yellow-500"/><span className='font-semibold text-foreground'>{market.rating || 'N/A'}</span></div>
          <div className='flex items-center gap-1.5' title='Products'><LayoutGrid size={16}/><span className='font-semibold text-foreground'>{market.productCount || 0}</span></div>
        </div>
      </div>
      <h3 className="text-xl font-bold text-card-foreground truncate group-hover:text-primary transition-colors">{market.name}</h3>
      <p className="text-sm text-muted-foreground h-10 mt-1.5 overflow-hidden">{market.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">{market.tags?.slice(0,3).map(tag => <span key={tag} className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">{tag}</span>)}</div>
      <Button className="w-full mt-4" asChild><a href="#"><Eye size={16}/>View Market</a></Button>
    </CardContent>
  </Card>
);

const MarketListItem = ({ market }: { market: Market }) => (
  <Card className="flex items-center group transform hover:bg-muted/50 transition-colors duration-200">
    <div className="w-20 h-20 flex-shrink-0 m-4 rounded-lg bg-gray-200">
       {market.logo ? <img src={URL.createObjectURL(market.logo)} alt={`${market.name} logo`} className="w-full h-full object-cover rounded-lg"/> : <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg"><Building size={32} className="text-gray-500"/></div>}
    </div>
    <div className="flex-grow py-4 pr-4">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors">{market.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{market.description}</p>
            </div>
            <Button variant="outline" asChild><a href="#"><Eye size={14} className="mr-2"/>View</a></Button>
        </div>
        <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className='flex items-center gap-1.5' title='Category'><Tag size={14}/><span>{market.category}</span></div>
                <div className='flex items-center gap-1.5' title='Rating'><Star size={14} className="text-yellow-500"/><span className='font-semibold text-foreground'>{market.rating}</span></div>
                <div className='flex items-center gap-1.5' title='Products'><LayoutGrid size={14}/><span>{market.productCount} products</span></div>
            </div>
            <div className="flex flex-wrap gap-2">{market.tags?.slice(0,2).map(tag => <span key={tag} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">{tag}</span>)}</div>
        </div>
    </div>
  </Card>
);

// --- MAIN COMPONENT ---

export function OnlineExpo({ onViewProduct, user }: OnlineExpoProps) {
  const [showCreateMarket, setShowCreateMarket] = useState(false);
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState<keyof typeof sortOptions>('newest');
  const [layout, setLayout] = useState('grid');

  const handleCreateMarket = (market: Market) => setMarkets(prev => [market, ...prev]);

  const filteredAndSortedMarkets = useMemo(() => {
    let filtered = markets;
    if (activeCategory === 'Featured') filtered = markets.filter(m => m.isFeatured);
    else if (activeCategory !== 'All') filtered = markets.filter(market => market.category === activeCategory);

    let searched = filtered.filter(market => 
        market.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        market.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        market.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
      
    switch(activeSort) {
        case 'rating': return searched.sort((a,b) => (b.rating || 0) - (a.rating || 0));
        case 'products_desc': return searched.sort((a,b) => (b.productCount || 0) - (a.productCount || 0));
        case 'newest':
        default: return searched.sort((a,b) => b.id.localeCompare(a.id));
    }
  }, [markets, searchQuery, activeCategory, activeSort]);
  
  return (
    <div className="min-h-screen bg-background">
      {showCreateMarket && <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"><CreateMarket onClose={() => setShowCreateMarket(false)} onCreateMarket={handleCreateMarket} /></div>}
      
      <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 py-16 text-white">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-5xl font-extrabold mb-4">Create & Discover Online Markets</h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl">Your gateway to a universe of niche marketplaces. Launch your own or explore unique products.</p>
          <Button size="lg" variant="secondary" onClick={() => setShowCreateMarket(true)}><Plus className="w-5 h-5 mr-2" /> Create Your Market</Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <div className="flex justify-between items-center mb-6 gap-4">
            <TabsList>
              {marketCategories.map(cat => <TabsTrigger key={cat} value={cat}>{cat === 'Featured' ? <Star className='w-4 h-4 mr-2 text-yellow-500'/> : null}{cat}</TabsTrigger>)}
            </TabsList>
            <div className="relative flex-grow max-w-xs">
                <Search className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search markets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-input bg-background rounded-md h-10" />
            </div>
          </div>

          <div className="flex justify-between items-center mb-6 border-y py-3">
              <p className='text-sm text-muted-foreground'>Showing <span className='font-bold text-foreground'>{filteredAndSortedMarkets.length}</span> markets</p>
              <div className="flex items-center gap-4">
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-40 justify-between">
                              <span>Sort by: {sortOptions[activeSort]}</span> <ChevronsUpDown size={16} />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-40">
                          {Object.entries(sortOptions).map(([key, value]) => (
                              <DropdownMenuItem key={key} onSelect={() => setActiveSort(key as any)}>{value}</DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                  </DropdownMenu>
                  <ToggleGroup type="single" value={layout} onValueChange={(v) => v && setLayout(v)}>
                      <ToggleGroupItem value="grid" aria-label="Grid view"><LayoutGrid/></ToggleGroupItem>
                      <ToggleGroupItem value="list" aria-label="List view"><List/></ToggleGroupItem>
                  </ToggleGroup>
              </div>
          </div>
          
          <TabsContent value={activeCategory} className="mt-8">
              {filteredAndSortedMarkets.length > 0 ? (
                  layout === 'grid' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {filteredAndSortedMarkets.map(market => <MarketCard key={market.id} market={market} />)}
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {filteredAndSortedMarkets.map(market => <MarketListItem key={market.id} market={market} />)}
                      </div>
                  )
              ) : (
                <div className='text-center py-20 bg-muted/50 rounded-xl'>
                    <h3 className='text-2xl font-semibold text-foreground'>No Markets Found</h3>
                    <p className='text-muted-foreground mt-3 max-w-md mx-auto'>Try adjusting your search or filters. Or, be the first one to create a market in this category!</p>
                    <Button onClick={() => setShowCreateMarket(true)} className="mt-8"><Plus size={18} className="mr-2"/> Create a New Market</Button>
                </div>
              )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
