import { useState } from 'react';
import { Calendar, MapPin, Users, Video, Mic, MessageCircle, Star, Zap, Trophy, Gift, TrendingUp, Play } from 'lucide-react';
import { Product } from '../App';

interface OnlineExpoProps {
  onViewProduct: (product: Product) => void;
  user: any;
}

export function OnlineExpo({ onViewProduct, user }: OnlineExpoProps) {
  const [activeExpo, setActiveExpo] = useState<'all' | 'live' | 'upcoming' | 'past'>('live');
  const [joinedBooth, setJoinedBooth] = useState<string | null>(null);

  const expos = [
    {
      id: '1',
      name: 'Global Electronics Trade Show 2024',
      date: 'Dec 7-10, 2024',
      status: 'live',
      attendees: 15234,
      booths: 156,
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      featured: true
    },
    {
      id: '2',
      name: 'Fashion & Textile Expo',
      date: 'Dec 8-12, 2024',
      status: 'live',
      attendees: 12456,
      booths: 203,
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800',
      featured: true
    },
    {
      id: '3',
      name: 'Home & Living Showcase',
      date: 'Dec 15-18, 2024',
      status: 'upcoming',
      attendees: 0,
      booths: 89,
      category: 'Home',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      featured: false
    }
  ];

  const exhibitors = [
    {
      id: '1',
      name: 'TechCorp International',
      booth: 'A-101',
      category: 'Electronics',
      products: 45,
      rating: 4.9,
      isLive: true,
      viewers: 234
    },
    {
      id: '2',
      name: 'Fashion Forward Inc.',
      booth: 'B-205',
      category: 'Fashion',
      products: 78,
      rating: 4.8,
      isLive: true,
      viewers: 189
    },
    {
      id: '3',
      name: 'HomeStyle Solutions',
      booth: 'C-312',
      category: 'Home',
      products: 56,
      rating: 4.7,
      isLive: false,
      viewers: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 py-16">
        <div className="max-w-7xl mx-auto px-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full">Live Now</span>
          </div>
          <h1 className="text-white mb-4">Online Trade Show & Expo</h1>
          <p className="text-xl text-white/90 mb-8">
            Connect with global suppliers, discover new products, and grow your business
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-xl hover:shadow-2xl transition-shadow flex items-center gap-2">
              <Play className="w-5 h-5" />
              Join Live Expo
            </button>
            <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Book Your Booth
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 mb-1">156</p>
            <p className="text-gray-600">Active Booths</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 mb-1">15,234</p>
            <p className="text-gray-600">Live Attendees</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 mb-1">2,450</p>
            <p className="text-gray-600">Products Showcased</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600 mb-1">48</p>
            <p className="text-gray-600">Countries</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'all', label: 'All Expos' },
            { id: 'live', label: 'Live Now', badge: '3' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'past', label: 'Past Events' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveExpo(tab.id as any)}
              className={`px-6 py-3 rounded-xl transition-all ${
                activeExpo === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-200 hover:border-purple-500'
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Expo Grid */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {expos.map((expo) => (
            <div key={expo.id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img src={expo.image} alt={expo.name} className="w-full h-full object-cover" />
                {expo.status === 'live' && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-sm">LIVE</span>
                  </div>
                )}
                {expo.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-white rounded-full text-sm flex items-center gap-1">
                    <Star className="w-4 h-4 fill-white" />
                    Featured
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                  {expo.category}
                </span>
                <h3 className="mt-3 mb-2">{expo.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{expo.date}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{expo.attendees.toLocaleString()} attendees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{expo.booths} booths</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                  {expo.status === 'live' ? 'Enter Expo Now' : 'Register Interest'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Exhibitors */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-2">Live Exhibitor Booths</h2>
              <p className="text-gray-600">Browse and interact with exhibitors in real-time</p>
            </div>
            <button className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">
              View All Booths
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {exhibitors.map((exhibitor) => (
              <div key={exhibitor.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center text-white">
                      {exhibitor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="mb-1">{exhibitor.name}</h4>
                      <p className="text-sm text-gray-600">Booth: {exhibitor.booth}</p>
                    </div>
                  </div>
                  {exhibitor.isLive && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-600 rounded text-xs">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                      Live
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{exhibitor.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span>{exhibitor.products} products</span>
                  {exhibitor.isLive && (
                    <>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1 text-purple-600">
                        <Users className="w-4 h-4" />
                        <span>{exhibitor.viewers} watching</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                    <Video className="w-4 h-4" />
                    Visit Booth
                  </button>
                  <button className="px-3 py-2 border-2 border-gray-300 rounded-lg hover:border-purple-600 transition-colors">
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Special Offers */}
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-6 h-6" />
                <h3 className="text-white">Expo Exclusive Deals</h3>
              </div>
              <p className="text-white/90 mb-6">
                Limited time offers only available during the expo
              </p>
              <button className="px-6 py-3 bg-white text-red-600 rounded-lg hover:shadow-2xl transition-shadow">
                View All Deals
              </button>
            </div>
            <div className="text-right">
              <p className="text-5xl font-bold mb-2">50%</p>
              <p className="text-white/90">Avg. Discount</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
