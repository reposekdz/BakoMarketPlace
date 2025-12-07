import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Heart, Share2, Eye, Download, Camera, Video as VideoIcon, Smartphone, Lightbulb, Leaf, Award, Truck, Shield, Calendar, TrendingDown, AlertCircle, CheckCircle, MapPin, Star, MessageCircle, Phone, Mail, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ProductViewerProps {
  product?: any;
}

export function AdvancedProductViewer({ product }: ProductViewerProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [view3D, setView3D] = useState(false);
  const [viewAR, setViewAR] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'compare' | 'sustainability'>('overview');
  const [hasWishlisted, setHasWishlisted] = useState(false);
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  const mockImages = [
    'https://images.unsplash.com/photo-1759668358660-0d06064f0f84?w=800',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
    'https://images.unsplash.com/photo-1559056199-641a0ac8b3f7?w=800',
    'https://images.unsplash.com/photo-1588005300385-e0c50a67f2dc?w=800'
  ];

  const mockVideos = [
    { id: '1', title: 'Product Overview', duration: '2:34', thumbnail: 'https://images.unsplash.com/photo-1575521520904-742f3119e96f?w=200&h=120' },
    { id: '2', title: 'Detailed Features', duration: '5:12', thumbnail: 'https://images.unsplash.com/photo-1520994881114-15aa2341e535?w=200&h=120' },
    { id: '3', title: 'Unboxing & Setup', duration: '3:45', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=120' }
  ];

  const sizeGuide = {
    'Laptop': [
      { size: '13"', weight: '1.2 kg', battery: '10 hrs', processor: 'i5' },
      { size: '15"', weight: '1.8 kg', battery: '10 hrs', processor: 'i7' },
      { size: '17"', weight: '2.1 kg', battery: '8 hrs', processor: 'i9' }
    ]
  };

  const sustainability = {
    recyclable: 85,
    carbonFootprint: '2.3 kg',
    certifications: ['ISO 14001', 'Carbon Trust', 'RoHS Compliant'],
    packaging: 'Biodegradable cardboard and soy ink',
    energyStarRating: 5
  };

  const priceHistory = [
    { date: '30 days ago', price: 1599 },
    { date: '20 days ago', price: 1499 },
    { date: '10 days ago', price: 1399 },
    { date: 'Today', price: 1299 }
  ];

  const inventoryTimeline = [
    { date: 'In Stock Now', quantity: 45, status: 'available' },
    { date: 'Next Restock', quantity: 100, status: 'coming', dateInfo: '5 days' },
    { date: 'Pre-order', quantity: 50, status: 'preorder', dateInfo: '15 days' }
  ];

  const handleMouseZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const container = zoomContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    container.style.transformOrigin = `${x}% ${y}%`;
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 20, 300));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 20, 100));
    if (zoomLevel <= 120) setIsZoomed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600 flex items-center gap-2">
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span>Electronics</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-purple-600 font-semibold">Laptops</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image Gallery & Controls */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image Viewer */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {viewAR ? (
                <div className="relative w-full aspect-square bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <Smartphone className="w-16 h-16 mx-auto mb-4 text-blue-600 opacity-50" />
                    <p className="text-gray-700 font-semibold">AR View Ready</p>
                    <p className="text-sm text-gray-600 mt-2">Point your camera to see this product in your space</p>
                    <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Start AR Experience
                    </button>
                  </div>
                </div>
              ) : view3D ? (
                <div className="relative w-full aspect-square bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-purple-600 opacity-50" />
                    <p className="text-gray-700 font-semibold">3D Model Viewer</p>
                    <p className="text-sm text-gray-600 mt-2">Drag to rotate • Scroll to zoom • Double-click to reset</p>
                    <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Load 3D Model
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  ref={zoomContainerRef}
                  onMouseMove={handleMouseZoom}
                  className="relative w-full aspect-square overflow-hidden cursor-zoom-in bg-white"
                  style={{
                    transform: isZoomed ? `scale(${zoomLevel / 100})` : 'scale(1)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <img
                    src={mockImages[activeImageIndex]}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Image Controls Overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                {!view3D && !viewAR && (
                  <>
                    <button
                      onClick={handleZoomOut}
                      disabled={zoomLevel <= 100}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Zoom out"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <div className="text-sm text-gray-600 min-w-[50px] text-center">{zoomLevel}%</div>
                    <button
                      onClick={handleZoomIn}
                      disabled={zoomLevel >= 300}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Zoom in"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-gray-300"></div>
                  </>
                )}

                <button
                  onClick={() => {
                    setIsZoomed(false);
                    setZoomLevel(100);
                    setView3D(false);
                    setViewAR(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Reset view"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView3D(!view3D)}
                  className={`p-2 rounded-lg transition-colors ${view3D ? 'bg-purple-100' : 'hover:bg-gray-100'}`}
                  title="3D view"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewAR(!viewAR)}
                  className={`p-2 rounded-lg transition-colors ${viewAR ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                  title="AR view"
                >
                  <Smartphone className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 items-center">
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2 overflow-x-auto flex-1">
                {mockImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setIsZoomed(false);
                      setZoomLevel(100);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImageIndex === idx ? 'border-purple-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Video Gallery */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Video Reviews & Tutorials</h4>
              <div className="grid grid-cols-3 gap-3">
                {mockVideos.map((vid) => (
                  <button
                    key={vid.id}
                    onClick={() => setSelectedVideo(vid.id)}
                    className="relative overflow-hidden rounded-lg group cursor-pointer"
                  >
                    <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <VideoIcon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {vid.duration}
                    </div>
                    <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-2 line-clamp-2">
                      {vid.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Specs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Detailed Specifications</h4>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Processor', value: 'Intel Core i7-12700H', icon: '⚙️' },
                  { label: 'RAM', value: '16GB DDR5 5600MHz', icon: '💾' },
                  { label: 'Storage', value: '512GB NVMe SSD', icon: '📀' },
                  { label: 'Display', value: '15.6" 4K UHD OLED', icon: '📺' },
                  { label: 'Graphics', value: 'NVIDIA RTX 3050 Ti 4GB', icon: '🎮' },
                  { label: 'Battery', value: '10 hours', icon: '🔋' }
                ].map((spec, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-2xl">{spec.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">{spec.label}</p>
                      <p className="text-gray-900 font-medium">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Size & Fit Guide */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Size & Fit Guide</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 text-gray-600">Screen Size</th>
                      <th className="text-left py-2 text-gray-600">Weight</th>
                      <th className="text-left py-2 text-gray-600">Battery</th>
                      <th className="text-left py-2 text-gray-600">Processor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeGuide.Laptop.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 text-gray-900 font-medium">{row.size}</td>
                        <td className="py-3 text-gray-600">{row.weight}</td>
                        <td className="py-3 text-gray-600">{row.battery}</td>
                        <td className="py-3 text-gray-600">{row.processor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Price History & Tracking */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Price History & Tracking</h4>
                <button className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  Set Alert
                </button>
              </div>
              <div className="space-y-2">
                {priceHistory.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-sm text-gray-600">{item.date}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">${item.price}</span>
                      {i > 0 && (
                        <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                          <TrendingDown className="w-4 h-4" />
                          ${priceHistory[i - 1].price - item.price}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Inventory & Availability</h4>
              <div className="space-y-4">
                {inventoryTimeline.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      item.status === 'available' ? 'bg-green-500' :
                      item.status === 'coming' ? 'bg-blue-500' : 'bg-orange-500'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.date}</p>
                      {item.dateInfo && <p className="text-sm text-gray-600">{item.dateInfo}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{item.quantity} units</p>
                      <p className={`text-xs font-medium ${
                        item.status === 'available' ? 'text-green-600' :
                        item.status === 'coming' ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {item.status === 'available' ? '✓ In Stock' : 'Coming Soon'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="space-y-4">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Premium Ultrabook Pro 15"</h2>
                <button
                  onClick={() => setHasWishlisted(!hasWishlisted)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Heart className={`w-6 h-6 ${hasWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">4.8 (2,847 reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-purple-600">$1,299</span>
                  <span className="text-lg text-gray-500 line-through">$1,599</span>
                  <span className="text-lg font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">-19%</span>
                </div>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Save $300 with this deal
                </p>
              </div>

              {/* Stock & Shipping */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">In Stock</span>
                  <span className="font-semibold text-green-600">45 units available</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Free Shipping</span>
                  <span className="font-semibold text-gray-900">Worldwide</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-semibold text-gray-900">2-3 days</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow font-bold">
                  Add to Cart
                </button>
                <button className="w-full py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold">
                  Buy Now
                </button>
              </div>

              {/* Seller Info */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">TechGlobal Store</p>
                    <p className="text-xs text-gray-600">Verified Seller ✓</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-600">4.9★</p>
                    <p className="text-xs text-gray-600">125K followers</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-purple-200">
                  <button className="flex-1 py-2 bg-white rounded-lg hover:bg-gray-50 text-sm font-semibold flex items-center justify-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button className="flex-1 py-2 bg-white rounded-lg hover:bg-gray-50 text-sm font-semibold flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                {[
                  { icon: Shield, text: '30-Day Returns', color: 'text-blue-600' },
                  { icon: Truck, text: 'Free Express Shipping', color: 'text-green-600' },
                  { icon: Award, text: '2-Year Warranty', color: 'text-purple-600' }
                ].map((benefit, i) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Icon className={`w-5 h-5 ${benefit.color}`} />
                      <span className="text-sm font-medium text-gray-900">{benefit.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sustainability */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-green-600" />
                <h4 className="text-lg font-semibold text-gray-900">Sustainability</h4>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Recyclable Materials</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{sustainability.recyclable}% of materials</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Carbon Footprint</p>
                  <p className="text-lg font-bold text-gray-900">{sustainability.carbonFootprint}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {sustainability.certifications.map((cert, i) => (
                      <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Seller Status */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                <p className="font-semibold text-blue-900">Live Seller Support</p>
              </div>
              <p className="text-sm text-blue-800 mb-4">Chat with seller in real-time about this product</p>
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Start Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
