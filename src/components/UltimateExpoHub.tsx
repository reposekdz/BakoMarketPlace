import { useState } from 'react';
import { Calendar, MapPin, Users, Video, Star, Trophy, Gift, Play, Zap, TrendingUp, MessageCircle, Share2, Bookmark, Filter, Search, Grid, List, Clock, Award, Sparkles, Eye, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../App';

interface UltimateExpoHubProps {
  onViewProduct: (product: Product) => void;
  user: any;
}

export function UltimateExpoHub({ onViewProduct, user }: UltimateExpoHubProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'past'>('live');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const expos = [
    {
      id: 1,
      name: 'Global Tech Innovation Expo 2025',
      date: 'Jan 15-20, 2025',
      status: 'live',
      attendees: 25430,
      booths: 245,
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      featured: true,
      liveStreams: 12,
      deals: 156,
      rating: 4.9
    },
    {
      id: 2,
      name: 'International Fashion Week',
      date: 'Jan 18-25, 2025',
      status: 'live',
      attendees: 18920,
      booths: 189,
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800',
      featured: true,
      liveStreams: 8,
      deals: 203,
      rating: 4.8
    },
    {
      id: 3,
      name: 'Home & Living Showcase',
      date: 'Feb 1-5, 2025',
      status: 'upcoming',
      attendees: 0,
      booths: 134,
      category: 'Home',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      featured: false,
      liveStreams: 0,
      deals: 89,
      rating: 4.7
    }
  ];

  const liveBooths = [
    {
      id: 1,
      name: 'TechCorp Global',
      booth: 'A-101',
      category: 'Electronics',
      products: 67,
      rating: 4.9,
      viewers: 1234,
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400',
      isLive: true,
      specialOffer: '40% OFF'
    },
    {
      id: 2,
      name: 'Fashion Forward Inc',
      booth: 'B-205',
      category: 'Fashion',
      products: 89,
      rating: 4.8,
      viewers: 892,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      isLive: true,
      specialOffer: 'Buy 2 Get 1'
    },
    {
      id: 3,
      name: 'Smart Home Solutions',
      booth: 'C-312',
      category: 'Home',
      products: 45,
      rating: 4.7,
      viewers: 567,
      image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400',
      isLive: true,
      specialOffer: 'Free Shipping'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center border border-white/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-semibold flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full" />
                LIVE NOW
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-lg text-white rounded-full text-sm font-semibold border border-white/30">
                12 Active Streams
              </span>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Ultimate Online<br />Trade Show Experience
          </h1>
          
          <p className="text-2xl text-white/90 mb-8 max-w-2xl">
            Connect with global suppliers, discover exclusive products, and unlock special expo-only deals
          </p>
          
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3">
              <Play className="w-5 h-5" />
              Join Live Expo
            </button>
            <button className="px-8 py-4 bg-white/20 backdrop-blur-lg text-white rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30 flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              Book Your Booth
            </button>
            <button className="px-8 py-4 bg-white/20 backdrop-blur-lg text-white rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30 flex items-center gap-3">
              <Gift className="w-5 h-5" />
              Exclusive Deals
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-5 gap-8">
            {[
              { icon: Users, value: '25,430', label: 'Live Attendees', color: 'text-purple-600' },
              { icon: Video, value: '245', label: 'Active Booths', color: 'text-pink-600' },
              { icon: ShoppingBag, value: '3,450', label: 'Products', color: 'text-orange-600' },
              { icon: Gift, value: '156', label: 'Exclusive Deals', color: 'text-green-600' },
              { icon: Award, value: '48', label: 'Countries', color: 'text-blue-600' }
            ].map((stat, i) => (
              <div key={i} className="text-center group hover:scale-110 transition-transform">
                <div className={`inline-flex items-center justify-center w-14 h-14 ${stat.color} bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-3 group-hover:shadow-lg transition-shadow`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filters & Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3">
              {[
                { id: 'live', label: 'Live Now', badge: '3', color: 'bg-red-500' },
                { id: 'upcoming', label: 'Upcoming', badge: '12', color: 'bg-blue-500' },
                { id: 'past', label: 'Past Events', badge: '45', color: 'bg-gray-500' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 ${activeTab === tab.id ? 'bg-white/20' : tab.color} text-white rounded-full text-xs`}>
                    {tab.badge}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search expos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 outline-none w-64"
                />
              </div>
              
              <button className="p-2 border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-colors">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex gap-1 border-2 border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expo Grid */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {expos.map((expo) => (
            <div key={expo.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all hover:scale-105 group">
              <div className="relative h-56 overflow-hidden">
                <img src={expo.image} alt={expo.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {expo.status === 'live' && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full font-semibold shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    LIVE
                  </div>
                )}
                
                {expo.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4 fill-white" />
                    Featured
                  </div>
                )}
                
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-purple-600 rounded-full text-sm font-semibold">
                    {expo.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-gray-700" />
                    </button>
                    <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      <Share2 className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{expo.name}</h3>
                
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{expo.date}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <Users className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                    <p className="font-semibold text-gray-900">{expo.attendees.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Attendees</p>
                  </div>
                  <div className="text-center p-2 bg-pink-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-pink-600 mx-auto mb-1" />
                    <p className="font-semibold text-gray-900">{expo.booths}</p>
                    <p className="text-xs text-gray-500">Booths</p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded-lg">
                    <Gift className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                    <p className="font-semibold text-gray-900">{expo.deals}</p>
                    <p className="text-xs text-gray-500">Deals</p>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
                  {expo.status === 'live' ? (
                    <>
                      <Play className="w-5 h-5" />
                      Enter Expo Now
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-5 h-5" />
                      Register Interest
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Booths Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Live Exhibitor Booths</h2>
              <p className="text-gray-600">Browse and interact with exhibitors in real-time</p>
            </div>
            <button className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-colors">
              View All Booths
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {liveBooths.map((booth) => (
              <div key={booth.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all hover:scale-105">
                <div className="relative h-48 overflow-hidden">
                  <img src={booth.image} alt={booth.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-semibold">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </div>
                  
                  <div className="absolute top-4 right-4 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-bold shadow-lg">
                    {booth.specialOffer}
                  </div>
                  
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                    <Eye className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-900">{booth.viewers.toLocaleString()} watching</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{booth.name}</h4>
                      <p className="text-sm text-gray-600">Booth: {booth.booth}</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-lg">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-900">{booth.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full font-medium">{booth.category}</span>
                    <span>{booth.products} products</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <Video className="w-4 h-4" />
                      Visit Booth
                    </button>
                    <button className="px-4 py-3 border-2 border-gray-300 rounded-xl hover:border-purple-600 transition-colors">
                      <MessageCircle className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Offers Banner */}
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl p-10 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-8 h-8" />
                <h3 className="text-3xl font-bold">Expo Exclusive Deals</h3>
              </div>
              <p className="text-xl text-white/90 mb-6 max-w-xl">
                Limited time offers only available during the expo - Don't miss out!
              </p>
              <button className="px-8 py-4 bg-white text-red-600 rounded-xl font-semibold hover:shadow-2xl transition-all hover:scale-105">
                View All Deals
              </button>
            </div>
            <div className="text-right">
              <p className="text-7xl font-bold mb-2">50%</p>
              <p className="text-2xl text-white/90">Avg. Discount</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
