import { useState, useRef } from 'react';
import { Package, Users, TrendingUp, DollarSign, Plus, Edit, Trash2, Eye, Upload, Image, Video, Save, X, ShoppingBag, MessageSquare, BarChart3, Settings, Bell, Calendar, Download, Filter, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SellerDashboardProps {
  user: any;
  onNavigate: (view: string) => void;
}

interface UploadedProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  videos?: string[];
  category: string;
  description: string;
  deliveryOptions: {
    delivery: boolean;
    pickup: boolean;
  };
  status: 'active' | 'draft' | 'out-of-stock';
  views: number;
  sales: number;
}

export function SellerDashboard({ user, onNavigate }: SellerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'analytics' | 'messages'>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState<UploadedProduct[]>([
    {
      id: '1',
      name: 'Sample Product',
      price: 99.99,
      stock: 50,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'],
      category: 'electronics',
      description: 'Great product',
      deliveryOptions: { delivery: true, pickup: true },
      status: 'active',
      views: 1234,
      sales: 45
    }
  ]);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    brand: '',
    sku: '',
    weight: '',
    dimensions: '',
    warranty: '',
    delivery: true,
    pickup: true,
    shippingCost: '',
    estimatedDelivery: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
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
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedVideos(prev => [...prev, reader.result as string]);
          toast.success(`Video "${file.name}" uploaded!`);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSaveProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const product: UploadedProduct = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'],
      videos: uploadedVideos,
      category: newProduct.category,
      description: newProduct.description,
      deliveryOptions: {
        delivery: newProduct.delivery,
        pickup: newProduct.pickup
      },
      status: 'active',
      views: 0,
      sales: 0
    };

    setProducts([...products, product]);
    toast.success('Product added successfully!');
    setShowAddProduct(false);
    setUploadedImages([]);
    setUploadedVideos([]);
    setNewProduct({
      name: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      brand: '',
      sku: '',
      weight: '',
      dimensions: '',
      warranty: '',
      delivery: true,
      pickup: true,
      shippingCost: '',
      estimatedDelivery: ''
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted');
  };

  const stats = [
    { label: 'Total Sales', value: '$12,458', change: '+12.5%', icon: DollarSign, color: 'green' },
    { label: 'Total Products', value: products.length.toString(), change: `+${products.length}`, icon: Package, color: 'blue' },
    { label: 'Total Orders', value: '156', change: '+8.2%', icon: ShoppingBag, color: 'purple' },
    { label: 'Total Customers', value: '89', change: '+15.3%', icon: Users, color: 'orange' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>{user.shopName || 'My Shop'}</h1>
            <p className="text-gray-600">Welcome back, {user.firstName}!</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-5 h-5 inline mr-2" />
              Export Data
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              View Marketplace
            </button>
            <button className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">3</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-8">
        <div className="flex gap-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'messages', label: 'Messages', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
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
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </div>
                      <span className="text-green-600 text-sm">{stat.change}</span>
                    </div>
                    <p className="text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="mb-4">Sales Overview</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[65, 45, 78, 52, 88, 73, 95].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-gray-600 mt-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="mb-4">Recent Orders</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg" />
                        <div>
                          <p className="font-medium">Order #{1000 + i}</p>
                          <p className="text-sm text-gray-600">Customer Name</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(99 * i).toFixed(2)}</p>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          Completed
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-5 h-5 inline mr-2" />
                  Filter
                </button>
              </div>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Product
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Views</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Sales</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">${product.price}</td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          product.status === 'active' ? 'bg-green-100 text-green-700' :
                          product.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{product.views}</td>
                      <td className="px-6 py-4">{product.sales}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="mb-4">Top Products</h4>
                <div className="space-y-3">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={product.images[0]} alt="" className="w-8 h-8 rounded" />
                        <span className="text-sm">{product.name}</span>
                      </div>
                      <span className="text-sm font-medium">{product.sales} sold</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="mb-4">Revenue by Category</h4>
                <div className="space-y-3">
                  {['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty'].map((cat, i) => (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{cat}</span>
                        <span className="text-sm font-medium">${(2500 - i * 300).toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full"
                          style={{ width: `${100 - i * 15}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="mb-4">Customer Demographics</h4>
                <div className="space-y-4">
                  {['18-24', '25-34', '35-44', '45-54', '55+'].map((age, i) => (
                    <div key={age} className="flex items-center justify-between">
                      <span className="text-sm">{age} years</span>
                      <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${[35, 45, 25, 15, 10][i]}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{[35, 45, 25, 15, 10][i]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <h2>Add New Product</h2>
              <button
                onClick={() => setShowAddProduct(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3>Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Category *</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    >
                      <option value="">Select category</option>
                      <option value="electronics">Electronics</option>
                      <option value="fashion">Fashion</option>
                      <option value="home">Home & Living</option>
                      <option value="sports">Sports</option>
                      <option value="beauty">Beauty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2">Price *</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">Stock Quantity *</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    rows={4}
                    placeholder="Describe your product..."
                  />
                </div>
              </div>

              {/* Media Upload */}
              <div className="space-y-4">
                <h3>Product Media</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">Images</label>
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
                      className="w-full py-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors flex flex-col items-center justify-center gap-2"
                    >
                      <Image className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-600">Click to upload images</span>
                      <span className="text-sm text-gray-500">PNG, JPG up to 10MB</span>
                    </button>
                    {uploadedImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {uploadedImages.map((img, i) => (
                          <div key={i} className="relative group">
                            <img src={img} alt="" className="w-full h-20 object-cover rounded-lg" />
                            <button
                              onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2">Videos</label>
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
                      className="w-full py-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors flex flex-col items-center justify-center gap-2"
                    >
                      <Video className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-600">Click to upload videos</span>
                      <span className="text-sm text-gray-500">MP4, MOV up to 50MB</span>
                    </button>
                    {uploadedVideos.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedVideos.map((video, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">Video {i + 1}</span>
                            <button
                              onClick={() => setUploadedVideos(uploadedVideos.filter((_, idx) => idx !== i))}
                              className="p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Options */}
              <div className="space-y-4">
                <h3>Delivery Options</h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={newProduct.delivery}
                      onChange={(e) => setNewProduct({ ...newProduct, delivery: e.target.checked })}
                      className="w-5 h-5 accent-purple-600"
                    />
                    <div>
                      <p className="font-medium">Home Delivery</p>
                      <p className="text-sm text-gray-600">Ship to customer address</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={newProduct.pickup}
                      onChange={(e) => setNewProduct({ ...newProduct, pickup: e.target.checked })}
                      className="w-5 h-5 accent-purple-600"
                    />
                    <div>
                      <p className="font-medium">Local Pickup</p>
                      <p className="text-sm text-gray-600">Customer picks up from store</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  <Save className="w-5 h-5 inline mr-2" />
                  Save Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
