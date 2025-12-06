import { ArrowLeft, Heart, Share2, ShoppingCart, Star, Award, Truck, Shield, RotateCcw, Gift, MapPin, Plus, Minus, Eye, GitCompare, TrendingUp, ChevronRight, MessageCircle, ThumbsUp, Camera, Bell, Package, CreditCard, Zap } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../App';
import { toast } from 'sonner@2.0.3';
import { ProductReviews } from './ProductReviews';
import { ProductQA } from './ProductQA';
import { ProductSpecifications } from './ProductSpecifications';
import { FrequentlyBought } from './FrequentlyBought';
import { PriceHistory } from './PriceHistory';

interface FullProductPageProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  onAddToComparison: (product: Product) => void;
  isInWishlist: boolean;
  onViewProduct: (product: Product) => void;
}

const mockProduct: Product = {
  id: '1',
  name: 'Premium Ultrabook Pro 15" - Professional Grade Laptop',
  price: 1299,
  originalPrice: 1599,
  rating: 4.8,
  reviews: 2847,
  image: 'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjQ5NDcyNzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  images: [
    'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjQ5NDcyNzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjQ5NDcyNzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjQ5NDcyNzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjQ5NDcyNzR8MA&ixlib=rb-4.1.0&q=80&w=1080'
  ],
  category: 'computers',
  brand: 'TechPro',
  seller: {
    name: 'TechGlobal Store',
    verified: true,
    rating: 4.9,
    followers: 125000,
    products: 450
  },
  stock: 45,
  features: [
    'Intel Core i7 12th Generation Processor',
    '16GB DDR5 RAM',
    '512GB NVMe SSD Storage',
    '15.6" 4K UHD Display with 100% sRGB',
    'NVIDIA GeForce RTX 3050 Ti Graphics',
    'Thunderbolt 4 Ports',
    'Wi-Fi 6E & Bluetooth 5.2',
    'Backlit Keyboard with Fingerprint Reader'
  ],
  discount: 19,
  badges: ['Best Seller', 'Fast Shipping', 'Premium Quality'],
  specifications: {
    'Processor': 'Intel Core i7-12700H',
    'RAM': '16GB DDR5',
    'Storage': '512GB NVMe SSD',
    'Display': '15.6" 4K UHD (3840x2160)',
    'Graphics': 'NVIDIA GeForce RTX 3050 Ti 4GB',
    'Operating System': 'Windows 11 Pro',
    'Battery': '80Wh, up to 10 hours',
    'Weight': '1.8 kg',
    'Connectivity': 'Wi-Fi 6E, Bluetooth 5.2',
    'Ports': '2x Thunderbolt 4, 2x USB 3.2, HDMI 2.1, SD Card Reader'
  },
  description: 'Experience ultimate performance with the Premium Ultrabook Pro 15". Designed for professionals and power users, this laptop combines cutting-edge technology with sleek design. Whether you\'re editing videos, running complex simulations, or managing multiple tasks, the powerful Intel Core i7 processor and NVIDIA graphics ensure smooth performance.',
  variations: {
    colors: ['Space Gray', 'Silver', 'Rose Gold'],
    sizes: ['256GB', '512GB', '1TB']
  },
  shippingInfo: {
    free: true,
    estimatedDays: '2-3',
    countries: ['US', 'UK', 'CA', 'AU', 'DE', 'FR']
  },
  warranty: '2 Year Manufacturer Warranty + 1 Year Extended',
  returnPolicy: '30-day hassle-free returns'
};

export function FullProductPage({
  productId,
  onBack,
  onAddToCart,
  onToggleWishlist,
  onAddToComparison,
  isInWishlist,
  onViewProduct
}: FullProductPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'qa' | 'specs'>('overview');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(mockProduct.variations?.colors?.[0] || '');
  const [selectedStorage, setSelectedStorage] = useState(mockProduct.variations?.sizes?.[0] || '');
  const [isZoomed, setIsZoomed] = useState(false);
  const [showStockAlert, setShowStockAlert] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(mockProduct, quantity);
    toast.success(`${quantity}x ${mockProduct.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    onToggleWishlist(mockProduct);
    toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleBuyNow = () => {
    onAddToCart(mockProduct, quantity);
    toast.success('Proceeding to checkout...');
  };

  return (
    <div className="max-w-[1920px] mx-auto">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>
      </div>

      {/* Product Main Section */}
      <div className="bg-white p-8 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-8">
          {/* Image Gallery */}
          <div className="col-span-5">
            <div className="sticky top-24">
              {/* Main Image */}
              <div 
                className="aspect-square rounded-2xl overflow-hidden bg-gray-100 mb-4 relative cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={mockProduct.images![selectedImage]}
                  alt={mockProduct.name}
                  className={`w-full h-full object-cover transition-transform ${isZoomed ? 'scale-150' : 'scale-100'}`}
                />
                {mockProduct.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full">
                    -{mockProduct.discount}% OFF
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWishlist();
                    }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-pink-500 text-pink-500' : 'text-gray-600'}`} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {mockProduct.images!.map((image, index) => (
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

              {/* 360 View & AR Preview */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                  <Eye className="w-5 h-5" />
                  <span>360° View</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                  <Camera className="w-5 h-5" />
                  <span>AR Preview</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-span-7">
            {/* Title & Rating */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {mockProduct.badges?.map((badge, index) => (
                  <span key={index} className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {badge}
                  </span>
                ))}
              </div>
              
              <h1 className="mb-3">{mockProduct.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(mockProduct.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span>{mockProduct.rating}</span>
                </div>
                <span className="text-gray-400">|</span>
                <button className="text-purple-600 hover:underline">
                  {mockProduct.reviews.toLocaleString()} Reviews
                </button>
                <span className="text-gray-400">|</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span>3.2k views (24h)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-gray-600">Brand:</span>
                <button className="text-purple-600 hover:underline">{mockProduct.brand}</button>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-600">SKU: LPT-15-PRO-001</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-purple-600">${mockProduct.price}</span>
                {mockProduct.originalPrice && (
                  <>
                    <span className="text-gray-400 line-through">${mockProduct.originalPrice}</span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full">
                      Save ${mockProduct.originalPrice - mockProduct.price} ({mockProduct.discount}%)
                    </span>
                  </>
                )}
              </div>

              <PriceHistory currentPrice={mockProduct.price} />

              {/* Installment Option */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg mt-4">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm">Pay in 4 interest-free installments of <span className="font-semibold">${(mockProduct.price / 4).toFixed(2)}</span></p>
                  <button className="text-xs text-blue-600 hover:underline">Learn more</button>
                </div>
              </div>
            </div>

            {/* Variations */}
            {mockProduct.variations?.colors && (
              <div className="mb-6">
                <label className="block mb-3">Color: <span className="text-purple-600">{selectedColor}</span></label>
                <div className="flex gap-3">
                  {mockProduct.variations.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all ${
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

            {mockProduct.variations?.sizes && (
              <div className="mb-6">
                <label className="block mb-3">Storage: <span className="text-purple-600">{selectedStorage}</span></label>
                <div className="flex gap-3">
                  {mockProduct.variations.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedStorage(size)}
                      className={`px-6 py-3 rounded-lg border-2 transition-all ${
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

            {/* Quantity & Stock */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label>Quantity:</label>
                <div className="flex items-center gap-2">
                  {mockProduct.stock < 20 && (
                    <span className="text-orange-600 text-sm flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      Only {mockProduct.stock} left in stock!
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(mockProduct.stock, parseInt(e.target.value) || 1)))}
                    className="w-20 text-center border-x-2 border-gray-300 h-12 outline-none"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(mockProduct.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => setShowStockAlert(true)}
                  className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notify when available</span>
                </button>
              </div>

              {/* Bulk Order */}
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Bulk Order Discount:</span> Buy 10+ and save 5% extra!
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 border-2 border-purple-600 text-purple-600 rounded-xl hover:bg-purple-50 transition-colors"
              >
                Buy Now
              </button>
              <button
                onClick={() => {
                  onAddToComparison(mockProduct);
                  toast.success('Added to comparison!');
                }}
                className="px-6 py-4 border-2 border-gray-300 rounded-xl hover:border-purple-600 hover:text-purple-600 transition-colors"
              >
                <GitCompare className="w-5 h-5" />
              </button>
            </div>

            {/* Seller Info */}
            <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white">
                    TG
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{mockProduct.seller.name}</h4>
                      {mockProduct.seller.verified && (
                        <Award className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{mockProduct.seller.rating} seller rating</span>
                      <span>•</span>
                      <span>{mockProduct.seller.followers?.toLocaleString()} followers</span>
                    </div>
                  </div>
                </div>
                <button className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                  Visit Store
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
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
                  <p className="text-purple-600">{mockProduct.seller.products}</p>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Truck className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-600">Delivery in {mockProduct.shippingInfo?.estimatedDays} days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-600">100% protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <RotateCcw className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="text-sm">{mockProduct.returnPolicy}</p>
                  <p className="text-xs text-gray-600">No questions asked</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                <Gift className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="text-sm">{mockProduct.warranty}</p>
                  <p className="text-xs text-gray-600">Full coverage</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Bought Together */}
      <FrequentlyBought onViewProduct={onViewProduct} />

      {/* Tabs Section */}
      <div className="bg-white">
        <div className="border-b border-gray-200 px-8">
          <div className="flex gap-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'reviews', label: `Reviews (${mockProduct.reviews})` },
              { id: 'qa', label: 'Q&A' },
              { id: 'specs', label: 'Specifications' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 border-b-2 transition-colors ${
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

        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="max-w-4xl">
              <h3 className="mb-4">Product Description</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{mockProduct.description}</p>
              
              <h3 className="mb-4">Key Features</h3>
              <ul className="grid grid-cols-2 gap-4 mb-6">
                {mockProduct.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mb-4">What's in the Box</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 1x Premium Ultrabook Pro 15"</li>
                <li>• 1x 100W USB-C Power Adapter</li>
                <li>• 1x USB-C to USB-C Cable</li>
                <li>• User Manual & Warranty Card</li>
                <li>• Premium Carrying Case</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && <ProductReviews />}
          {activeTab === 'qa' && <ProductQA />}
          {activeTab === 'specs' && <ProductSpecifications specs={mockProduct.specifications!} />}
        </div>
      </div>
    </div>
  );
}