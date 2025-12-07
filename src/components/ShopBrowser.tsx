import { useState, useEffect } from 'react';
import { Store, MapPin, Star, Package, Users, Search, Filter, Phone, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage } from './LanguageProvider';

const API_URL = 'http://localhost:5000/api';

interface Shop {
  id: number;
  shop_name: string;
  shop_category: string;
  description: string;
  logo: string;
  banner: string;
  rating: number;
  total_sales: number;
  followers: number;
  verified: boolean;
  province: string;
  district: string;
  product_count: number;
  order_count: number;
}

export function ShopBrowser({ onViewShop }: { onViewShop: (shopId: number) => void }) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    loadShops();
  }, [selectedCategory, selectedProvince]);

  const loadShops = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedProvince !== 'all') params.append('province', selectedProvince);
      if (searchQuery) params.append('search', searchQuery);

      const res = await fetch(`${API_URL}/shops?${params}`);
      const data = await res.json();
      setShops(data);
    } catch (error) {
      console.error('Failed to load shops');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Beauty', 'Food'];
  const provinces = ['Kigali City', 'Eastern Province', 'Northern Province', 'Southern Province', 'Western Province'];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">{t('shops.title') || 'Discover Shops'}</h1>
        <p className="text-lg opacity-90">{t('shops.subtitle') || 'Browse thousands of verified sellers'}</p>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder={t('shops.search') || 'Search shops...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && loadShops()}
              className="pl-10"
            />
          </div>
          <Button onClick={loadShops}>{t('common.search') || 'Search'}</Button>
        </div>

        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('shops.category') || 'Category'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all') || 'All Categories'}</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedProvince} onValueChange={setSelectedProvince}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('shops.location') || 'Location'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all') || 'All Locations'}</SelectItem>
              {provinces.map(prov => (
                <SelectItem key={prov} value={prov}>{prov}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shops.map((shop) => (
            <Card key={shop.id} className="overflow-hidden hover:shadow-2xl transition-all cursor-pointer group">
              <div className="relative h-32 bg-gradient-to-r from-purple-400 to-pink-400">
                {shop.banner && (
                  <img src={shop.banner} alt={shop.shop_name} className="w-full h-full object-cover" />
                )}
                {shop.verified && (
                  <Badge className="absolute top-2 right-2 bg-blue-600">
                    ✓ {t('shops.verified') || 'Verified'}
                  </Badge>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-16 h-16 rounded-full border-4 border-white -mt-8 bg-white overflow-hidden flex-shrink-0">
                    {shop.logo ? (
                      <img src={shop.logo} alt={shop.shop_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                        {shop.shop_name[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{shop.shop_name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{shop.rating.toFixed(1)}</span>
                      <span className="text-gray-400">({shop.order_count})</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{shop.description}</p>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    <span>{shop.product_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{shop.followers}</span>
                  </div>
                  {shop.province && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{shop.district}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => onViewShop(shop.id)} className="flex-1">
                    {t('shops.view') || 'View Shop'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
