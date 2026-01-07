import { useState } from 'react';
import { Bell, TrendingDown, TrendingUp, DollarSign, AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceTrackerProps {
  productId: string;
  currentPrice: number;
  productName: string;
}

export function PriceTracker({ productId, currentPrice, productName }: PriceTrackerProps) {
  const [priceAlert, setPriceAlert] = useState<number | null>(null);
  const [showAlert Dialog, setShowAlertDialog] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');

  // Generate price history data
  const priceHistory = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const variation = (Math.random() - 0.5) * 0.2;
    const price = currentPrice * (1 + variation);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Number(price.toFixed(2)),
    };
  });

  // Calculate price statistics
  const prices = priceHistory.map((p) => p.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const priceTrend = prices[prices.length - 1] > prices[0] ? 'up' : 'down';
  const trendPercentage = (((prices[prices.length - 1] - prices[0]) / prices[0]) * 100).toFixed(1);

  const handleSetAlert = () => {
    const price = parseFloat(targetPrice);
    if (price && price > 0) {
      setPriceAlert(price);
      setShowAlertDialog(false);
      toast.success(`Price alert set! We'll notify you when the price drops to $${price.toFixed(2)}`);
      setTargetPrice('');
    } else {
      toast.error('Please enter a valid price');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-900">Price Tracker</h3>
        <button
          onClick={() => setShowAlertDialog(!showAlertDialog)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center gap-2"
        >
          <Bell className="w-4 h-4" />
          Set Price Alert
        </button>
      </div>

      {/* Price Alert Dialog */}
      {showAlertDialog && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <h4 className="text-gray-900 mb-3">Set Price Alert</h4>
          <p className="text-gray-600 text-sm mb-4">
            We'll notify you when the price drops to your target price
          </p>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="Enter target price"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                step="0.01"
              />
            </div>
            <button
              onClick={handleSetAlert}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Set Alert
            </button>
          </div>
          {priceAlert && (
            <div className="mt-3 p-3 bg-green-100 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-green-700">
                Alert active: You'll be notified when price drops to ${priceAlert.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Price Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <p className="text-blue-600 text-sm mb-1">Current</p>
          <p className="text-2xl font-bold text-blue-700">${currentPrice.toFixed(2)}</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <p className="text-green-600 text-sm mb-1">Lowest</p>
          <p className="text-2xl font-bold text-green-700">${lowestPrice.toFixed(2)}</p>
          <p className="text-green-600 text-xs">30 days</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <p className="text-orange-600 text-sm mb-1">Average</p>
          <p className="text-2xl font-bold text-orange-700">${averagePrice.toFixed(2)}</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <p className="text-purple-600 text-sm mb-1">Trend</p>
          <div className="flex items-center justify-center gap-1">
            {priceTrend === 'up' ? (
              <>
                <TrendingUp className="w-5 h-5 text-red-600" />
                <p className="text-xl font-bold text-red-600">+{trendPercentage}%</p>
              </>
            ) : (
              <>
                <TrendingDown className="w-5 h-5 text-green-600" />
                <p className="text-xl font-bold text-green-600">{trendPercentage}%</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#666" />
            <YAxis tick={{ fontSize: 12 }} stroke="#666" domain={['dataMin - 10', 'dataMax + 10']} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="url(#priceGradient)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#9333ea' }}
            />
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Price Insights */}
      <div className="space-y-3">
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="text-gray-900 mb-1">Price Recommendation</h4>
              <p className="text-gray-600 text-sm">
                {currentPrice < lowestPrice * 1.1
                  ? '🎯 Great deal! Current price is near the 30-day low'
                  : currentPrice > averagePrice
                  ? '⏰ Consider waiting. Price is higher than average'
                  : '✅ Fair price. Close to the 30-day average'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-gray-900 mb-1">Historical Savings</h4>
              <p className="text-gray-600 text-sm">
                If purchased at lowest price, you could save ${(currentPrice - lowestPrice).toFixed(2)} (
                {(((currentPrice - lowestPrice) / currentPrice) * 100).toFixed(1)}%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
