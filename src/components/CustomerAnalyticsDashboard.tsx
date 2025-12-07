import { useState } from 'react';
import { BarChart3, LineChart, PieChart as PieChartIcon, TrendingUp, TrendingDown, Users, Eye, ShoppingCart, Heart, MessageSquare, Clock, Calendar, Download, Filter, Settings, Award, Target, Zap, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CustomerSegment {
  name: string;
  customers: number;
  revenue: number;
  growth: number;
  avgOrderValue: number;
  returnRate: number;
}

interface AnalyticsData {
  date: string;
  visitors: number;
  clicks: number;
  purchases: number;
  revenue: number;
  cartAbandonments: number;
}

export function CustomerAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('30days');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'customers' | 'engagement' | 'retention'>('revenue');
  const [viewType, setViewType] = useState<'overview' | 'segments' | 'behavior' | 'predictions'>('overview');

  const segments: CustomerSegment[] = [
    { name: 'VIP Customers', customers: 42, revenue: 45000, growth: 12.5, avgOrderValue: 1071, returnRate: 2.1 },
    { name: 'High-Value Buyers', customers: 156, revenue: 78000, growth: 8.2, avgOrderValue: 500, returnRate: 3.4 },
    { name: 'Regular Customers', customers: 892, revenue: 89000, growth: 5.3, avgOrderValue: 100, returnRate: 5.2 },
    { name: 'One-Time Buyers', customers: 1234, revenue: 45000, growth: -2.1, avgOrderValue: 36, returnRate: 0 }
  ];

  const analyticsData: AnalyticsData[] = [
    { date: 'Jan 1', visitors: 1234, clicks: 5678, purchases: 234, revenue: 12340, cartAbandonments: 145 },
    { date: 'Jan 8', visitors: 1456, clicks: 6234, purchases: 267, revenue: 14560, cartAbandonments: 156 },
    { date: 'Jan 15', visitors: 1789, clicks: 7123, purchases: 312, revenue: 17890, cartAbandonments: 178 },
    { date: 'Jan 22', visitors: 2012, clicks: 8456, purchases: 378, revenue: 21340, cartAbandonments: 201 },
    { date: 'Jan 29', visitors: 2234, clicks: 9123, purchases: 412, revenue: 23450, cartAbandonments: 189 }
  ];

  const customerBehavior = [
    { action: 'Product Views', percentage: 100, color: 'bg-blue-500' },
    { action: 'Added to Cart', percentage: 45, color: 'bg-purple-500' },
    { action: 'Completed Purchase', percentage: 18, color: 'bg-green-500' },
    { action: 'Left Review', percentage: 8, color: 'bg-yellow-500' },
    { action: 'Became Repeat Customer', percentage: 4, color: 'bg-pink-500' }
  ];

  const predictions = [
    { metric: 'Churn Risk', customers: 23, description: 'Customers likely to stop buying', action: 'Re-engagement Campaign' },
    { metric: 'Upgrade Potential', customers: 156, description: 'Regular customers ready for upsell', action: 'Personalized Offers' },
    { metric: 'Seasonal Peak', percentage: 35, description: 'Expected spike in next 30 days', action: 'Increase Stock' },
    { metric: 'Product Affinity', count: 234, description: 'Frequently bought together', action: 'Bundle Deals' }
  ];

  const geographicData = [
    { country: 'United States', customers: 3456, percentage: 42, revenue: 156000 },
    { country: 'Canada', customers: 1234, percentage: 15, revenue: 45000 },
    { country: 'United Kingdom', customers: 987, percentage: 12, revenue: 39000 },
    { country: 'Germany', customers: 765, percentage: 9, revenue: 28000 },
    { country: 'Others', customers: 1234, percentage: 15, revenue: 45000 }
  ];

  const deviceData = [
    { device: 'Mobile', percentage: 58, users: 4567, avgSessionTime: '4:32', bounceRate: 32 },
    { device: 'Desktop', percentage: 35, users: 2789, avgSessionTime: '6:12', bounceRate: 24 },
    { device: 'Tablet', percentage: 7, users: 567, avgSessionTime: '3:45', bounceRate: 41 }
  ];

  const topProducts = [
    { name: 'Premium Ultrabook Pro', views: 12456, purchases: 234, revenue: 304266, rating: 4.8 },
    { name: 'Wireless Mouse', views: 8934, purchases: 456, revenue: 22344, rating: 4.6 },
    { name: 'USB-C Cable', views: 15678, purchases: 1234, revenue: 23446, rating: 4.9 },
    { name: 'Monitor 4K', views: 6789, purchases: 89, revenue: 53911, rating: 4.7 }
  ];

  const handleExport = (format: string) => {
    toast.success(`Exporting analytics as ${format.toUpperCase()}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Advanced Customer Analytics</h1>
          <p className="text-gray-600 text-lg">Understand customer behavior, predict trends, and drive growth</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Date Range</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                  <option value="year">Last Year</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">View Type</label>
                <select
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value as any)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                >
                  <option value="overview">Overview</option>
                  <option value="segments">Segments</option>
                  <option value="behavior">Behavior</option>
                  <option value="predictions">Predictions</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors">
                <Filter className="w-5 h-5" />
                Filters
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Overview View */}
        {viewType === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Customers', value: '8,456', change: '+12.3%', icon: Users, color: 'blue' },
                { label: 'Avg Order Value', value: '$234.50', change: '+5.2%', icon: ShoppingCart, color: 'green' },
                { label: 'Conversion Rate', value: '3.8%', change: '+0.4%', icon: Target, color: 'purple' },
                { label: 'Customer Lifetime Value', value: '$1,245', change: '+8.1%', icon: Award, color: 'orange' }
              ].map((kpi, i) => {
                const Icon = kpi.icon;
                return (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-${kpi.color}-100 rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${kpi.color}-600`} />
                      </div>
                      <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {kpi.change}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{kpi.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic to Conversion Funnel */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Journey Funnel</h3>
                <div className="space-y-4">
                  {customerBehavior.map((stage, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{stage.action}</span>
                        <span className="text-sm font-bold text-gray-900">{stage.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${stage.color}`}
                          style={{ width: `${stage.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Trend */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-purple-600" />
                  Revenue Trend
                </h3>
                <div className="h-64 flex items-end justify-around gap-2">
                  {analyticsData.map((data, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t" style={{ height: `${(data.revenue / 25000) * 100}%` }}></div>
                      <span className="text-xs text-gray-600">{data.date}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Total Revenue: <span className="font-bold text-gray-900">$89,180</span></p>
                  <p className="text-sm text-green-600 font-semibold mt-1">↑ 18.5% from previous period</p>
                </div>
              </div>
            </div>

            {/* Device & Geographic Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Traffic by Device</h3>
                <div className="space-y-6">
                  {deviceData.map((device, i) => (
                    <div key={i} className="pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{device.device}</span>
                        <span className="text-lg font-bold text-purple-600">{device.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-gradient-to-r from-purple-600 to-pink-500 h-2 rounded-full"
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div>
                          <p className="text-gray-500">Users</p>
                          <p className="font-semibold text-gray-900">{device.users.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Avg Session</p>
                          <p className="font-semibold text-gray-900">{device.avgSessionTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Bounce Rate</p>
                          <p className="font-semibold text-gray-900">{device.bounceRate}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Top Countries
                </h3>
                <div className="space-y-4">
                  {geographicData.map((geo, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{geo.country}</span>
                          <span className="text-sm font-semibold text-gray-600">${(geo.revenue / 1000).toFixed(1)}K</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            style={{ width: `${geo.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{geo.customers.toLocaleString()} customers</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products Performance */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Views</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Purchases</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Revenue</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Conversion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 font-medium text-gray-900">{product.name}</td>
                        <td className="py-4 px-4 text-gray-600">{product.views.toLocaleString()}</td>
                        <td className="py-4 px-4 font-semibold text-gray-900">{product.purchases}</td>
                        <td className="py-4 px-4 font-bold text-purple-600">${product.revenue.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-semibold text-green-600">
                          {((product.purchases / product.views) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Segments View */}
        {viewType === 'segments' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {segments.map((segment, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">{segment.name}</h4>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Customers</span>
                    <span className="text-2xl font-bold text-purple-600">{segment.customers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="text-2xl font-bold text-green-600">${segment.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Avg Order Value</span>
                    <span className="text-lg font-bold text-gray-900">${segment.avgOrderValue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Return Rate</span>
                    <span className="text-lg font-bold text-orange-600">{segment.returnRate}%</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <p className={`flex items-center gap-1 font-semibold ${segment.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {segment.growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {Math.abs(segment.growth)}% Growth
                  </p>
                </div>

                <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow font-semibold">
                  Manage Segment
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Behavior View */}
        {viewType === 'behavior' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8">Customer Behavior Analysis</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Purchase Patterns</h4>
                <div className="space-y-6">
                  {[
                    { label: 'Peak Purchase Time', value: 'Tuesday 8 PM', detail: '23% of weekly sales' },
                    { label: 'Avg Items per Order', value: '2.3 items', detail: 'Bundle purchases up 15%' },
                    { label: 'Cart Abandonment', value: '52.3%', detail: 'Implement recovery campaign' },
                    { label: 'Repeat Purchase Rate', value: '34.5%', detail: 'Target loyalty programs' }
                  ].map((pattern, i) => (
                    <div key={i} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">{pattern.label}</p>
                      <p className="text-2xl font-bold text-purple-600 mb-2">{pattern.value}</p>
                      <p className="text-sm text-gray-600">{pattern.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6">Engagement Metrics</h4>
                <div className="space-y-6">
                  {[
                    { metric: 'Email Open Rate', value: 38.5, target: 30 },
                    { metric: 'Click-through Rate', value: 12.3, target: 8 },
                    { metric: 'Video Completion Rate', value: 65.8, target: 50 },
                    { metric: 'Page Time on Site', value: 4.5, target: 3, unit: 'min' }
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{item.metric}</span>
                        <span className="text-2xl font-bold text-blue-600">{item.value}{item.unit || '%'}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                          style={{ width: `${Math.min(item.value, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Target: {item.target}{item.unit || '%'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Predictions View */}
        {viewType === 'predictions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {predictions.map((pred, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{pred.metric}</h4>
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </div>

                  <p className="text-2xl font-bold text-purple-600 mb-2">{pred.customers || `${pred.percentage}%` || pred.count}</p>
                  <p className="text-gray-600 text-sm mb-4">{pred.description}</p>

                  <button className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow text-sm font-semibold">
                    {pred.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
