import { useState } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Video,
  Mic,
  MessageCircle,
  Star,
  Trophy,
  Gift,
  Play,
  Download,
  Share2,
  Bookmark,
  Award,
  Zap,
  Globe,
  Clock,
  Filter,
  Grid,
  List,
  Phone,
  Mail,
  ExternalLink,
  Camera,
  Maximize2,
  ThumbsUp,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { Product } from '../App';

interface EnhancedExpoProps {
  onViewProduct: (product: Product) => void;
  user: any;
}

export function EnhancedExpo({ onViewProduct, user }: EnhancedExpoProps) {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'past' | 'networking'>('live');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);
  const [bookmarkedBooths, setBookmarkedBooths] = useState<string[]>([]);
  const [collectedStamps, setCollectedStamps] = useState<string[]>([]);

  const expos = [
    {
      id: '1',
      name: 'Global Tech & Innovation Summit 2026',
      date: 'Jan 10-14, 2026',
      status: 'live',
      attendees: 25847,
      booths: 312,
      category: 'Technology',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      featured: true,
      liveStreams: 45,
      networking: true,
      vr360: true,
    },
    {
      id: '2',
      name: 'International Fashion & Lifestyle Expo',
      date: 'Jan 12-16, 2026',
      status: 'live',
      attendees: 18923,
      booths: 245,
      category: 'Fashion',
      image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800',
      featured: true,
      liveStreams: 32,
      networking: true,
      vr360: true,
    },
    {
      id: '3',
      name: 'Home & Garden Trade Show',
      date: 'Jan 20-24, 2026',
      status: 'upcoming',
      attendees: 0,
      booths: 156,
      category: 'Home & Living',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      featured: false,
      liveStreams: 0,
      networking: true,
      vr360: true,
    },
  ];

  const exhibitors = [
    {
      id: '1',
      name: 'TechCorp Global',
      booth: 'A-101',
      category: 'Electronics',
      products: 156,
      rating: 4.9,
      isLive: true,
      viewers: 1247,
      hasDemo: true,
      has360: true,
      country: 'USA',
      description: 'Leading technology manufacturer specializing in smart devices',
      specialOffers: '30% Off Selected Items',
    },
    {
      id: '2',
      name: 'Fashion Forward Inc.',
      booth: 'B-205',
      category: 'Fashion',
      products: 289,
      rating: 4.8,
      isLive: true,
      viewers: 892,
      hasDemo: true,
      has360: true,
      country: 'Italy',
      description: 'Premium fashion brand with sustainable practices',
      specialOffers: 'Buy 2 Get 1 Free',
    },
    {
      id: '3',
      name: 'HomeStyle Pro',
      booth: 'C-312',
      category: 'Home',
      products: 203,
      rating: 4.7,
      isLive: false,
      viewers: 0,
      hasDemo: false,
      has360: true,
      country: 'China',
      description: 'Innovative home and living solutions',
      specialOffers: 'Free Shipping Worldwide',
    },
  ];

  const networkingLounge = [
    {
      id: '1',
      name: 'Buyer-Seller Meetup',
      participants: 234,
      topic: 'B2B Opportunities in Tech',
      time: 'Now',
      type: 'video',
    },
    {
      id: '2',
      name: 'Product Launch Session',
      participants: 456,
      topic: 'New Innovation Showcase',
      time: 'In 30 mins',
      type: 'livestream',
    },
    {
      id: '3',
      name: '1-on-1 Speed Networking',
      participants: 89,
      topic: 'Connect with Global Suppliers',
      time: 'In 1 hour',
      type: 'meeting',
    },
  ];

  const toggleBookmark = (boothId: string) => {
    setBookmarkedBooths((prev) =>
      prev.includes(boothId) ? prev.filter((id) => id !== boothId) : [...prev, boothId]
    );
  };

  const collectStamp = (boothId: string) => {
    if (!collectedStamps.includes(boothId)) {
      setCollectedStamps([...collectedStamps, boothId]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 py-20">
        <div className="max-w-7xl mx-auto px-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                Live Now
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                25,847 Attendees Online
              </span>
            </div>
          </div>
          <h1 className="text-white mb-4">Virtual Trade Shows & Exhibitions</h1>
          <p className="text-2xl text-white/90 mb-8 max-w-3xl">
            Experience immersive 360° virtual booths, connect with global suppliers, and discover exclusive trade show deals
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-xl hover:shadow-2xl transition-shadow flex items-center gap-2">
              <Play className="w-5 h-5" />
              Enter Expo Hall
            </button>
            <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              View Schedule
            </button>
            <button className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Catalog
            </button>
          </div>
        </div>
      </div>

      {/* Gamification Stats */}
      <div className="max-w-7xl mx-auto px-8 -mt-8">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{collectedStamps.length}/10</p>
                <p className="text-gray-600">Digital Stamps</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{bookmarkedBooths.length}</p>
                <p className="text-gray-600">Saved Booths</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Gift className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">$2,450</p>
                <p className="text-gray-600">Virtual Swag Value</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-gray-600">Network Connections</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2 bg-white rounded-xl p-2 shadow">
            {[
              { id: 'live', label: 'Live Expos', icon: Video },
              { id: 'upcoming', label: 'Upcoming', icon: Calendar },
              { id: 'past', label: 'Past Events', icon: Clock },
              { id: 'networking', label: 'Networking Lounge', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2 bg-white rounded-lg p-1 shadow">
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
            <button className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">Filters</span>
            </button>
          </div>
        </div>

        {/* Networking Lounge */}
        {activeTab === 'networking' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
              <h2 className="text-white mb-4">Networking Lounge</h2>
              <p className="text-white/90 text-lg mb-6">
                Connect with industry professionals, schedule 1-on-1 meetings, and expand your business network
              </p>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-white text-purple-600 rounded-xl hover:shadow-xl transition-shadow">
                  Start Video Chat
                </button>
                <button className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors">
                  Schedule Meeting
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {networkingLounge.map((session) => (
                <div key={session.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      {session.type === 'video' && <Video className="w-6 h-6 text-white" />}
                      {session.type === 'livestream' && <Play className="w-6 h-6 text-white" />}
                      {session.type === 'meeting' && <Users className="w-6 h-6 text-white" />}
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{session.time}</span>
                  </div>
                  <h3 className="mb-2 text-gray-900">{session.name}</h3>
                  <p className="text-gray-600 mb-4">{session.topic}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{session.participants} joined</span>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exhibitor Booths */}
        {activeTab !== 'networking' && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-3 gap-6' : 'space-y-4'}>
            {exhibitors.map((exhibitor) => (
              <div
                key={exhibitor.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-400"></div>
                    {exhibitor.isLive && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white rounded-full flex items-center gap-2 animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="text-sm">Live</span>
                      </div>
                    )}
                    {exhibitor.has360 && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-purple-600 text-white rounded-full flex items-center gap-1">
                        <Maximize2 className="w-4 h-4" />
                        <span className="text-sm">360°</span>
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button
                        onClick={() => toggleBookmark(exhibitor.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors ${
                          bookmarkedBooths.includes(exhibitor.id)
                            ? 'bg-yellow-500 text-white'
                            : 'bg-white/80 text-gray-700'
                        }`}
                      >
                        <Bookmark className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-gray-900 mb-1">{exhibitor.name}</h3>
                        <p className="text-gray-600 text-sm">{exhibitor.booth} • {exhibitor.country}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                        <span className="text-yellow-700">{exhibitor.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{exhibitor.description}</p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{exhibitor.viewers.toLocaleString()} viewing</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>{exhibitor.products} products</span>
                      </div>
                    </div>

                    {exhibitor.specialOffers && (
                      <div className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg mb-4">
                        <p className="text-purple-700 text-sm font-medium flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          {exhibitor.specialOffers}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => collectStamp(exhibitor.id)}
                        className={`flex-1 py-3 rounded-lg transition-all ${
                          collectedStamps.includes(exhibitor.id)
                            ? 'bg-green-500 text-white'
                            : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg'
                        }`}
                      >
                        {collectedStamps.includes(exhibitor.id) ? 'Stamp Collected!' : 'Collect Stamp'}
                      </button>
                      <button className="px-4 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                        <Video className="w-5 h-5" />
                      </button>
                      <button className="px-4 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
