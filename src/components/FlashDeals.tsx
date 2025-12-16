import { Zap, Clock, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from '../App';
import { convertCurrency, formatCurrency } from '../utils/currency';

interface FlashDealsProps {
  onViewProduct: (product: Product) => void;
  currency: string;
}

export function FlashDeals({ onViewProduct, currency }: FlashDealsProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 23,
    seconds: 45
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        const response = await fetch('/api/products/flash-deals');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching flash deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashDeals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 5;
              minutes = 23;
              seconds = 45;
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-8">
        <div className="max-w-[1920px] mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-7 h-7 text-white fill-white" />
              </div>
              <div>
                <h2 className="text-white">Flash Deals</h2>
                <p className="text-white/90">Limited time offers - Up to 50% OFF</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-8">
      <div className="max-w-[1920px] mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-white">Flash Deals</h2>
              <p className="text-white/90">Limited time offers - Up to 50% OFF</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <Clock className="w-5 h-5 text-white" />
              <span className="text-white">Ends in:</span>
              <div className="flex gap-2">
                <div className="bg-white text-red-600 px-3 py-1 rounded">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-white">:</span>
                <div className="bg-white text-red-600 px-3 py-1 rounded">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-white">:</span>
                <div className="bg-white text-red-600 px-3 py-1 rounded">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
            </div>
            
            <button className="flex items-center gap-2 bg-white text-red-600 px-6 py-2 rounded-lg hover:shadow-lg transition-shadow">
              View All
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => {
            const convertedPrice = convertCurrency(product.price, 'USD', currency);
            const originalPrice = convertCurrency(product.price * (1 + product.discount / 100), 'USD', currency);

            return (
              <div 
                key={product.id}
                className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer group"
                onClick={() => onViewProduct(product)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full">
                    -{product.discount}%
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <div className="flex items-center justify-between text-white text-sm">
                      <span>Only {product.stockQuantity} left!</span>
                      <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h4 className="mb-2 line-clamp-2 min-h-[3rem]">{product.name}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-600">{formatCurrency(convertedPrice, currency)}</span>
                    <span className="text-gray-400 line-through text-sm">{formatCurrency(originalPrice, currency)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all"
                      style={{ width: `${(product.stockQuantity / 100) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">Selling fast!</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
