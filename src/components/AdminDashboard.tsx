import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { 
  Package, Users, DollarSign, ShoppingCart, Plus, Edit, Trash2, 
  Search, Filter, Download, Upload, BarChart3, Activity, Globe, Settings 
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category_name: string;
  is_published: boolean;
  sku: string;
}

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalVendors: number;
}

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [translations, setTranslations] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    brand: '',
    sku: '',
    stock: '',
    featured: false,
    status: 'active',
    images: [] as string[],
    variations: [] as any[]
  });
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'dashboard') {
        const res = await fetch(`${API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } else if (activeTab === 'products') {
        const res = await fetch(`${API_URL}/admin/products`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setProducts(data.products);
        
        const catRes = await fetch(`${API_URL}/admin/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const catData = await catRes.json();
        setCategories(catData);
      } else if (activeTab === 'sellers') {
        const res = await fetch(`${API_URL}/admin/sellers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSellers(data);
      } else if (activeTab === 'translations') {
        const res = await fetch(`${API_URL}/admin/translations?language=${selectedLanguage}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setTranslations(data);
      }
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleCreateProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });
      
      if (res.ok) {
        toast.success('Product created successfully');
        setIsProductDialogOpen(false);
        loadData();
        resetProductForm();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to create product');
      }
    } catch (error) {
      toast.error('Failed to create product');
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });
      
      if (res.ok) {
        toast.success('Product updated successfully');
        setIsProductDialogOpen(false);
        setEditingProduct(null);
        loadData();
        resetProductForm();
      }
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`${API_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        toast.success('Product deleted successfully');
        loadData();
      }
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = async (product: Product) => {
    try {
      const res = await fetch(`${API_URL}/admin/products/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      setEditingProduct(data);
      setProductForm({
        name: data.name,
        description: data.description || '',
        price: data.price.toString(),
        original_price: data.original_price?.toString() || '',
        category: data.category || '',
        brand: data.brand || '',
        sku: data.sku || '',
        stock: data.stock?.toString() || '0',
        featured: data.featured || false,
        status: data.status || 'active',
        images: data.images ? JSON.parse(data.images) : [],
        variations: data.variations ? JSON.parse(data.variations) : []
      });
      setIsProductDialogOpen(true);
    } catch (error) {
      toast.error('Failed to load product details');
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      original_price: '',
      category: '',
      brand: '',
      sku: '',
      stock: '',
      featured: false,
      status: 'active',
      images: [],
      variations: []
    });
  };

  const handleBulkAction = async () => {
    if (selectedProducts.length === 0 || !bulkAction) return;
    
    try {
      if (bulkAction === 'delete') {
        const res = await fetch(`${API_URL}/admin/products/bulk-delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productIds: selectedProducts })
        });
        if (res.ok) {
          toast.success('Products deleted successfully');
          setSelectedProducts([]);
          loadData();
        }
      } else {
        const updates: any = {};
        if (bulkAction === 'activate') updates.status = 'active';
        if (bulkAction === 'deactivate') updates.status = 'draft';
        if (bulkAction === 'feature') updates.featured = true;
        
        const res = await fetch(`${API_URL}/admin/products/bulk-update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ productIds: selectedProducts, updates })
        });
        if (res.ok) {
          toast.success('Products updated successfully');
          setSelectedProducts([]);
          loadData();
        }
      }
    } catch (error) {
      toast.error('Bulk action failed');
    }
  };

  const handleDuplicateProduct = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/admin/products/${id}/duplicate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Product duplicated successfully');
        loadData();
      }
    } catch (error) {
      toast.error('Failed to duplicate product');
    }
  };

  const handleUpdateSellerStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${API_URL}/admin/sellers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        toast.success('Seller status updated');
        loadData();
      }
    } catch (error) {
      toast.error('Failed to update seller status');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Package className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <Button onClick={onLogout} variant="outline">Logout</Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="sellers">
              <Users className="w-4 h-4 mr-2" />
              Sellers
            </TabsTrigger>
            <TabsTrigger value="translations">
              <Globe className="w-4 h-4 mr-2" />
              Translations
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Activity className="w-4 h-4 mr-2" />
              Activity Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {stats && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Products</p>
                        <p className="text-3xl font-bold mt-2">{stats.totalProducts}</p>
                      </div>
                      <Package className="w-12 h-12 text-blue-600 opacity-20" />
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Orders</p>
                        <p className="text-3xl font-bold mt-2">{stats.totalOrders}</p>
                      </div>
                      <ShoppingCart className="w-12 h-12 text-green-600 opacity-20" />
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Revenue</p>
                        <p className="text-3xl font-bold mt-2">${stats.totalRevenue.toFixed(2)}</p>
                      </div>
                      <DollarSign className="w-12 h-12 text-yellow-600 opacity-20" />
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
                      </div>
                      <Users className="w-12 h-12 text-purple-600 opacity-20" />
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="products">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { resetProductForm(); setEditingProduct(null); }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label>Product Name</Label>
                        <Input
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Price</Label>
                          <Input
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <Label>Compare at Price</Label>
                          <Input
                            type="number"
                            value={productForm.compare_at_price}
                            onChange={(e) => setProductForm({ ...productForm, compare_at_price: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>SKU</Label>
                          <Input
                            value={productForm.sku}
                            onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                          />
                        </div>
                        
                        <div>
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            value={productForm.quantity}
                            onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Category</Label>
                        <Select value={productForm.category_id} onValueChange={(v) => setProductForm({ ...productForm, category_id: v })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={productForm.is_published}
                          onChange={(e) => setProductForm({ ...productForm, is_published: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <Label>Published</Label>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button onClick={editingProduct ? handleUpdateProduct : handleCreateProduct} className="flex-1">
                          {editingProduct ? 'Update' : 'Create'} Product
                        </Button>
                        <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>Cancel</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.category_name}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          <Badge variant={product.is_published ? 'default' : 'secondary'}>
                            {product.is_published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sellers">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Shop</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellers.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell className="font-medium">{seller.name}</TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>{seller.shop_name || 'N/A'}</TableCell>
                      <TableCell>{seller.total_sales || 0}</TableCell>
                      <TableCell>{seller.rating || 0}</TableCell>
                      <TableCell>
                        <Badge variant={seller.is_active ? 'default' : 'secondary'}>
                          {seller.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={seller.is_active ? 'active' : 'inactive'}
                          onValueChange={(v) => handleUpdateSellerStatus(seller.id, v)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="translations">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={loadData}>Load Translations</Button>
              </div>

              <Card className="p-6">
                <p className="text-sm text-gray-600">
                  Translation management system ready. Add translations through the API or database.
                </p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <Card className="p-6">
              <p className="text-sm text-gray-600">
                Activity logs will appear here showing all admin actions.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
