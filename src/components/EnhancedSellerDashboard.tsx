import { useState, useRef } from 'react';
import { 
  Package, Users, TrendingUp, DollarSign, Plus, Edit, Trash2, Eye, Upload, Image as ImageIcon, 
  Video, Save, X, ShoppingBag, MessageSquare, BarChart3, Settings, Bell, Calendar, Download, 
  Filter, Search, Store, Palette, Globe, Tag, Star, Award, Zap, Clock, MapPin, Phone, Mail,
  Share2, Copy, ExternalLink, Heart, ShoppingCart, AlertCircle, CheckCircle, XCircle, Layers,
  Grid, List, ChevronDown, ChevronUp, RefreshCw, ArrowUpRight, ArrowDownRight, Activity,
  PieChart, TrendingDown, Target, Shield, BookOpen, CreditCard, Truck, Archive, FolderOpen,
  FileText, Percent, Gift, Sparkles
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';

interface EnhancedSellerDashboardProps {
  user: any;
  onNavigate: (view: string) => void;
}

interface UploadedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  videos?: string[];
  category: string;
  subcategory?: string;
  description: string;
  specifications?: { [key: string]: string };
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: string;
  dimensions?: string;
  warranty?: string;
  deliveryOptions: {
    delivery: boolean;
    pickup: boolean;
    expressDelivery?: boolean;
    internationalShipping?: boolean;
  };
  status: 'active' | 'draft' | 'out-of-stock' | 'archived';
  views: number;
  sales: number;
  rating: number;
  reviews: number;
  featured: boolean;
  discount?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

const PRODUCT_CATEGORIES = [
  {
    id: 'electronics',
    name: 'Electronics & Gadgets',
    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Wearables', 'Gaming', 'Accessories']
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Kids\' Clothing', 'Shoes', 'Bags', 'Accessories', 'Jewelry', 'Watches']
  },
  {
    id: 'home',
    name: 'Home & Garden',
    subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding', 'Bath', 'Garden', 'Tools', 'Storage']
  },
  {
    id: 'beauty',
    name: 'Beauty & Personal Care',
    subcategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrances', 'Men\'s Grooming', 'Bath & Body', 'Tools', 'Supplements']
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    subcategories: ['Fitness', 'Cycling', 'Camping', 'Water Sports', 'Team Sports', 'Winter Sports', 'Athletic Wear', 'Equipment']
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    subcategories: ['Action Figures', 'Dolls', 'Board Games', 'Puzzles', 'Educational', 'Outdoor Toys', 'Video Games', 'Arts & Crafts']
  },
  {
    id: 'books',
    name: 'Books & Media',
    subcategories: ['Fiction', 'Non-Fiction', 'Comics', 'Magazines', 'Music', 'Movies', 'Educational', 'E-Books']
  },
  {
    id: 'automotive',
    name: 'Automotive',
    subcategories: ['Parts', 'Accessories', 'Tools', 'Car Care', 'Electronics', 'Tires', 'Oils & Fluids', 'Interior']
  },
  {
    id: 'food',
    name: 'Food & Beverages',
    subcategories: ['Snacks', 'Beverages', 'Organic', 'Gourmet', 'Health Foods', 'Spices', 'Baking', 'Specialty']
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    subcategories: ['Vitamins', 'Supplements', 'Medical Supplies', 'Fitness Equipment', 'Personal Care', 'Sexual Wellness', 'Alternative Medicine', 'First Aid']
  },
  {
    id: 'pets',
    name: 'Pet Supplies',
    subcategories: ['Dog Supplies', 'Cat Supplies', 'Bird Supplies', 'Fish & Aquarium', 'Small Animals', 'Pet Food', 'Toys', 'Grooming']
  },
  {
    id: 'office',
    name: 'Office Supplies',
    subcategories: ['Writing', 'Paper', 'Organization', 'Electronics', 'Furniture', 'Printing', 'Shipping', 'Cleaning']
  },
  {
    id: 'jewelry',
    name: 'Jewelry & Accessories',
    subcategories: ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Watches', 'Fine Jewelry', 'Fashion Jewelry', 'Custom']
  },
  {
    id: 'arts',
    name: 'Arts & Crafts',
    subcategories: ['Painting', 'Drawing', 'Sewing', 'Knitting', 'Scrapbooking', 'Beading', 'DIY Kits', 'Supplies']
  },
  {
    id: 'baby',
    name: 'Baby & Kids',
    subcategories: ['Diapers', 'Feeding', 'Clothing', 'Furniture', 'Toys', 'Safety', 'Health', 'Gear']
  },
  {
    id: 'services',
    name: 'Services',
    subcategories: ['Consulting', 'Design', 'Development', 'Marketing', 'Writing', 'Tutoring', 'Maintenance', 'Photography']
  },
  {
    id: 'handmade',
    name: 'Handmade & Crafts',
    subcategories: ['Art', 'Jewelry', 'Home Decor', 'Clothing', 'Accessories', 'Gifts', 'Toys', 'Furniture']
  },
  {
    id: 'music',
    name: 'Musical Instruments',
    subcategories: ['Guitars', 'Keyboards', 'Drums', 'Wind Instruments', 'String Instruments', 'DJ Equipment', 'Recording', 'Accessories']
  },
  {
    id: 'industrial',
    name: 'Industrial & Scientific',
    subcategories: ['Lab Equipment', 'Safety Supplies', 'Industrial Tools', 'Janitorial', 'Material Handling', 'Packaging', 'Testing', 'Professional']
  },
  {
    id: 'other',
    name: 'Other',
    subcategories: ['Collectibles', 'Antiques', 'Vintage', 'Memorabilia', 'Mystery Boxes', 'Subscription Boxes', 'Gift Cards', 'Miscellaneous']
  }
];

export function EnhancedSellerDashboard({ user, onNavigate }: EnhancedSellerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'shop' | 'orders' | 'customers' | 'analytics' | 'messages' | 'settings'>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState<UploadedProduct[]>([
    {
      id: '1',
      name: 'Sample Product',
      price: 99.99,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'],
      category: 'electronics',
      subcategory: 'Smartphones',
      description: 'Amazing product with great features',
      deliveryOptions: { delivery: true, pickup: true },
      status: 'active',
      views: 1234,
      sales: 45,
      rating: 4.5,
      reviews: 23,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);
  
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [productSpecs, setProductSpecs] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);
  const [productTags, setProductTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState('recent');
  
  // Shop customization state
  const [shopName, setShopName] = useState(user?.shop?.name || 'My Shop');
  const [shopDescription, setShopDescription] = useState(user?.shop?.description || '');
  const [shopLogo, setShopLogo] = useState(user?.shop?.logo || '');
  const [shopBanner, setShopBanner] = useState(user?.shop?.banner || '');
  const [shopThemeColor, setShopThemeColor] = useState('#9333ea');
  const [shopUrl, setShopUrl] = useState(`bako.com/shop/${user?.id || 'yourshop'}`);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    stock: '',
    category: '',
    subcategory: '',
    description: '',
    brand: '',
    sku: '',
    weight: '',
    dimensions: '',
    warranty: '',
    delivery: true,
    pickup: true,
    expressDelivery: false,
    internationalShipping: false,
    shippingCost: '',
    estimatedDelivery: '',
    featured: false,
    discount: '',
    seoTitle: '',
    seoDescription: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      Array.from(files).forEach(file => {
        if (file.size > maxSize) {
          toast.error(`${file.name} is too large. Max size is 10MB`);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImages(prev => [...prev, reader.result as string]);
          toast.success(`Image "${file.name}" uploaded!`);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const maxSize = 50 * 1024 * 1024; // 50MB
      Array.from(files).forEach(file => {
        if (file.size > maxSize) {
          toast.error(`${file.name} is too large. Max size is 50MB`);
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedVideos(prev => [...prev, reader.result as string]);
          toast.success(`Video "${file.name}" uploaded!`);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopLogo(reader.result as string);
        toast.success('Shop logo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopBanner(reader.result as string);
        toast.success('Shop banner updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpecification = () => {
    setProductSpecs([...productSpecs, { key: '', value: '' }]);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...productSpecs];
    updated[index][field] = value;
    setProductSpecs(updated);
  };

  const removeSpecification = (index: number) => {
    setProductSpecs(productSpecs.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !productTags.includes(newTag.trim())) {
      setProductTags([...productTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setProductTags(productTags.filter(t => t !== tag));
  };

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const specs: { [key: string]: string } = {};
    productSpecs.forEach(spec => {
      if (spec.key && spec.value) {
        specs[spec.key] = spec.value;
      }
    });

    const product: UploadedProduct = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      stock: parseInt(newProduct.stock),
      images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'],
      videos: uploadedVideos,
      category: newProduct.category,
      subcategory: newProduct.subcategory,
      description: newProduct.description,
      specifications: Object.keys(specs).length > 0 ? specs : undefined,
      tags: productTags.length > 0 ? productTags : undefined,
      brand: newProduct.brand,
      sku: newProduct.sku,
      weight: newProduct.weight,
      dimensions: newProduct.dimensions,
      warranty: newProduct.warranty,
      deliveryOptions: {
        delivery: newProduct.delivery,
        pickup: newProduct.pickup,
        expressDelivery: newProduct.expressDelivery,
        internationalShipping: newProduct.internationalShipping
      },
      status: 'active',
      views: 0,
      sales: 0,
      rating: 0,
      reviews: 0,
      featured: newProduct.featured,
      discount: newProduct.discount ? parseFloat(newProduct.discount) : undefined,
      seoTitle: newProduct.seoTitle,
      seoDescription: newProduct.seoDescription,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProducts([...products, product]);
    toast.success('🎉 Product added successfully!');
    resetProductForm();
  };

  const resetProductForm = () => {
    setShowAddProduct(false);
    setUploadedImages([]);
    setUploadedVideos([]);
    setProductSpecs([{ key: '', value: '' }]);
    setProductTags([]);
    setNewProduct({
      name: '',
      price: '',
      originalPrice: '',
      stock: '',
      category: '',
      subcategory: '',
      description: '',
      brand: '',
      sku: '',
      weight: '',
      dimensions: '',
      warranty: '',
      delivery: true,
      pickup: true,
      expressDelivery: false,
      internationalShipping: false,
      shippingCost: '',
      estimatedDelivery: '',
      featured: false,
      discount: '',
      seoTitle: '',
      seoDescription: ''
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted');
  };

  const handleDuplicateProduct = (product: UploadedProduct) => {
    const duplicate = {
      ...product,
      id: Date.now().toString(),
      name: `${product.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts([...products, duplicate]);
    toast.success('Product duplicated!');
  };

  const handleArchiveProduct = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, status: 'archived' as const } : p));
    toast.success('Product archived');
  };

  const copyShopUrl = () => {
    navigator.clipboard.writeText(`https://${shopUrl}`);
    toast.success('Shop URL copied to clipboard!');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'stock':
        return b.stock - a.stock;
      case 'sales':
        return b.sales - a.sales;
      default:
        return 0;
    }
  });

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sales), 0);
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
  const avgRating = products.length > 0 ? products.reduce((sum, p) => sum + p.rating, 0) / products.length : 0;

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `$${totalRevenue.toLocaleString()}`, 
      change: '+12.5%', 
      icon: DollarSign, 
      color: 'emerald',
      trend: 'up'
    },
    { 
      label: 'Total Products', 
      value: products.length.toString(), 
      change: `+${products.filter(p => p.status === 'active').length} active`, 
      icon: Package, 
      color: 'blue',
      trend: 'up'
    },
    { 
      label: 'Total Sales', 
      value: totalSales.toString(), 
      change: '+8.2%', 
      icon: ShoppingCart, 
      color: 'purple',
      trend: 'up'
    },
    { 
      label: 'Average Rating', 
      value: avgRating.toFixed(1), 
      change: '+0.3', 
      icon: Star, 
      color: 'amber',
      trend: 'up'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-6 shadow-lg">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-4">
            {shopLogo ? (
              <img src={shopLogo} alt="Shop logo" className="w-16 h-16 rounded-full border-4 border-white shadow-lg" />
            ) : (
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <Store className="w-8 h-8" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{shopName}</h1>
              <p className="text-white/80 flex items-center gap-2">
                <span>Welcome back, {user?.name || 'Seller'}!</span>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <Award className="w-3 h-3 mr-1" />
                  Premium Seller
                </Badge>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/20 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={() => onNavigate('home')} variant="secondary" className="bg-white text-purple-600 hover:bg-white/90">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Marketplace
            </Button>
            <button className="relative p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                5
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'shop', label: 'Shop Settings', icon: Store },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'messages', label: 'Messages', icon: MessageSquare },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all font-medium ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600 bg-purple-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto p-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
                return (
                  <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 bg-${stat.color}-100 rounded-2xl flex items-center justify-center shadow-sm`}>
                          <Icon className={`w-7 h-7 text-${stat.color}-600`} />
                        </div>
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          <TrendIcon className="w-4 h-4" />
                          {stat.change}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts and Quick Actions */}
            <div className="grid grid-cols-3 gap-6">
              {/* Sales Chart */}
              <Card className="col-span-2 border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Sales Overview</CardTitle>
                      <CardDescription>Last 7 days performance</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Last 7 days
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-72 flex items-end justify-between gap-2">
                    {[65, 45, 78, 52, 88, 73, 95].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden relative">
                          <div
                            className="w-full bg-gradient-to-t from-purple-600 via-purple-500 to-pink-500 rounded-t-lg transition-all duration-300 group-hover:from-purple-700 group-hover:to-pink-600 cursor-pointer"
                            style={{ height: `${height * 3}px` }}
                          >
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-600">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                          </p>
                          <p className="text-sm font-bold text-gray-900">${(height * 45).toFixed(0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Manage your shop</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setShowAddProduct(true)}
                    className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Product
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    View Orders (5 pending)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Messages (12 unread)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-5 h-5 mr-2" />
                    Shop Settings
                  </Button>
                  <Separator />
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <p className="font-semibold text-sm">Pro Tip</p>
                    </div>
                    <p className="text-xs text-gray-600">
                      Add high-quality images to your products to increase sales by up to 40%!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-semibold">Order #{1000 + i}</p>
                            <p className="text-sm text-gray-600">Customer {i}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">${(99.99 * i).toFixed(2)}</p>
                          <Badge className="bg-green-100 text-green-700 border-0">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best selling items this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product, i) => (
                      <div key={product.id} className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white font-bold text-sm">
                          {i + 1}
                        </div>
                        <img src={product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-gray-600">{product.sales} sold</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${(product.price * product.sales).toFixed(0)}</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-sm">{product.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Toolbar */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Search products..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                        <SelectItem value="price-high">Price (High-Low)</SelectItem>
                        <SelectItem value="price-low">Price (Low-High)</SelectItem>
                        <SelectItem value="stock">Stock Level</SelectItem>
                        <SelectItem value="sales">Best Selling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => setShowAddProduct(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid/List */}
            <div className="grid grid-cols-1 gap-4">
              {sortedProducts.length === 0 ? (
                <Card className="border-0 shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Package className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first product</p>
                    <Button onClick={() => setShowAddProduct(true)} className="bg-gradient-to-r from-purple-600 to-pink-500">
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Product
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                sortedProducts.map((product) => (
                  <Card key={product.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-6">
                        {/* Product Image */}
                        <div className="relative">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="w-24 h-24 rounded-xl object-cover"
                          />
                          {product.featured && (
                            <Badge className="absolute -top-2 -right-2 bg-amber-500 border-0">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold truncate mb-1">{product.name}</h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline">{product.category}</Badge>
                                {product.subcategory && (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                    {product.subcategory}
                                  </Badge>
                                )}
                                {product.discount && (
                                  <Badge className="bg-red-100 text-red-700 border-0">
                                    {product.discount}% OFF
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Badge 
                              className={`ml-2 ${
                                product.status === 'active' ? 'bg-green-100 text-green-700' :
                                product.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                                product.status === 'archived' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                              } border-0`}
                            >
                              {product.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                              {product.status === 'out-of-stock' && <AlertCircle className="w-3 h-3 mr-1" />}
                              {product.status === 'archived' && <Archive className="w-3 h-3 mr-1" />}
                              {product.status.replace('-', ' ')}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-6 gap-4 mt-3">
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Price</p>
                              <p className="font-bold text-lg">${product.price}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Stock</p>
                              <p className="font-semibold">{product.stock}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Views</p>
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4 text-gray-400" />
                                <p className="font-semibold">{product.views}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Sales</p>
                              <div className="flex items-center gap-1">
                                <ShoppingCart className="w-4 h-4 text-gray-400" />
                                <p className="font-semibold">{product.sales}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Rating</p>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <p className="font-semibold">{product.rating.toFixed(1)}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Revenue</p>
                              <p className="font-bold text-emerald-600">${(product.price * product.sales).toFixed(0)}</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDuplicateProduct(product)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicate
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleArchiveProduct(product.id)}>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Shop Settings Tab */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Shop Customization</CardTitle>
                <CardDescription>Personalize your shop's appearance and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Shop Banner */}
                <div className="space-y-4">
                  <Label>Shop Banner</Label>
                  <div className="relative w-full h-48 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl overflow-hidden">
                    {shopBanner && (
                      <img src={shopBanner} alt="Shop banner" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                      />
                      <Button onClick={() => bannerInputRef.current?.click()} variant="secondary">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Banner
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Recommended size: 1920x480px</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Shop Logo */}
                  <div className="space-y-4">
                    <Label>Shop Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-32 h-32 rounded-2xl border-4 border-gray-200 overflow-hidden">
                        {shopLogo ? (
                          <img src={shopLogo} alt="Shop logo" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                            <Store className="w-12 h-12 text-purple-600" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button onClick={() => logoInputRef.current?.click()} variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                        </Button>
                        <p className="text-xs text-gray-600">Square image, at least 400x400px</p>
                      </div>
                    </div>
                  </div>

                  {/* Theme Color */}
                  <div className="space-y-4">
                    <Label>Brand Color</Label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={shopThemeColor}
                        onChange={(e) => setShopThemeColor(e.target.value)}
                        className="w-32 h-32 rounded-2xl border-4 border-gray-200 cursor-pointer"
                      />
                      <div className="space-y-3">
                        <Input
                          value={shopThemeColor}
                          onChange={(e) => setShopThemeColor(e.target.value)}
                          placeholder="#000000"
                        />
                        <p className="text-sm text-gray-600">This color will be used throughout your shop</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Shop Details */}
                <div className="space-y-4">
                  <Label htmlFor="shop-name">Shop Name</Label>
                  <Input
                    id="shop-name"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="My Awesome Shop"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="shop-url">Shop URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="shop-url"
                      value={shopUrl}
                      readOnly
                      className="flex-1"
                    />
                    <Button onClick={copyShopUrl} variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="shop-description">Shop Description</Label>
                  <Textarea
                    id="shop-description"
                    value={shopDescription}
                    onChange={(e) => setShopDescription(e.target.value)}
                    placeholder="Tell customers about your shop..."
                    rows={5}
                  />
                  <p className="text-sm text-gray-600">
                    {shopDescription.length}/500 characters
                  </p>
                </div>

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best selling items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product, i) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 text-white font-bold text-sm">
                            {i + 1}
                          </div>
                          <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg" />
                          <span className="text-sm font-medium">{product.name}</span>
                        </div>
                        <span className="text-sm font-bold">{product.sales} sold</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>Performance breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {PRODUCT_CATEGORIES.slice(0, 5).map((cat, i) => (
                      <div key={cat.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{cat.name}</span>
                          <span className="text-sm font-bold">${(2500 - i * 300).toFixed(2)}</span>
                        </div>
                        <Progress value={100 - i * 15} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                  <CardDescription>Where customers find you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { source: 'Direct', visits: '45%', color: 'purple' },
                      { source: 'Search', visits: '30%', color: 'blue' },
                      { source: 'Social Media', visits: '15%', color: 'pink' },
                      { source: 'Referral', visits: '10%', color: 'emerald' }
                    ].map((item) => (
                      <div key={item.source} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                          <span className="text-sm">{item.source}</span>
                        </div>
                        <span className="font-bold">{item.visits}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
            <CardHeader className="sticky top-0 bg-white border-b z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Add New Product</CardTitle>
                  <CardDescription>Fill in the details to list your product</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={resetProductForm}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-6 mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product Name *</Label>
                      <Input
                        id="product-name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        placeholder="e.g. Premium Wireless Headphones"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        placeholder="e.g. Sony, Apple, Nike"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select 
                        value={newProduct.category} 
                        onValueChange={(v) => setNewProduct({ ...newProduct, category: v, subcategory: '' })}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_CATEGORIES.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Select 
                        value={newProduct.subcategory} 
                        onValueChange={(v) => setNewProduct({ ...newProduct, subcategory: v })}
                        disabled={!newProduct.category}
                      >
                        <SelectTrigger id="subcategory">
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_CATEGORIES.find(c => c.id === newProduct.category)?.subcategories.map((sub) => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price * ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="original-price">Original Price ($)</Label>
                      <Input
                        id="original-price"
                        type="number"
                        step="0.01"
                        value={newProduct.originalPrice}
                        onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        value={newProduct.discount}
                        onChange={(e) => setNewProduct({ ...newProduct, discount: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        placeholder="e.g. WH-1000-XM4-BLK"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="Describe your product in detail..."
                      rows={6}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-semibold text-amber-900">Featured Product</p>
                        <p className="text-sm text-amber-700">Highlight this product on your shop page</p>
                      </div>
                    </div>
                    <Switch
                      checked={newProduct.featured}
                      onCheckedChange={(checked) => setNewProduct({ ...newProduct, featured: checked })}
                    />
                  </div>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <Label>Product Images</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => imageInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all flex flex-col items-center justify-center gap-3"
                      >
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                        <div className="text-center">
                          <p className="font-medium text-gray-700">Upload Images</p>
                          <p className="text-sm text-gray-500">PNG, JPG (Max 10MB)</p>
                        </div>
                      </button>
                      
                      {uploadedImages.map((img, i) => (
                        <div key={i} className="relative aspect-square group">
                          <img src={img} alt="" className="w-full h-full object-cover rounded-2xl" />
                          <button
                            onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {i === 0 && (
                            <Badge className="absolute bottom-2 left-2 bg-purple-600 border-0">
                              Primary
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    {uploadedImages.length > 0 && (
                      <Alert>
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription>
                          You've uploaded {uploadedImages.length} image(s). The first image will be the primary product image.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Product Videos (Optional)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => videoInputRef.current?.click()}
                        className="aspect-video border-2 border-dashed border-gray-300 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all flex flex-col items-center justify-center gap-3"
                      >
                        <Video className="w-12 h-12 text-gray-400" />
                        <div className="text-center">
                          <p className="font-medium text-gray-700">Upload Videos</p>
                          <p className="text-sm text-gray-500">MP4, MOV (Max 50MB)</p>
                        </div>
                      </button>
                      
                      {uploadedVideos.map((video, i) => (
                        <div key={i} className="aspect-video relative group bg-gray-100 rounded-2xl flex items-center justify-center">
                          <Video className="w-12 h-12 text-gray-400" />
                          <p className="absolute bottom-4 text-sm text-gray-600">Video {i + 1}</p>
                          <button
                            onClick={() => setUploadedVideos(uploadedVideos.filter((_, idx) => idx !== i))}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Product Specifications</Label>
                      <Button onClick={addSpecification} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Specification
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {productSpecs.map((spec, index) => (
                        <div key={index} className="flex gap-3">
                          <Input
                            placeholder="Specification name (e.g. Color)"
                            value={spec.key}
                            onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Value (e.g. Black)"
                            value={spec.value}
                            onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSpecification(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Product Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button onClick={addTag} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                    {productTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {productTags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="pl-3 pr-1">
                            {tag}
                            <button
                              onClick={() => removeTag(tag)}
                              className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        value={newProduct.weight}
                        onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                        placeholder="e.g. 500g"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dimensions">Dimensions</Label>
                      <Input
                        id="dimensions"
                        value={newProduct.dimensions}
                        onChange={(e) => setNewProduct({ ...newProduct, dimensions: e.target.value })}
                        placeholder="e.g. 20x15x10cm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="warranty">Warranty</Label>
                      <Input
                        id="warranty"
                        value={newProduct.warranty}
                        onChange={(e) => setNewProduct({ ...newProduct, warranty: e.target.value })}
                        placeholder="e.g. 1 Year"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Shipping Tab */}
                <TabsContent value="shipping" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <Label>Delivery Options</Label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'delivery', label: 'Home Delivery', icon: Truck, desc: 'Ship to customer address' },
                        { key: 'pickup', label: 'Local Pickup', icon: Store, desc: 'Customer picks up from store' },
                        { key: 'expressDelivery', label: 'Express Delivery', icon: Zap, desc: 'Next-day delivery' },
                        { key: 'internationalShipping', label: 'International Shipping', icon: Globe, desc: 'Ship worldwide' }
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                          <div
                            key={option.key}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                              (newProduct as any)[option.key]
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setNewProduct({ ...newProduct, [option.key]: !(newProduct as any)[option.key] })}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                (newProduct as any)[option.key] ? 'bg-purple-100' : 'bg-gray-100'
                              }`}>
                                <Icon className={`w-5 h-5 ${
                                  (newProduct as any)[option.key] ? 'text-purple-600' : 'text-gray-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold mb-1">{option.label}</p>
                                <p className="text-sm text-gray-600">{option.desc}</p>
                              </div>
                              <Switch
                                checked={(newProduct as any)[option.key]}
                                onCheckedChange={(checked) => setNewProduct({ ...newProduct, [option.key]: checked })}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping-cost">Shipping Cost ($)</Label>
                      <Input
                        id="shipping-cost"
                        type="number"
                        step="0.01"
                        value={newProduct.shippingCost}
                        onChange={(e) => setNewProduct({ ...newProduct, shippingCost: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estimated-delivery">Estimated Delivery</Label>
                      <Input
                        id="estimated-delivery"
                        value={newProduct.estimatedDelivery}
                        onChange={(e) => setNewProduct({ ...newProduct, estimatedDelivery: e.target.value })}
                        placeholder="e.g. 3-5 business days"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* SEO Tab */}
                <TabsContent value="seo" className="space-y-6 mt-6">
                  <Alert className="bg-blue-50 border-blue-200">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-900">
                      Optimize your product for search engines to increase visibility and sales
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seo-title">SEO Title</Label>
                      <Input
                        id="seo-title"
                        value={newProduct.seoTitle}
                        onChange={(e) => setNewProduct({ ...newProduct, seoTitle: e.target.value })}
                        placeholder="Enter SEO-friendly title..."
                        maxLength={60}
                      />
                      <p className="text-sm text-gray-600">{newProduct.seoTitle.length}/60 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seo-description">SEO Description</Label>
                      <Textarea
                        id="seo-description"
                        value={newProduct.seoDescription}
                        onChange={(e) => setNewProduct({ ...newProduct, seoDescription: e.target.value })}
                        placeholder="Enter SEO-friendly description..."
                        rows={4}
                        maxLength={160}
                      />
                      <p className="text-sm text-gray-600">{newProduct.seoDescription.length}/160 characters</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <div className="sticky bottom-0 bg-white border-t p-6 flex gap-4">
              <Button variant="outline" onClick={resetProductForm} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProduct} 
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Product
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
