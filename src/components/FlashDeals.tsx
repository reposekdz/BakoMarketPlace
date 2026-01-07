import { Zap, Clock, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from '../App';

interface FlashDealsProps {
  onViewProduct: (product: Product) => void;
}

const flashProducts: Product[] = [
  {
    id: 'flash-1',
    name: 'Premium Wireless Earbuds',
    price: 79,
    originalPrice: 149,
    rating: 4.8,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzY0ODYxMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'electronics',
    seller: { name: 'AudioPro', verified: true, rating: 4.9 },
    stock: 45,
    features: ['ANC', '30hr Battery', 'USB-C'],
    discount: 47,
    badges: ['Flash Deal']
  },
  {
    id: 'flash-2',
    name: 'Smart Watch Pro',
    price: 199,
    originalPrice: 399,
    rating: 4.7,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1719744755507-a4c856c57cf7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwd2VhcmFibGV8ZW58MXx8fHwxNzY0ODQ4ODg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'electronics',
    seller: { name: 'TechGear', verified: true, rating: 4.8 },
    stock: 23,
    features: ['GPS', 'Heart Rate', 'Water Resistant'],
    discount: 50,
    badges: ['Flash Deal']
  },
  {
    id: 'flash-3',
    name: 'Gaming Headset RGB',
    price: 59,
    originalPrice: 119,
    rating: 4.6,
    reviews: 543,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzY0ODYxMzI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'electronics',
    seller: { name: 'GameZone', verified: true, rating: 4.7 },
    stock: 67,
    features: ['7.1 Surround', 'RGB Lighting', 'Noise Cancelling'],
    discount: 50,
    badges: ['Flash Deal']
  },
  {
    id: 'flash-4',
    name: '4K Action Camera',
    price: 149,
    originalPrice: 299,
    rating: 4.9,
    reviews: 432,
    image: 'https://images.unsplash.com/photo-1579535984712-92fffbbaa266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NjQ5MjA3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'electronics',
    seller: { name: 'CamPro', verified: true, rating: 4.9 },
    stock: 34,
    features: ['4K Video', 'Waterproof', 'Image Stabilization'],
    discount: 50,
    badges: ['Flash Deal']
  }
];

export function FlashDeals({ onViewProduct }: FlashDealsProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 23,
    seconds: 45
  });

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
          {flashProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer group"
              onClick={() => onViewProduct(product)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full">
                  -{product.discount}%
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center justify-between text-white text-sm">
                    <span>Only {product.stock} left!</span>
                    <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                      <Zap className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="mb-2 line-clamp-2 min-h-[3rem]">{product.name}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-600">${product.price}</span>
                  <span className="text-gray-400 line-through text-sm">${product.originalPrice}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full transition-all"
                    style={{ width: `${(product.stock / 100) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">Selling fast!</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
