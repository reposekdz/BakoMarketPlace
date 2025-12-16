import { ArrowLeft, Heart, Share2, ShoppingCart, Star, Award, Truck, Shield, RotateCcw, Gift, MapPin, Plus, Minus, Eye, GitCompare, TrendingUp, ChevronRight, MessageCircle, ThumbsUp, Camera, Bell, Package, CreditCard, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Product } from '../App';
import { toast } from 'sonner@2.0.3';
import { ProductReviews } from './ProductReviews';
import { ProductQA } from './ProductQA';
import { ProductSpecifications } from './ProductSpecifications';
import { FrequentlyBought } from './FrequentlyBought';
import { PriceHistory } from './PriceHistory';
import { SellerCommunication } from './SellerCommunication';

interface FullProductPageProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  onAddToComparison: (product: Product) => void;
  isInWishlist: boolean;
  onViewProduct: (product: Product) => void;
  user?: any;
}

export function FullProductPage({
  productId,
  onBack,
  onAddToCart,
  onToggleWishlist,
  onAddToComparison,
  isInWishlist,
  onViewProduct,
  user
}: FullProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'qa' | 'specs'>('overview');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.variations?.colors?.[0] || '');
  const [selectedStorage, setSelectedStorage] = useState(product?.variations?.sizes?.[0] || '');
  const [isZoomed, setIsZoomed] = useState(false);
  const [showStockAlert, setShowStockAlert] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        const data = await response.json();
        setProduct(data);
        setSelectedColor(data.variations?.colors?.[0] || '');
        setSelectedStorage(data.variations?.sizes?.[0] || '');
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    toast.success(`${quantity}x ${product.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    onToggleWishlist(product);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity);
    toast.success('Proceeding to checkout...');
  };

  return (
    <div className="max-w-[1920px] mx-auto">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back to Products</span>
        </button>
      </div>

      <div className="bg-white p-4 sm:p-8 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div className="sticky top-24">
              <div 
                className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 relative cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={product.images![selectedImage]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform ${isZoomed ? 'scale-150' : 'scale-100'}`}
                />
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-base">
                    -{product.discount}% OFF
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWishlist();
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist ? 'fill-pink-500 text-pink-500' : 'text-gray-600'}`} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {product.images!.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-purple-600 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                <button className="flex items-center justify-center gap-2 py-2 sm:py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-xs sm:text-base">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>360° View</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2 sm:py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-xs sm:text-base">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>AR Preview</span>
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {product.badges?.map((badge, index) => (
                  <span key={index} className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs sm:text-sm flex items-center gap-1">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    {badge}
                  </span>
                ))}
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl mb-3">{product.name}</h1>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 text-xs sm:text-base">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span>{product.rating}</span>
                </div>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <button className="text-purple-600 hover:underline">
                  {product.reviews.toLocaleString()} Reviews
                </button>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>3.2k views (24h)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4 text-xs sm:text-sm">
                <span className="text-gray-600">Brand:</span>
                <button className="text-purple-600 hover:underline">{product.brand}</button>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">SKU: {product.id}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mb-6">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-4 mb-4">
                <span className="text-purple-600 text-2xl sm:text-3xl">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-gray-400 line-through text-lg sm:text-xl">${product.originalPrice}</span>
                    <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs sm:text-sm">
                      Save ${product.originalPrice - product.price} ({product.discount}%)
                    </span>
                  </>
                )}
              </div>

              <PriceHistory currentPrice={product.price} />

              <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg mt-4">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <div>
                  <p className="text-xs sm:text-sm">Pay in 4 interest-free installments of <span className="font-semibold">${(product.price / 4).toFixed(2)}</span></p>
                  <button className="text-xs text-blue-600 hover:underline">Learn more</button>
                </div>
              </div>
            </div>

            {product.variations?.colors && (
              <div className="mb-6">
                <label className="block mb-3 text-sm sm:text-base">Color: <span className="text-purple-600">{selectedColor}</span></label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {product.variations.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-2 transition-all text-xs sm:text-base ${
                        selectedColor === color
                          ? 'border-purple-600 bg-purple-50 text-purple-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.variations?.sizes && (
              <div className="mb-6">
                <label className="block mb-3 text-sm sm:text-base">Storage: <span className="text-purple-600">{selectedStorage}</span></label>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {product.variations.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedStorage(size)}
                      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg border-2 transition-all text-xs sm:text-base ${
                        selectedStorage === size
                          ? 'border-purple-600 bg-purple-50 text-purple-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm sm:text-base">Quantity:</label>
                <div className="flex items-center gap-2">
                  {product.stock < 20 && (
                    <span className="text-orange-600 text-xs sm:text-sm flex items-center gap-1">
                      <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                      Only {product.stock} left in stock!
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-16 sm:w-20 text-center border-x-2 border-gray-300 h-10 sm:h-12 outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                <button
                  onClick={() => setShowStockAlert(true)}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-xs sm:text-base"
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Notify when available</span>
                </button>
              </div>

              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-xs sm:text-sm text-green-800">
                  <span className="font-semibold">Bulk Order Discount:</span> Buy 10+ and save 5% extra!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 sm:py-4 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors text-sm sm:text-base"
              >
                Buy Now
              </button>
              <button
                onClick={() => {
                  onAddToComparison(product);
                  toast.success('Added to comparison!');
                }}
                className="px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 rounded-xl hover:border-purple-600 hover:text-purple-600 transition-colors"
              >
                <GitCompare className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                <div className="flex items-center gap-3 mb-4 sm:mb-0">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white text-lg sm:text-2xl">
                    {product.seller.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base sm:text-lg">{product.seller.name}</h4>
                      {product.seller.verified && (
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      <span>{product.seller.rating} seller rating</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{product.seller.followers?.toLocaleString()} followers</span>
                    </div>
                  </div>
                </div>
                <button className="px-3 sm:px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-xs sm:text-base">
                  Visit Store
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Response Time</p>
                  <p className="text-purple-600">&lt; 2 hours</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Ship on Time</p>
                  <p className="text-purple-600">98.7%</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Total Products</p>
                  <p className="text-purple-600">{product.seller.products}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50 rounded-lg">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                <div>
                  <p className="text-xs sm:text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-600">Delivery in {product.shippingInfo?.estimatedDays} days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                <div>
                  <p className="text-xs sm:text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-600">100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-purple-50 rounded-lg">
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                <div>
                  <p className="text-xs sm:text-sm">{product.returnPolicy}</p>
                  <p className="text-xs text-gray-600">No questions asked</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 sm:p-4 bg-orange-50 rounded-lg">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                <div>
                  <p className="text-xs sm:text-sm">{product.warranty}</p>
                  <p className="text-xs text-gray-600">Full coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FrequentlyBought onViewProduct={onViewProduct} />

      <div className="bg-white">
        <div className="border-b border-gray-200 px-4 sm:px-8">
          <div className="flex flex-wrap gap-4 sm:gap-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'reviews', label: `Reviews (${product.reviews})` },
              { id: 'qa', label: 'Q&A' },
              { id: 'specs', label: 'Specifications' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 sm:py-4 border-b-2 transition-colors text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-8">
          {activeTab === 'overview' && (
            <div className="max-w-4xl">
              <h3 className="mb-4 text-lg sm:text-xl">Product Description</h3>
              <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">{product.description}</p>
              
              <h3 className="mb-4 text-lg sm:text-xl">Key Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mb-4 text-lg sm:text-xl">What's in the Box</h3>
              <ul className="space-y-2 text-gray-600 text-sm sm:text-base">
                <li>• 1x {product.name}</li>
                <li>• 1x 100W USB-C Power Adapter</li>
                <li>• 1x USB-C to USB-C Cable</li>
                <li>• User Manual & Warranty Card</li>
                <li>• Premium Carrying Case</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && <ProductReviews />}
          {activeTab === 'qa' && <ProductQA />}
          {activeTab === 'specs' && <ProductSpecifications specs={product.specifications!} />}
        </div>
      </div>

      {user && (
        <SellerCommunication 
          seller={product.seller}
          productName={product.name}
        />
      )}
    </div>
  );
}
