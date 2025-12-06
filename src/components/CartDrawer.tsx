import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Gift, Tag } from 'lucide-react';
import { Product } from '../App';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Array<Product & { quantity: number }>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  currency: string;
}

export function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, currency }: CartDrawerProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '¥';

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
            <ShoppingBag className="w-6 h-6 text-purple-600" />
            <h2>Shopping Cart ({cart.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag className="w-24 h-24 text-gray-300 mb-4" />
            <h3 className="mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-white">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 line-clamp-2">{item.name}</h4>
                    <p className="text-gray-600 mb-2">{currencySymbol}{item.price}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 border border-gray-300 rounded hover:bg-white transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 border border-gray-300 rounded hover:bg-white transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 0)}
                        className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="mb-3">Recommended for you</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-3 hover:border-purple-500 transition-colors cursor-pointer">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-2"></div>
                      <p className="text-sm line-clamp-2 mb-1">Recommended Product {i}</p>
                      <p className="text-purple-600">$49.99</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <Tag className="w-5 h-5 text-purple-600" />
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 bg-transparent outline-none"
                />
                <button className="px-4 py-1 bg-purple-600 text-white rounded">
                  Apply
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `${currencySymbol}${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{currencySymbol}{tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span>Total</span>
                  <span className="text-purple-600">{currencySymbol}{total.toFixed(2)}</span>
                </div>
              </div>

              {subtotal < 100 && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-sm">
                  <Gift className="w-4 h-4 text-green-600" />
                  <span className="text-green-800">
                    Add {currencySymbol}{(100 - subtotal).toFixed(2)} more for free shipping!
                  </span>
                </div>
              )}

              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}