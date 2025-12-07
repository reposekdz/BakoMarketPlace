import { useState } from 'react';
import { Calendar, MapPin, Users, Video, Mic, MessageCircle, Star, Zap, Trophy, Gift, TrendingUp, Play, BarChart3, Clock, Eye, Maximize2, Phone, Mail, PlusCircle, Settings, Filter, Search, Download, Share2, Award, Briefcase, Target } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Product } from '../App';

interface Expo {
  id: string;
  name: string;
  date: string;
  status: 'live' | 'upcoming' | 'past';
  attendees: number;
  booths: number;
  category: string;
  image: string;
  featured: boolean;
}

interface Booth {
  id: string;
  name: string;
  booth: string;
  products: number;
  rating: number;
  isLive: boolean;
  viewers: number;
  expoId: string;
  contact: string;
  status: 'active' | 'inactive' | 'streaming';
}

interface BoothAnalytics {
  date: string;
  visitors: number;
  engagement: number;
  sales: number;
}

export function AdvancedExpoHub({ onViewProduct, user }: { onViewProduct?: (product: Product) => void; user: any }) {
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'past' | 'my-booth'>('live');
  const [selectedExpo, setSelectedExpo] = useState<string | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);
  const [showBoothSettings, setShowBoothSettings] = useState(false);
  const [viewType, setViewType] = useState<'list' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [streamViewers, setStreamViewers] = useState(1234);

  const [expos, setExpos] = useState<Expo[]>([
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
  ]);

  const [booths, setBooths] = useState<Booth[]>([
    {
      id: '1',
      name: 'TechCorp International',
      booth: 'A-101',
      products: 45,
      rating: 4.9,
      isLive: true,
      viewers: 234,
      expoId: '1',
      contact: 'info@techcorp.com',
      status: 'streaming'
    },
    {
      id: '2',
      name: 'Fashion Forward Inc.',
      booth: 'B-205',
      products: 78,
      rating: 4.8,
      isLive: true,
      viewers: 189,
      expoId: '2',
      contact: 'sales@fashionforward.com',
      status: 'streaming'
    },
    {
      id: '3',
      name: 'HomeStyle Solutions',
      booth: 'C-312',
      products: 56,
      rating: 4.7,
      isLive: false,
      viewers: 0,
      expoId: '2',
      contact: 'contact@homestyle.com',
      status: 'active'
    }
  ]);

  const [boothAnalytics, setBoothAnalytics] = useState<BoothAnalytics[]>([
    { date: 'Mon', visitors: 234, engagement: 45, sales: 2100 },
    { date: 'Tue', visitors: 312, engagement: 52, sales: 3200 },
    { date: 'Wed', visitors: 289, engagement: 48, sales: 2800 },
    { date: 'Thu', visitors: 401, engagement: 61, sales: 4100 },
    { date: 'Fri', visitors: 523, engagement: 73, sales: 5300 },
    { date: 'Sat', visitors: 612, engagement: 82, sales: 6200 },
    { date: 'Sun', viewers: 498, engagement: 71, sales: 4900 }
  ]);

  const handleStartLiveStream = () => {
    setIsLiveStreaming(true);
    toast.success('Live streaming started! Your booth is now visible to attendees.');
  };

  const handleEndLiveStream = () => {
    setIsLiveStreaming(false);
    toast.success('Live stream ended.');
  };

  const handleScheduleMeeting = (boothId: string) => {
    toast.success('Meeting request sent! Waiting for booth operator response.');
  };

  const handleContactBooth = (boothId: string, method: 'email' | 'call') => {
    toast.success(`Sending ${method} contact request...`);
  };

  const filteredExpos = expos.filter(expo => {
    const matchesSearch = expo.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && expo.status === activeTab;
  });

  const currentExpo = expos.find(e => e.id === selectedExpo);
  const boothsInExpo = selectedExpo ? booths.filter(b => b.expoId === selectedExpo) : booths;
  const currentBooth = booths.find(b => b.id === selectedBooth);

  if (selectedBooth && currentBooth) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedBooth(null)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentBooth.name}</h1>
                <p className="text-gray-600 text-sm">Booth {currentBooth.booth}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {currentBooth.isLive && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold">{currentBooth.viewers} watching</span>
                </div>
              )}
              <button className="p-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-3 gap-6">
            {/* Live Stream / Video */}
            <div className="col-span-2">
              <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative">
                {currentBooth.isLive ? (
                  <div className="text-center text-white flex flex-col items-center">
                    <Video className="w-16 h-16 mb-4 opacity-50" />
                    <p>Live Stream Feed</p>
                    <p className="text-sm text-white/60 mt-2">{currentBooth.viewers} viewers</p>
                  </div>
                ) : (
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Booth is offline</p>
                  </div>
                )}
              </div>

              {/* Booth Info Tabs */}
              <div className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200">
                  {['products', 'analytics', 'reviews'].map((tab) => (
                    <button key={tab} className="flex-1 py-4 border-b-2 border-purple-600 text-purple-600 font-semibold">
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                        <div className="bg-gradient-to-br from-blue-400 to-blue-600 h-40"></div>
                        <div className="p-4">
                          <h4 className="font-semibold text-sm text-gray-900">Product Name</h4>
                          <p className="text-purple-600 font-bold mt-2">$299.99</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Booth Details & Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{currentBooth.name}</h4>
                    <p className="text-sm text-gray-600">Booth {currentBooth.booth}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Products</span>
                    <span className="font-semibold">{currentBooth.products}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(currentBooth.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">{currentBooth.rating}</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow font-semibold mb-3">
                  Schedule Meeting
                </button>
                <button className="w-full py-3 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 font-semibold flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Call
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Booth Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentBooth.isLive ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {currentBooth.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Live Viewers</span>
                    <span className="font-semibold">{currentBooth.viewers}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                <h4 className="font-semibold text-blue-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <a href={`mailto:${currentBooth.contact}`} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                    <Mail className="w-4 h-4" />
                    {currentBooth.contact}
                  </a>
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 py-16">
        <div className="max-w-7xl mx-auto px-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8" />
            <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">Advanced Trading Hub</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Global Online Expos & Booth Management</h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Connect with global suppliers, manage your virtual booth, stream live products, and grow your B2B network
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Navigation & Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-4">
            {['all', 'live', 'upcoming', 'past', 'my-booth'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-600'
                }`}
              >
                {tab.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search expos..."
                className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none w-80"
              />
            </div>

            <div className="flex items-center gap-2 bg-white border-2 border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewType('grid')}
                className={`p-2 rounded ${viewType === 'grid' ? 'bg-gray-100' : ''}`}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewType('list')}
                className={`p-2 rounded ${viewType === 'list' ? 'bg-gray-100' : ''}`}
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Expos Grid */}
        {!selectedExpo ? (
          <div className={`grid gap-6 ${viewType === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredExpos.map((expo) => (
              <div
                key={expo.id}
                onClick={() => setSelectedExpo(expo.id)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="relative overflow-hidden h-48 bg-gray-200">
                  <img src={expo.image} alt={expo.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  {expo.status === 'live' && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-full animate-pulse">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      <span className="text-sm font-bold">LIVE</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{expo.name}</h3>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {expo.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {expo.attendees.toLocaleString()} attendees • {expo.booths} booths
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                    <span className="text-xs font-semibold text-gray-500 uppercase">{expo.category}</span>
                    {expo.featured && (
                      <Award className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>

                  <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow font-semibold">
                    {expo.status === 'live' ? 'Join Now' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Expo Detail View */
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedExpo(null)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  ← Back
                </button>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{currentExpo?.name}</h2>
                  <p className="text-gray-600">{currentExpo?.date}</p>
                </div>
              </div>

              {currentExpo?.status === 'live' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold">{currentExpo?.attendees.toLocaleString()} watching</span>
                </div>
              )}
            </div>

            {/* Booths List */}
            <div className="space-y-4">
              {boothsInExpo.map((booth) => (
                <div
                  key={booth.id}
                  onClick={() => setSelectedBooth(booth.id)}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">{booth.name}</h4>
                        {booth.isLive && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full">
                            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
                            <span className="text-xs font-semibold">LIVE</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-6 text-sm text-gray-600">
                        <span>Booth {booth.booth}</span>
                        <span>Products: {booth.products}</span>
                        {booth.isLive && <span>Viewers: {booth.viewers}</span>}
                      </div>

                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(booth.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-xs text-gray-600 ml-2">{booth.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleScheduleMeeting(booth.id);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow text-sm font-semibold"
                      >
                        Schedule Meeting
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContactBooth(booth.id, 'call');
                        }}
                        className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Phone className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
