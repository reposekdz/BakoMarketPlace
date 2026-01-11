import { useState, useRef } from 'react';
import { 
  Store, 
  Plus, 
  Upload, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  Settings,
  BarChart3,
  MessageSquare,
  Star,
  Download,
  FileText,
  Image as ImageIcon,
  Video,
  X,
  Save,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Brain,
  Zap,
  Target,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';

interface UltraAdvancedSellerDashboardProps {
  user: any;
  onNavigate: (view: string) => void;
}

interface ShopData {
  name: string;
  description: string;
  logo: string | null;
  banner: string | null;
  category: string;
  businessType: string;
  taxId: string;
  verified: boolean;
}

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  images: string[];
  videos: string[];
  sku: string;
  barcode: string;
  weight: number;
  dimensions: { length: number; width: number; height: number };
  variants: Array<{ name: string; options: string[]; prices?: Record<string, number> }>;
  status: 'active' | 'draft' | 'out_of_stock';
  createdAt: string;
}

interface Order {
  id: string;
  customer: string;
  products: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  shippingAddress: string;
  trackingNumber?: string;
}

export function UltraAdvancedSellerDashboard({ user, onNavigate }: UltraAdvancedSellerDashboardProps) {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateShop, setShowCreateShop] = useState(!user?.shop);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [bulkUploadMode, setBulkUploadMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  // Shop Management State
  const [shopData, setShopData] = useState<ShopData>({
    name: user?.shop?.name || '',
    description: user?.shop?.description || '',
    logo: user?.shop?.logo || null,
    banner: user?.shop?.banner || null,
    category: user?.shop?.category || '',
    businessType: user?.shop?.businessType || 'individual',
    taxId: user?.shop?.taxId || '',
    verified: user?.shop?.verified || false,
  });

  // Product Management State
  const [products, setProducts] = useState<ProductData[]>([
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 299.99,
      stock: 150,
      category: 'Electronics',
      brand: 'TechBrand',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'],
      videos: [],
      sku: 'WH-001',
      barcode: '1234567890123',
      weight: 0.5,
      dimensions: { length: 20, width: 15, height: 10 },
      variants: [
        { name: 'Color', options: ['Black', 'Silver', 'Blue'] },
        { name: 'Size', options: ['Standard', 'Large'] }
      ],
      status: 'active',
      createdAt: '2026-01-01'
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      description: 'Advanced smartwatch with health tracking features',
      price: 449.99,
      stock: 75,
      category: 'Electronics',
      brand: 'TechBrand',
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300'],
      videos: [],
      sku: 'SW-001',
      barcode: '1234567890124',
      weight: 0.2,
      dimensions: { length: 5, width: 5, height: 2 },
      variants: [
        { name: 'Color', options: ['Black', 'Silver', 'Gold'] },
        { name: 'Size', options: ['S/M', 'L/XL'] }
      ],
      status: 'active',
      createdAt: '2026-01-05'
    },
  ]);

  const [newProduct, setNewProduct] = useState<Partial<ProductData>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    brand: '',
    images: [],
    videos: [],
    variants: [],
  });

  // Order Management State
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customer: 'John Doe',
      products: [{ name: 'Premium Wireless Headphones', quantity: 2, price: 299.99 }],
      total: 599.98,
      status: 'processing',
      date: '2026-01-10',
      paymentStatus: 'paid',
      shippingAddress: '123 Main St, New York, NY 10001',
      trackingNumber: 'TRACK123456'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      products: [
        { name: 'Smart Watch Pro', quantity: 1, price: 449.99 },
        { name: 'Premium Wireless Headphones', quantity: 1, price: 299.99 }
      ],
      total: 749.98,
      status: 'shipped',
      date: '2026-01-09',
      paymentStatus: 'paid',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
      trackingNumber: 'TRACK789012'
    },
    {
      id: 'ORD-003',
      customer: 'Bob Johnson',
      products: [{ name: 'Smart Watch Pro', quantity: 1, price: 449.99 }],
      total: 449.99,
      status: 'pending',
      date: '2026-01-11',
      paymentStatus: 'pending',
      shippingAddress: '789 Pine Rd, Chicago, IL 60601'
    },
  ]);

  // Analytics Data
  const analytics = {
    totalRevenue: 125430.50,
    revenueGrowth: 23.5,
    totalOrders: 342,
    ordersGrowth: 15.2,
    totalProducts: products.length,
    productsGrowth: 8.1,
    avgRating: 4.8,
    ratingGrowth: 2.3,
    conversionRate: 3.2,
    returningCustomers: 67,
    topProducts: products.slice(0, 5),
    salesByCategory: [
      { category: 'Electronics', sales: 45230, percentage: 36 },
      { category: 'Fashion', sales: 32100, percentage: 26 },
      { category: 'Home & Living', sales: 28400, percentage: 23 },
      { category: 'Sports', sales: 19700, percentage: 15 },
    ],
    monthlyRevenue: [
      { month: 'Jul', revenue: 18500 },
      { month: 'Aug', revenue: 21200 },
      { month: 'Sep', revenue: 19800 },
      { month: 'Oct', revenue: 24300 },
      { month: 'Nov', revenue: 22100 },
      { month: 'Dec', revenue: 19530 },
    ],
  };

  // AI Predictions
  const predictions = {
    nextMonthRevenue: 142500,
    confidence: 87,
    trendingProducts: [
      { name: 'Premium Wireless Headphones', expectedGrowth: 32 },
      { name: 'Smart Watch Pro', expectedGrowth: 28 },
    ],
    recommendedActions: [
      'Increase stock for Premium Wireless Headphones by 40%',
      'Run promotional campaign for Smart Watch Pro',
      'Consider expanding product line in Electronics category',
    ],
    demandForecast: [
      { product: 'Premium Wireless Headphones', forecast: 245 },
      { product: 'Smart Watch Pro', forecast: 187 },
    ],
  };

  // Shop Creation Handler
  const handleCreateShop = () => {
    if (!shopData.name || !shopData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Shop created successfully!');
    setShowCreateShop(false);
  };

  // Product Management Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setNewProduct({
        ...newProduct,
        images: [...(newProduct.images || []), ...newImages]
      });
      toast.success(`${files.length} image(s) uploaded successfully`);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newVideos = Array.from(files).map(file => URL.createObjectURL(file));
      setNewProduct({
        ...newProduct,
        videos: [...(newProduct.videos || []), ...newVideos]
      });
      toast.success(`${files.length} video(s) uploaded successfully`);
    }
  };

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      // Simulate CSV parsing
      toast.success('Bulk upload started! Processing products...');
      setTimeout(() => {
        toast.success('Successfully uploaded 15 products');
        setBulkUploadMode(false);
      }, 2000);
    } else {
      toast.error('Please upload a valid CSV file');
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error('Please fill in required fields');
      return;
    }
    
    const product: ProductData = {
      id: `PROD-${Date.now()}`,
      name: newProduct.name!,
      description: newProduct.description || '',
      price: newProduct.price!,
      stock: newProduct.stock || 0,
      category: newProduct.category || 'Uncategorized',
      brand: newProduct.brand || '',
      images: newProduct.images || [],
      videos: newProduct.videos || [],
      sku: `SKU-${Date.now()}`,
      barcode: '',
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      variants: newProduct.variants || [],
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setProducts([...products, product]);
    setShowAddProduct(false);
    setNewProduct({});
    toast.success('Product added successfully!');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted successfully');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
    toast.success(`Order ${orderId} status updated to ${status}`);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showCreateShop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Store className="w-8 h-8 text-purple-600" />
                Create Your Shop
              </CardTitle>
              <p className="text-gray-600">Set up your online store and start selling</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Shop Name *</label>
                  <Input
                    placeholder="Enter your shop name"
                    value={shopData.name}
                    onChange={(e) => setShopData({ ...shopData, name: e.target.value })}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Business Type</label>
                  <select
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    value={shopData.businessType}
                    onChange={(e) => setShopData({ ...shopData, businessType: e.target.value })}
                  >
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Shop Description *</label>
                <Textarea
                  placeholder="Describe your shop and what you sell"
                  value={shopData.description}
                  onChange={(e) => setShopData({ ...shopData, description: e.target.value })}
                  className="border-purple-200 focus:border-purple-500"
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    className="w-full px-3 py-2 border border-purple-200 rounded-lg focus:border-purple-500 focus:outline-none"
                    value={shopData.category}
                    onChange={(e) => setShopData({ ...shopData, category: e.target.value })}
                  >
                    <option value="">Select Category</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home & Living</option>
                    <option value="beauty">Beauty</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tax ID (Optional)</label>
                  <Input
                    placeholder="Enter your tax ID"
                    value={shopData.taxId}
                    onChange={(e) => setShopData({ ...shopData, taxId: e.target.value })}
                    className="border-purple-200 focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Shop Logo</label>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 cursor-pointer transition-colors">
                    <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload logo</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Shop Banner</label>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 cursor-pointer transition-colors">
                    <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload banner</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => onNavigate('home')}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateShop}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Shop
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
          <p className="text-purple-100">Manage your store, products, and orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden md:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden md:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden md:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden md:inline">AI Insights</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  <DollarSign className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(analytics.totalRevenue)}</div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+{analytics.revenueGrowth}% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+{analytics.ordersGrowth}% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                  <Package className="w-4 h-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalProducts}</div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+{analytics.productsGrowth}% from last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
                  <Star className="w-4 h-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.avgRating}/5.0</div>
                  <div className="flex items-center text-sm text-green-600 mt-1">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+{analytics.ratingGrowth}% from last month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-semibold">{order.id}</div>
                        <div className="text-sm text-gray-600">{order.customer} • {order.date}</div>
                      </div>
                      <div className="text-right mr-4">
                        <div className="font-semibold">{formatPrice(order.total)}</div>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Management */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-500"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
                <Button
                  onClick={() => setBulkUploadMode(true)}
                  variant="outline"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Upload
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Search products..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span className="text-gray-600">SKU: {product.sku}</span>
                              <span className="text-gray-600">Category: {product.category}</span>
                              <span className="text-gray-600">Stock: {product.stock}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-purple-600">{formatPrice(product.price)}</div>
                            <Badge className={product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {product.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Product Modal */}
            {showAddProduct && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Add New Product</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => setShowAddProduct(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Product Name *</label>
                        <Input
                          placeholder="Enter product name"
                          value={newProduct.name || ''}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Brand</label>
                        <Input
                          placeholder="Enter brand name"
                          value={newProduct.brand || ''}
                          onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        placeholder="Enter product description"
                        value={newProduct.description || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Price *</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={newProduct.price || ''}
                          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Stock *</label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={newProduct.stock || ''}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          value={newProduct.category || ''}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        >
                          <option value="">Select Category</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Fashion">Fashion</option>
                          <option value="Home">Home & Living</option>
                          <option value="Beauty">Beauty</option>
                          <option value="Sports">Sports</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Product Images</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 cursor-pointer transition-colors"
                      >
                        <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload images</p>
                        <p className="text-xs text-gray-500 mt-1">Supports: JPG, PNG (Max 5MB each)</p>
                      </div>
                      {newProduct.images && newProduct.images.length > 0 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {newProduct.images.map((img, idx) => (
                            <div key={idx} className="relative w-20 h-20">
                              <img src={img} alt="" className="w-full h-full object-cover rounded" />
                              <button
                                onClick={() => setNewProduct({
                                  ...newProduct,
                                  images: newProduct.images!.filter((_, i) => i !== idx)
                                })}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Product Videos (Optional)</label>
                      <input
                        ref={videoInputRef}
                        type="file"
                        multiple
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                      <div 
                        onClick={() => videoInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 cursor-pointer transition-colors"
                      >
                        <Video className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload videos</p>
                        <p className="text-xs text-gray-500 mt-1">Supports: MP4, MOV (Max 50MB each)</p>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t">
                      <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddProduct}
                        className="bg-gradient-to-r from-purple-600 to-pink-500"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Bulk Upload Modal */}
            {bulkUploadMode && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Bulk Product Upload</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => setBulkUploadMode(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">How to bulk upload:</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                        <li>Download the CSV template below</li>
                        <li>Fill in your product information</li>
                        <li>Upload the completed CSV file</li>
                        <li>Review and confirm your products</li>
                      </ol>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV Template
                    </Button>

                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleBulkUpload}
                      className="hidden"
                      id="bulk-upload-input"
                    />
                    <label
                      htmlFor="bulk-upload-input"
                      className="block border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-500 cursor-pointer transition-colors"
                    >
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-700">Upload CSV File</p>
                      <p className="text-sm text-gray-500 mt-2">Click or drag file to upload</p>
                    </label>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Orders Management */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant={orders.filter(o => o.status === 'pending').length > 0 ? 'default' : 'outline'}>
                  Pending ({orders.filter(o => o.status === 'pending').length})
                </Button>
                <Button variant="outline">
                  Processing ({orders.filter(o => o.status === 'processing').length})
                </Button>
                <Button variant="outline">
                  Shipped ({orders.filter(o => o.status === 'shipped').length})
                </Button>
              </div>
              <Input placeholder="Search orders..." className="w-64" />
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <p className="text-sm text-gray-600">{order.customer} • {order.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{formatPrice(order.total)}</div>
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{product.name} x{product.quantity}</span>
                          <span className="font-medium">{formatPrice(product.price * product.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          <span>{order.shippingAddress}</span>
                        </div>
                        {order.trackingNumber && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-medium">Tracking:</span>
                            <span>{order.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <Button 
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accept Order
                          </Button>
                        )}
                        {order.status === 'processing' && (
                          <Button 
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                          >
                            <Truck className="w-3 h-3 mr-1" />
                            Mark as Shipped
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.monthlyRevenue.map((item) => (
                      <div key={item.month}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{item.month}</span>
                          <span className="font-medium">{formatPrice(item.revenue)}</span>
                        </div>
                        <Progress value={(item.revenue / 25000) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.salesByCategory.map((item) => (
                      <div key={item.category}>
                        <div className="flex justify-between text-sm mb-2">
                          <span>{item.category}</span>
                          <span className="font-medium">{formatPrice(item.sales)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={item.percentage} className="flex-1 h-2" />
                          <span className="text-sm text-gray-600">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topProducts.map((product, idx) => (
                    <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
                        {idx + 1}
                      </div>
                      <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">{product.stock} units sold</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">{formatPrice(product.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <CardTitle>AI-Powered Business Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">Next Month Revenue Prediction</h3>
                  <div className="flex items-end gap-4">
                    <div className="text-4xl font-bold text-purple-600">{formatPrice(predictions.nextMonthRevenue)}</div>
                    <div className="text-sm text-gray-600 mb-2">
                      {predictions.confidence}% confidence
                    </div>
                  </div>
                  <Progress value={predictions.confidence} className="mt-3 h-2" />
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4">Trending Products</h3>
                  <div className="space-y-3">
                    {predictions.trendingProducts.map((product) => (
                      <div key={product.name} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-green-600" />
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-semibold">+{product.expectedGrowth}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4">Recommended Actions</h3>
                  <div className="space-y-3">
                    {predictions.recommendedActions.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                        <span className="text-sm">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4">Demand Forecast</h3>
                  <div className="space-y-3">
                    {predictions.demandForecast.map((item) => (
                      <div key={item.product} className="flex items-center justify-between">
                        <span className="text-sm">{item.product}</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(item.forecast / 250) * 100} className="w-32 h-2" />
                          <span className="text-sm font-medium text-gray-700">{item.forecast} units</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shop Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Shop Name</label>
                  <Input value={shopData.name} onChange={(e) => setShopData({ ...shopData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Shop Description</label>
                  <Textarea
                    value={shopData.description}
                    onChange={(e) => setShopData({ ...shopData, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-500">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Account</label>
                  <Input placeholder="Enter bank account number" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">PayPal Email</label>
                  <Input type="email" placeholder="Enter PayPal email" />
                </div>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-500">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Update Payment Methods
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
