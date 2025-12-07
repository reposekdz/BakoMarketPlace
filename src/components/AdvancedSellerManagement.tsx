import { useState } from 'react';
import { Package, TrendingUp, Users, DollarSign, AlertTriangle, Clock, CheckCircle, XCircle, Download, Upload, Filter, Search, Calendar, BarChart3, PieChart, Activity, Zap, Target, Award, MessageSquare, Star, Eye, Edit, Trash2, Copy, RefreshCw, Settings, Bell, FileText, Truck, CreditCard, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdvancedSellerManagementProps {
  user: any;
}

export function AdvancedSellerManagement({ user }: AdvancedSellerManagementProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'inventory' | 'orders' | 'analytics' | 'customers' | 'promotions'>('dashboard');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [dateRange, setDateRange] = useState('7days');

  const orders = [
    { id: 'ORD-1001', customer: 'John Doe', product: 'Laptop Pro', amount: 1299, status: 'pending', date: '2024-01-15', priority: 'high' },
    { id: 'ORD-1002', customer: 'Jane Smith', product: 'Wireless Mouse', amount: 49, status: 'shipped', date: '2024-01-14', priority: 'normal' },
    { id: 'ORD-1003', customer: 'Bob Johnson', product: 'USB-C Cable', amount: 19, status: 'delivered', date: '2024-01-13', priority: 'low' },
    { id: 'ORD-1004', customer: 'Alice Brown', product: 'Keyboard', amount: 89, status: 'processing', date: '2024-01-15', priority: 'high' },
    { id: 'ORD-1005', customer: 'Charlie Wilson', product: 'Monitor 4K', amount: 599, status: 'cancelled', date: '2024-01-12', priority: 'normal' }
  ];

  const inventory = [
    { id: 'P001', name: 'Laptop Pro', stock: 45, reserved: 5, lowStock: 10, price: 1299, sku: 'LPT-001', category: 'Electronics', status: 'active' },
    { id: 'P002', name: 'Wireless Mouse', stock: 8, reserved: 2, lowStock: 15, price: 49, sku: 'MSE-002', category: 'Accessories', status: 'low' },
    { id: 'P003', name: 'USB-C Cable', stock: 150, reserved: 10, lowStock: 20, price: 19, sku: 'CBL-003', category: 'Accessories', status: 'active' },
    { id: 'P004', name: 'Keyboard', stock: 0, reserved: 0, lowStock: 10, price: 89, sku: 'KBD-004', category: 'Accessories', status: 'out' }
  ];

  const handleBulkAction = () => {
    if (!bulkAction || selectedOrders.length === 0) {
      toast.error('Select orders and action');
      return;
    }
    toast.success(`${bulkAction} applied to ${selectedOrders.length} orders`);
    setSelectedOrders([]);
  };

  const exportData = (type: string) => {
    toast.success(`Exporting ${type} data...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1>Advanced Seller Hub</h1>
            <p className="text-gray-600">Complete business management suite</p>
          </div>
          <div className="flex items-center gap-3">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 border-2 border-gray-300 rounded-lg">
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export
            </button>
            <button className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">8</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-8">
        <div className="flex gap-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'analytics', label: 'Analytics', icon: Activity },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'promotions', label: 'Promotions', icon: Zap }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveView(tab.id as any)} className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${activeView === tab.id ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto p-8">
        {/* Dashboard View */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Revenue', value: '$24,580', change: '+18.2%', icon: DollarSign, color: 'green', trend: 'up' },
                { label: 'Orders', value: '342', change: '+12.5%', icon: ShoppingBag, color: 'blue', trend: 'up' },
                { label: 'Conversion', value: '3.8%', change: '+0.5%', icon: Target, color: 'purple', trend: 'up' },
                { label: 'Avg Order', value: '$71.87', change: '-2.1%', icon: TrendingUp, color: 'orange', trend: 'down' }
              ].map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-${kpi.color}-100 rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${kpi.color}-600`} />
                      </div>
                      <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{kpi.change}</span>
                    </div>
                    <p className="text-gray-600 mb-1">{kpi.label}</p>
                    <p className="text-3xl font-bold">{kpi.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Real-time Activity & Quick Actions */}
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="mb-4">Real-time Sales Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'New order received', customer: 'John Doe', amount: '$1,299', time: '2 min ago', type: 'order' },
                    { action: 'Product viewed', customer: 'Jane Smith', product: 'Laptop Pro', time: '5 min ago', type: 'view' },
                    { action: 'Review posted', customer: 'Bob Johnson', rating: 5, time: '12 min ago', type: 'review' },
                    { action: 'Message received', customer: 'Alice Brown', time: '18 min ago', type: 'message' }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'order' ? 'bg-green-100' :
                          activity.type === 'view' ? 'bg-blue-100' :
                          activity.type === 'review' ? 'bg-yellow-100' : 'bg-purple-100'
                        }`}>
                          {activity.type === 'order' && <ShoppingBag className="w-5 h-5 text-green-600" />}
                          {activity.type === 'view' && <Eye className="w-5 h-5 text-blue-600" />}
                          {activity.type === 'review' && <Star className="w-5 h-5 text-yellow-600" />}
                          {activity.type === 'message' && <MessageSquare className="w-5 h-5 text-purple-600" />}
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {activity.amount && <p className="font-medium text-green-600">{activity.amount}</p>}
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-6 text-white">
                <h3 className="text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Add Product', icon: Package },
                    { label: 'Process Orders', icon: ShoppingBag },
                    { label: 'View Analytics', icon: BarChart3 },
                    { label: 'Manage Promotions', icon: Zap }
                  ].map((action, i) => {
                    const Icon = action.icon;
                    return (
                      <button key={i} className="w-full py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors flex items-center gap-3 px-4">
                        <Icon className="w-5 h-5" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Management */}
        {activeView === 'inventory' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Search inventory..." className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none w-80" />
                </div>
                <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filter
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => exportData('inventory')} className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Export
                </button>
                <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Import
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                  Add Product
                </button>
              </div>
            </div>

            {/* Inventory Alerts */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Out of Stock</p>
                  <p className="text-sm text-red-700">1 product needs restocking</p>
                </div>
              </div>
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 flex items-center gap-3">
                <Package className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900">Low Stock</p>
                  <p className="text-sm text-orange-700">1 product running low</p>
                </div>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Well Stocked</p>
                  <p className="text-sm text-green-700">2 products in good supply</p>
                </div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">SKU</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Reserved</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.category}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.sku}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{item.stock}</p>
                          {item.stock <= item.lowStock && <p className="text-xs text-orange-600">Low stock alert</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{item.reserved}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          item.status === 'active' ? 'bg-green-100 text-green-700' :
                          item.status === 'low' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.status === 'active' ? 'Active' : item.status === 'low' ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">${item.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg"><Copy className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-600" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Management */}
        {activeView === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Search orders..." className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none w-80" />
                </div>
                <select className="px-4 py-2 border-2 border-gray-300 rounded-lg">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </div>
              <button onClick={() => exportData('orders')} className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Orders
              </button>
            </div>

            {/* Bulk Actions */}
            {selectedOrders.length > 0 && (
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 flex items-center justify-between">
                <p className="font-medium text-purple-900">{selectedOrders.length} orders selected</p>
                <div className="flex items-center gap-3">
                  <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} className="px-4 py-2 border-2 border-purple-300 rounded-lg bg-white">
                    <option value="">Select Action</option>
                    <option value="mark-shipped">Mark as Shipped</option>
                    <option value="mark-delivered">Mark as Delivered</option>
                    <option value="cancel">Cancel Orders</option>
                    <option value="export">Export Selected</option>
                  </select>
                  <button onClick={handleBulkAction} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input type="checkbox" onChange={(e) => setSelectedOrders(e.target.checked ? orders.map(o => o.id) : [])} className="w-5 h-5 accent-purple-600" />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input type="checkbox" checked={selectedOrders.includes(order.id)} onChange={(e) => setSelectedOrders(e.target.checked ? [...selectedOrders, order.id] : selectedOrders.filter(id => id !== order.id))} className="w-5 h-5 accent-purple-600" />
                      </td>
                      <td className="px-6 py-4 font-medium">{order.id}</td>
                      <td className="px-6 py-4">{order.customer}</td>
                      <td className="px-6 py-4">{order.product}</td>
                      <td className="px-6 py-4 font-medium">${order.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{order.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg"><Truck className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-gray-100 rounded-lg"><MessageSquare className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: '$124,580', period: 'Last 30 days', icon: DollarSign },
                { label: 'Profit Margin', value: '32.5%', period: 'Average', icon: TrendingUp },
                { label: 'Customer LTV', value: '$456', period: 'Average', icon: Users },
                { label: 'ROI', value: '245%', period: 'Overall', icon: Target }
              ].map((metric, i) => {
                const Icon = metric.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
                    <Icon className="w-8 h-8 text-purple-600 mb-3" />
                    <p className="text-gray-600 mb-1">{metric.label}</p>
                    <p className="text-3xl font-bold mb-1">{metric.value}</p>
                    <p className="text-sm text-gray-500">{metric.period}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="mb-4">Revenue Trend</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[45, 52, 48, 65, 58, 72, 68, 85, 78, 92, 88, 95].map((height, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t" style={{ height: `${height}%` }} />
                      <span className="text-xs text-gray-600 mt-2">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="mb-4">Top Products by Revenue</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Laptop Pro', revenue: 45600, percentage: 35 },
                    { name: 'Monitor 4K', revenue: 28900, percentage: 22 },
                    { name: 'Keyboard', revenue: 18500, percentage: 14 },
                    { name: 'Mouse', revenue: 12300, percentage: 10 },
                    { name: 'Others', revenue: 19280, percentage: 19 }
                  ].map((product, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-gray-600">${product.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full" style={{ width: `${product.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
