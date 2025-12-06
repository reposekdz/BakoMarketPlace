import { TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface PriceHistoryProps {
  currentPrice: number;
}

export function PriceHistory({ currentPrice }: PriceHistoryProps) {
  const [showChart, setShowChart] = useState(false);

  const priceData = [
    { date: 'Nov 1', price: 1599 },
    { date: 'Nov 15', price: 1499 },
    { date: 'Dec 1', price: 1399 },
    { date: 'Today', price: currentPrice }
  ];

  const lowestPrice = Math.min(...priceData.map(d => d.price));
  const highestPrice = Math.max(...priceData.map(d => d.price));
  const priceChange = ((currentPrice - priceData[0].price) / priceData[0].price) * 100;

  return (
    <div className="border-t border-gray-200 pt-4">
      <button
        onClick={() => setShowChart(!showChart)}
        className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-purple-600 transition-colors"
      >
        <span className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-green-500" />
          Price History
        </span>
        <span className="text-green-600">{priceChange.toFixed(0)}% decrease</span>
      </button>

      {showChart && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4 text-sm">
            <div>
              <p className="text-gray-600">Lowest</p>
              <p className="text-green-600">${lowestPrice}</p>
            </div>
            <div>
              <p className="text-gray-600">Highest</p>
              <p className="text-gray-900">${highestPrice}</p>
            </div>
            <div>
              <p className="text-gray-600">Average</p>
              <p className="text-gray-900">${Math.round((lowestPrice + highestPrice) / 2)}</p>
            </div>
          </div>

          {/* Simple Price Chart */}
          <div className="relative h-24 flex items-end justify-between gap-2">
            {priceData.map((data, index) => {
              const height = ((data.price - lowestPrice) / (highestPrice - lowestPrice)) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex items-end justify-center mb-1">
                    <div
                      className={`w-full rounded-t transition-all ${
                        data.price === currentPrice
                          ? 'bg-gradient-to-t from-purple-600 to-pink-500'
                          : 'bg-gray-300'
                      }`}
                      style={{ height: `${Math.max(height, 20)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 text-center whitespace-nowrap">{data.date}</p>
                  <p className="text-xs text-gray-900">${data.price}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm">
            <p className="text-green-800">
              <TrendingDown className="w-4 h-4 inline mr-1" />
              This product is at its lowest price in the last 30 days!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
