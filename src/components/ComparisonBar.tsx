import { X, ArrowRight } from 'lucide-react';
import { Product } from '../App';

interface ComparisonBarProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
}

export function ComparisonBar({ products, onRemove, onClear }: ComparisonBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-purple-600 shadow-2xl z-40">
      <div className="max-w-[1920px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3>Compare Products ({products.length}/4)</h3>
          </div>
          <button
            onClick={onClear}
            className="text-gray-600 hover:text-red-600 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="relative bg-gray-50 rounded-lg p-4">
              <button
                onClick={() => onRemove(product.id)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow hover:bg-red-50 transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-24 object-cover rounded-lg mb-2"
              />
              <p className="line-clamp-2 mb-2">{product.name}</p>
              <p className="text-purple-600">${product.price}</p>
            </div>
          ))}
          
          {[...Array(4 - products.length)].map((_, i) => (
            <div 
              key={`empty-${i}`}
              className="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300 flex items-center justify-center"
            >
              <p className="text-gray-400">Add product</p>
            </div>
          ))}
        </div>

        {products.length >= 2 && (
          <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
            Compare Now
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
