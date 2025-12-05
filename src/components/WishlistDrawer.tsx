import { X, Heart, ShoppingCart, Trash2, Star } from 'lucide-react';
import { Product } from '../App';
import { toast } from 'sonner@2.0.3';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemove: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function WishlistDrawer({ isOpen, onClose, wishlist, onRemove, onAddToCart }: WishlistDrawerProps) {
  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            <h2>Wishlist ({wishlist.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {wishlist.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <Heart className="w-24 h-24 text-gray-300 mb-4" />
            <h3 className="mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Save your favorite items for later!</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlist.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 transition-colors">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1 line-clamp-2">{product.name}</h4>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                        <span className="text-sm text-gray-400">({product.reviews})</span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-purple-600">${product.price}</span>
                        {product.originalPrice && (
                          <>
                            <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded">
                              -{product.discount}%
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-1 text-sm"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => onRemove(product)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {product.stock < 10 && (
                    <div className="mt-3 p-2 bg-orange-50 rounded text-sm text-orange-600">
                      Only {product.stock} left in stock!
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 p-6">
              <button
                onClick={() => {
                  wishlist.forEach(product => handleAddToCart(product));
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add All to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
