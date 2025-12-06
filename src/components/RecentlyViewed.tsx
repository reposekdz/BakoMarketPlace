import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../App';
import { useRef } from 'react';

interface RecentlyViewedProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
}

export function RecentlyViewed({ products, onViewProduct }: RecentlyViewedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mt-12 bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Eye className="w-6 h-6 text-purple-600" />
          <h3>Recently Viewed</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onViewProduct(product)}
            className="flex-shrink-0 w-48 cursor-pointer group"
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>
            <h4 className="line-clamp-2 mb-2">{product.name}</h4>
            <div className="flex items-center gap-2">
              <span className="text-purple-600">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
