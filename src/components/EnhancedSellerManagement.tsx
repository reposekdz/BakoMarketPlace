import { useState } from 'react';
import { Package, TrendingUp, Users, DollarSign, AlertTriangle, Clock, CheckCircle, XCircle, Download, Upload, Filter, Search, Calendar, BarChart3, PieChart, Activity, Zap, Target, Award, MessageSquare, Star, Eye, Edit, Trash2, Copy, RefreshCw, Settings, Bell, FileText, Truck, CreditCard, ShoppingBag, AlertCircle, CheckCheckIcon, Flag, Undo2, Send, Phone, Video, Mail, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Dispute {
  id: string;
  orderId: string;
  customerId: string;
  reason: string;
  status: 'open' | 'in-review' | 'resolved' | 'escalated';
  severity: 'low' | 'medium' | 'high';
  date: string;
  amount: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  orderCount: number;
  lastOrder: string;
  rating: number;
  status: 'active' | 'inactive' | 'vip' | 'at-risk';
  notes?: string;
}

export function EnhancedSellerManagement({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'crm' | 'disputes' | 'automation' | 'returns' | 'performance'>('dashboard');
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved'>('all');

  const [disputes, setDisputes] = useState<Dispute[]>([
    { id: 'D001', orderId: 'ORD-1001', customerId: 'C001', reason: 'Product defective after 2 weeks', status: 'open', severity: 'high', date: '2024-01-15', amount: 1299 },
    { id: 'D002', orderId: 'ORD-1002', customerId: 'C002', reason: 'Item arrived damaged', status: 'in-review', severity: 'high', date: '2024-01-14', amount: 49 },
    { id: 'D003', orderId: 'ORD-1003', customerId: 'C003', reason: 'Wrong item sent', status: 'resolved', severity: 'medium', date: '2024-01-13', amount: 199 }
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    { id: 'C001', name: 'John Doe', email: 'john@example.com', phone: '+1-555-0101', totalSpent: 5490, orderCount: 8, lastOrder: '2024-01-15', rating: 4.8, status: 'vip', notes: 'Frequent buyer, prefers fast shipping' },
    { id: 'C002', name: 'Jane Smith', email: 'jane@example.com', phone: '+1-555-0102', totalSpent: 2380, orderCount: 5, lastOrder: '2024-01-10', rating: 4.6, status: 'active', notes: 'Interested in electronics' },
    { id: 'C003', name: 'Bob Wilson', email: 'bob@example.com', phone: '+1-555-0103', totalSpent: 890, orderCount: 2, lastOrder: '2024-01-05', rating: 3.9, status: 'at-risk', notes: 'Had return issues previously' }
  ]);

  const [automationRules, setAutomationRules] = useState([
    { id: 'A001', name: 'Auto-confirm orders', trigger: 'order_received', action: 'send_confirmation', enabled: true },
    { id: 'A002', name: 'Shipping notification', trigger: 'order_shipped', action: 'send_notification', enabled: true },
    { id: 'A003', name: 'Follow-up review request', trigger: 'order_delivered', action: 'request_review', enabled: true },
    { id: 'A004', name: 'VIP customer discount', trigger: 'customer_vip', action: 'apply_discount', enabled: false }
  ]);

  const handleResolveDispute = (disputeId: string, resolution: string) => {
    setDisputes(disputes.map(d => 
      d.id === disputeId ? { ...d, status: 'resolved' as const } : d
    ));
    toast.success(`Dispute ${resolution === 'refund' ? 'refunded' : 'resolved'}`);
  };

  const handleEscalateDispute = (disputeId: string) => {
    setDisputes(disputes.map(d =>
      d.id === disputeId ? { ...d, status: 'escalated' as const } : d
    ));
    toast.success('Dispute escalated to support team');
  };

  const handleContactCustomer = (customerId: string, method: 'email' | 'phone' | 'message') => {
    toast.success(`Initiating ${method} contact with customer...`);
  };

  const handleToggleAutomation = (ruleId: string) => {
    setAutomationRules(automationRules.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
    toast.success('Automation rule updated');
  };

  const filteredDisputes = disputes.filter(d => {
    const matchesSearch = d.orderId.includes(searchQuery) || d.customerId.includes(searchQuery);
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && d.status === filterStatus;
  });

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Enhanced Seller Management</h1>
            <p className="text-gray-600 text-sm">Advanced CRM, Disputes, Returns & Automation</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">5</span>
            </button>
            <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-8">
        <div className="flex gap-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'crm', label: 'Customer CRM', icon: Users },
            { id: 'disputes', label: 'Disputes & Issues', icon: AlertTriangle },
            { id: 'automation', label: 'Automation', icon: Zap },
            { id: 'returns', label: 'Returns & Refunds', icon: Undo2 },
            { id: 'performance', label: 'Performance', icon: TrendingUp }
          ].map((tab) => {
            const Icon = tab.icon as any;
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
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Active Customers', value: '1,234', icon: Users, color: 'blue', trend: '+8.2%' },
                { label: 'Open Disputes', value: '12', icon: AlertTriangle, color: 'red', trend: '-2.1%' },
                { label: 'Pending Returns', value: '8', icon: Undo2, color: 'orange', trend: '+1.5%' },
                { label: 'Customer Satisfaction', value: '4.6/5', icon: Star, color: 'green', trend: '+0.3' }
              ].map((kpi, i) => {
                const Icon = kpi.icon as any;
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-${kpi.color}-100 rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${kpi.color}-600`} />
                      </div>
                      <span className={`text-sm font-semibold ${kpi.color === 'red' ? 'text-red-600' : 'text-green-600'}`}>{kpi.trend}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{kpi.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions & Alerts */}
            <div className="grid grid-cols-3 gap-6">
              {/* Critical Alerts */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Critical Alerts
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="font-medium text-red-900 text-sm">High priority dispute</p>
                    <p className="text-xs text-red-700 mt-1">Order ORD-1001: Product defective</p>
                  </div>
                  <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                    <p className="font-medium text-orange-900 text-sm">Pending return</p>
                    <p className="text-xs text-orange-700 mt-1">2 items awaiting verification</p>
                  </div>
                </div>
              </div>

              {/* Customer Segmentation */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Customer Segments</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-900">VIP Customers</span>
                    <span className="text-lg font-bold text-purple-600">42</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-900">Active</span>
                    <span className="text-lg font-bold text-blue-600">892</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-orange-900">At-Risk</span>
                    <span className="text-lg font-bold text-orange-600">34</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Resolve Disputes', icon: CheckCircle },
                    { label: 'Contact VIP Customers', icon: MessageSquare },
                    { label: 'Process Returns', icon: Undo2 },
                    { label: 'View Analytics', icon: BarChart3 }
                  ].map((action, i) => {
                    const Icon = action.icon as any;
                    return (
                      <button key={i} className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg flex items-center gap-2 px-3 transition-colors text-sm">
                        <Icon className="w-4 h-4" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CRM View */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Customer
              </button>
            </div>

            {/* Customer List */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Total Spent</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Orders</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <button onClick={() => setSelectedCustomer(customer.id)} className="font-medium text-purple-600 hover:underline">
                          {customer.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">${customer.totalSpent}</td>
                      <td className="px-6 py-4 text-gray-600">{customer.orderCount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          customer.status === 'vip' ? 'bg-purple-100 text-purple-700' :
                          customer.status === 'at-risk' ? 'bg-red-100 text-red-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(customer.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleContactCustomer(customer.id, 'email')}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Email"
                          >
                            <Mail className="w-4 h-4 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleContactCustomer(customer.id, 'phone')}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                            title="Call"
                          >
                            <Phone className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => handleContactCustomer(customer.id, 'message')}
                            className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
                            title="Message"
                          >
                            <MessageSquare className="w-4 h-4 text-purple-600" />
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

        {/* Disputes View */}
        {activeTab === 'disputes' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search disputes..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Disputes Grid */}
            <div className="grid grid-cols-1 gap-4">
              {filteredDisputes.map((dispute) => (
                <div key={dispute.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        {dispute.orderId}
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          dispute.severity === 'high' ? 'bg-red-100 text-red-700' :
                          dispute.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {dispute.severity.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          dispute.status === 'open' ? 'bg-red-100 text-red-700' :
                          dispute.status === 'in-review' ? 'bg-blue-100 text-blue-700' :
                          dispute.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {dispute.status.toUpperCase()}
                        </span>
                      </h4>
                      <p className="text-sm text-gray-600 mt-2">{dispute.reason}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">${dispute.amount}</p>
                      <p className="text-xs text-gray-500">{dispute.date}</p>
                    </div>
                  </div>

                  {dispute.status !== 'resolved' && (
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleResolveDispute(dispute.id, 'refund')}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Refund
                      </button>
                      <button
                        onClick={() => handleResolveDispute(dispute.id, 'replacement')}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Send Replacement
                      </button>
                      <button
                        onClick={() => handleEscalateDispute(dispute.id)}
                        className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Escalate
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">
                        Contact Customer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Automation View */}
        {activeTab === 'automation' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {automationRules.map((rule) => (
                <div key={rule.id} className="p-6 border-b border-gray-200 last:border-b-0 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Trigger: <span className="text-purple-600">{rule.trigger}</span> → Action: <span className="text-blue-600">{rule.action}</span>
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={() => handleToggleAutomation(rule.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              ))}
            </div>

            {/* Create New Automation */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-dashed border-purple-300 p-8">
              <h4 className="font-semibold text-gray-900 mb-4">Create Custom Automation</h4>
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder="Rule name..." className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none" />
                <select className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none">
                  <option>Select trigger...</option>
                  <option>order_received</option>
                  <option>order_shipped</option>
                  <option>order_delivered</option>
                </select>
                <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Returns & Refunds */}
        {activeTab === 'returns' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-6">
              {[
                { label: 'Pending Returns', value: '8', icon: Undo2, color: 'orange' },
                { label: 'Approved Returns', value: '24', icon: CheckCircle, color: 'green' },
                { label: 'Refunded Amount', value: '$3,450', icon: DollarSign, color: 'blue' },
                { label: 'Return Rate', value: '2.3%', icon: TrendingUp, color: 'purple' }
              ].map((stat, i) => {
                const Icon = stat.icon as any;
                return (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </div>
                      <p className="text-gray-600 text-sm">{stat.label}</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Return ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Order</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Reason</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'RET-001', order: 'ORD-1001', reason: 'Product defective', amount: 1299, status: 'approved' },
                    { id: 'RET-002', order: 'ORD-1002', reason: 'Not as described', amount: 199, status: 'pending' },
                    { id: 'RET-003', order: 'ORD-1003', reason: 'Changed mind', amount: 89, status: 'refunded' }
                  ].map((ret) => (
                    <tr key={ret.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{ret.id}</td>
                      <td className="px-6 py-4">{ret.order}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{ret.reason}</td>
                      <td className="px-6 py-4 font-semibold">${ret.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                          ret.status === 'approved' ? 'bg-green-100 text-green-700' :
                          ret.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {ret.status.charAt(0).toUpperCase() + ret.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-purple-600 hover:underline text-sm">Process</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Performance View */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Seller Rating</h4>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-purple-600">4.8</div>
                  <div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">Based on 2,847 reviews</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Shipping Performance</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">On-time delivery</span>
                    <span className="font-semibold">98.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.2%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Response Time</h4>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 mb-2">8 min</p>
                  <p className="text-sm text-gray-600">Average response time</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
