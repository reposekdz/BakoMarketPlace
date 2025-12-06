import { Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../App';
import { useState } from 'react';

interface FrequentlyBoughtProps {
  onViewProduct: (product: Product) => void;
}

const bundleProducts: Product[] = [
  {
    id: 'bundle-1',
    name: 'Premium Laptop Sleeve',
    price: 49,
    rating: 4.7,
    reviews: 543,
    image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=300',
    category: 'accessories',
    seller: { name: 'AccessoryPro', verified: true, rating: 4.8 },
    stock: 200,
    features: []
  },
  {
    id: 'bundle-2',
    name: 'Wireless Mouse Pro',
    price: 39,
    rating: 4.8,
    reviews: 876,
    image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=300',
    category: 'accessories',
    seller: { name: 'TechGear', verified: true, rating: 4.9 },
    stock: 150,
    features: []
  },
  {
    id: 'bundle-3',
    name: 'USB-C Hub 7-in-1',
    price: 59,
    rating: 4.6,
    reviews: 432,
    image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=300',
    category: 'accessories',
    seller: { name: 'HubMaster', verified: true, rating: 4.7 },
    stock: 180,
    features: []
  }
];

export function FrequentlyBought({ onViewProduct }: FrequentlyBoughtProps) {
  const [selected, setSelected] = useState<string[]>(['bundle-1', 'bundle-2']);

  const toggleSelection = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const totalPrice = bundleProducts
    .filter(p => selected.includes(p.id))
    .reduce((sum, p) => sum + p.price, 1299);

  const totalDiscount = 1299 + 147 - totalPrice;

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 border-y border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h3 className="mb-2">Frequently Bought Together</h3>
          <p className="text-gray-600">Save when you buy these items together</p>
        </div>

        <div className="grid grid-cols-5 gap-4 items-center">
          {/* Main Product */}
          <div className="col-span-1 bg-white rounded-xl p-4 border-2 border-green-500 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white rounded-full text-xs whitespace-nowrap">
              Main Item
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
              <img 
                src="https://images.unsplash.com/photo-1759668358660-0d06064f0f84?w=300"
                alt="Main product"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm mb-2 line-clamp-2">Premium Ultrabook Pro 15"</p>
            <p className="text-purple-600">$1,299</p>
          </div>

          <div className="flex items-center justify-center">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>

          {/* Bundle Products */}
          {bundleProducts.map((product, index) => (
            <div key={product.id} className="flex items-center gap-4">
              <div 
                onClick={() => toggleSelection(product.id)}
                className={`flex-1 bg-white rounded-xl p-4 border-2 cursor-pointer transition-all ${
                  selected.includes(product.id)
                    ? 'border-purple-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => toggleSelection(product.id)}
                    className="w-5 h-5 accent-purple-600"
                  />
                  <span className="text-sm text-gray-600">Add item</span>
                </div>
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm mb-2 line-clamp-2">{product.name}</p>
                <p className="text-purple-600">${product.price}</p>
              </div>
              
              {index < bundleProducts.length - 1 && (
                <Plus className="w-6 h-6 text-gray-400" />
              )}
            </div>
          ))}
        </div>

        {/* Bundle Summary */}
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl p-6 border-2 border-purple-200">
          <div>
            <p className="text-gray-600 mb-1">Total Price for {selected.length + 1} items:</p>
            <div className="flex items-baseline gap-3">
              <span className="text-purple-600">${totalPrice}</span>
              <span className="text-gray-400 line-through">${totalPrice + 147}</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Save ${totalDiscount}
              </span>
            </div>
          </div>
          <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg transition-shadow flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Add Selected to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
