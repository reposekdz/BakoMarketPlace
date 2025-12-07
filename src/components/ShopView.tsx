import { useState, useEffect } from 'react';
import { Store, MapPin, Star, Phone, Mail, MessageSquare, Video, Users, Package, ShoppingCart, Heart, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { useLanguage } from './LanguageProvider';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

interface Shop {
  id: number;
  shop_name: string;
  description: string;
  logo: string;
  banner: string;
  rating: number;
  followers: number;
  verified: boolean;
  province: string;
  district: string;
  sector: string;
  phone: string;
  email: string;
  product_count: number;
  order_count: number;
  user_id: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  rating: number;
}

export function ShopView({ shopId, onBack, onAddToCart, user }: any) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [showChat, setShowChat] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState('');
  const { t, language } = useLanguage();

  useEffect(() => {
    loadShop();
    loadProducts();
  }, [shopId]);

  const loadShop = async () => {
    try {
      const res = await fetch(`${API_URL}/shops/${shopId}`);
      const data = await res.json();
      setShop(data);
    } catch (error) {
      toast.error('Failed to load shop');
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/shops/${shopId}/products?sort=${sortBy}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  useEffect(() => {
    if (shop) loadProducts();
  }, [sortBy]);

  const startConversation = async (product?: Product) => {
    if (!user) {
      toast.error(language === 'rw' ? 'Injira mbere' : 'Please login first');
      return;
    }

    setSelectedProduct(product || null);
    setShowChat(true);
  };

  const sendMessage = async () => {
    if (!message.trim() || !shop) return;

    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          seller_id: shop.user_id,
          product_id: selectedProduct?.id,
          message
        })
      });
      setMessage('');
      toast.success(language === 'rw' ? 'Ubutumwa bwoherejwe' : 'Message sent');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (!shop) return <div className="text-center py-12">Loading...</div>;

  const translations = {
    en: {
      products: 'Products',
      about: 'About',
      reviews: 'Reviews',
      contact: 'Contact',
      follow: 'Follow',
      chat: 'Chat',
      call: 'Call',
      video: 'Video Call',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      sortBy: 'Sort by',
      newest: 'Newest',
      popular: 'Popular',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      sendMessage: 'Send Message',
      typeMessage: 'Type a message...'
    },
    rw: {
      products: 'Ibicuruzwa',
      about: 'Ibyerekeye',
      reviews: 'Ibitekerezo',
      contact: 'Twandikire',
      follow: 'Kurikira',
      chat: 'Ganira',
      call: 'Hamagara',
      video: 'Video',
      addToCart: 'Shyira mu gitebo',
      buyNow: 'Gura nonaha',
      sortBy: 'Hitamo',
      newest: 'Bishya',
      popular: 'Bikunzwe',
      priceLow: 'Igiciro: Gito kugeza kinini',
      priceHigh: 'Igiciro: Kinini kugeza gito',
      inStock: 'Birahari',
      outOfStock: 'Byarangiye',
      sendMessage: 'Ohereza ubutumwa',
      typeMessage: 'Andika ubutumwa...'
    }
  };

  const tr = translations[language as 'en' | 'rw'] || translations.en;

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="outline">← {language === 'rw' ? 'Subira' : 'Back'}</Button>

      <div className="relative h-64 rounded-xl overflow-hidden">
        {shop.banner ? (
          <img src={shop.banner} alt={shop.shop_name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden">
              {shop.logo ? (
                <img src={shop.logo} alt={shop.shop_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl">
                  {shop.shop_name[0]}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold">{shop.shop_name}</h1>
                {shop.verified && <Badge className="bg-blue-600">✓ {tr.follow}</Badge>}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{shop.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{shop.followers} {language === 'rw' ? 'Abakurikira' : 'Followers'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{shop.product_count} {tr.products}</span>
                </div>
                {shop.province && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{shop.district}, {shop.province}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => startConversation()}>
                <MessageSquare className="w-4 h-4 mr-2" />
                {tr.chat}
              </Button>
              <Button variant="secondary">
                <Phone className="w-4 h-4 mr-2" />
                {tr.call}
              </Button>
              <Button variant="secondary">
                <Video className="w-4 h-4 mr-2" />
                {tr.video}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="products">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products">{tr.products}</TabsTrigger>
          <TabsTrigger value="about">{tr.about}</TabsTrigger>
          <TabsTrigger value="reviews">{tr.reviews}</TabsTrigger>
          <TabsTrigger value="contact">{tr.contact}</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{shop.product_count} {tr.products}</h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{tr.newest}</SelectItem>
                <SelectItem value="popular">{tr.popular}</SelectItem>
                <SelectItem value="price_asc">{tr.priceLow}</SelectItem>
                <SelectItem value="price_desc">{tr.priceHigh}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all group relative">
                <div className="relative">
                  <img src={product.image || '/placeholder.png'} alt={product.name} className="w-full h-48 object-cover" />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => startConversation(product)}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Badge className={`absolute top-2 left-2 ${product.stock > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
                    {product.stock > 0 ? tr.inStock : tr.outOfStock}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{product.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-purple-600">${product.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => onAddToCart(product)}>
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      {tr.addToCart}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="about">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">{tr.about} {shop.shop_name}</h3>
            <p className="text-gray-600">{shop.description}</p>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">{tr.reviews}</h3>
            <p className="text-gray-600">{language === 'rw' ? 'Nta bitekerezo' : 'No reviews yet'}</p>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">{tr.contact}</h3>
            <div className="space-y-3">
              {shop.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{shop.phone}</span>
                </div>
              )}
              {shop.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{shop.email}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{shop.sector}, {shop.district}, {shop.province}</span>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {showChat && (
        <div className="fixed right-6 bottom-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          <div className="p-4 border-b flex items-center justify-between bg-purple-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                {shop.logo ? (
                  <img src={shop.logo} alt={shop.shop_name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <Store className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{shop.shop_name}</h3>
                {selectedProduct && (
                  <p className="text-xs opacity-90">{selectedProduct.name}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                <Phone className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                <Video className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => setShowChat(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="text-center text-sm text-gray-500 mb-4">
              {language === 'rw' ? 'Tangira ikiganiro' : 'Start conversation'}
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder={tr.typeMessage}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage}>{tr.sendMessage}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
