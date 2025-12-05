import { X, Star, Heart, ShoppingCart, Truck, Shield, Award, Zap } from 'lucide-react';
import { Product } from '../App';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isInWishlist: boolean;
}

export function QuickViewModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onToggleWishlist,
  isInWishlist 
}: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    toast.success(`${quantity}x ${product.name} added to cart!`);
    onClose();
  };

  const handleToggleWishlist = () => {
    onToggleWishlist(product);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
          <h3>Quick View</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent hover:border-purple-500 cursor-pointer transition-colors"
                  >
                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="mb-2">{product.name}</h2>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span>{product.rating}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{product.reviews.toLocaleString()} reviews</span>
                  </div>
                </div>
                <button
                  onClick={handleToggleWishlist}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                {product.seller.verified && <Award className="w-5 h-5 text-blue-500" />}
                <span className="text-gray-700">{product.seller.name}</span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-600">{product.seller.rating} seller rating</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-purple-600">${product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-gray-400 line-through">${product.originalPrice}</span>
                      <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full">
                        Save {product.discount}%
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">Tax included. Shipping calculated at checkout.</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {product.badges?.map((badge, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {badge}
                  </span>
                ))}
              </div>

              <div className="mb-6">
                <h4 className="mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-500" />
                  <div>
                    <p>Free Shipping</p>
                    <p className="text-sm text-gray-600">Delivery in 2-3 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <div>
                    <p>Secure Payment</p>
                    <p className="text-sm text-gray-600">100% protected</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                  <span className="text-gray-600">{product.stock} available</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
