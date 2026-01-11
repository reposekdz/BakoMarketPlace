import { useState, useRef } from 'react';
import { 
  Calendar,
  MapPin,
  Users,
  Video,
  Mic,
  MessageCircle,
  Star,
  Play,
  Upload,
  Share2,
  Bookmark,
  Camera,
  Maximize2,
  Eye,
  TrendingUp,
  Gift,
  Zap,
  Globe,
  Clock,
  Filter,
  Grid,
  List,
  Phone,
  Mail,
  ExternalLink,
  Plus,
  X,
  Send,
  Heart,
  ThumbsUp,
  Download,
  Settings,
  Award,
  Target,
  Sparkles,
  Radio
} from 'lucide-react';
import { Product } from '../App';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface UltraFunctionalExpoProps {
  onViewProduct: (product: Product) => void;
  user: any;
}

interface ExpoEvent {
  id: string;
  name: string;
  date: string;
  status: 'live' | 'upcoming' | 'past';
  attendees: number;
  booths: number;
  category: string;
  image: string;
  featured: boolean;
  liveStreams: number;
  description: string;
  duration: string;
  organizer: string;
}

interface VirtualBooth {
  id: string;
  exhibitorName: string;
  boothNumber: string;
  category: string;
  products: number;
  rating: number;
  isLive: boolean;
  viewers: number;
  logo: string;
  banner: string;
  description: string;
  productImages: string[];
  videos: string[];
  contacts: {
    email: string;
    phone: string;
    website: string;
  };
}

export function UltraFunctionalExpo({ onViewProduct, user }: UltraFunctionalExpoProps) {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const [activeTab, setActiveTab] = useState<'browse' | 'mybooth' | 'live' | 'join'>('browse');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedExpo, setSelectedExpo] = useState<string | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<VirtualBooth | null>(null);
  const [showCreateBooth, setShowCreateBooth] = useState(false);
  const [isInLiveStream, setIsInLiveStream] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ user: string; message: string; time: string }>>([]);
  const [newMessage, setNewMessage] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const expos: ExpoEvent[] = [
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
      description: 'The largest tech expo of the year featuring cutting-edge innovations',
      duration: '5 days',
      organizer: 'Tech Events Global'
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
      description: 'Discover the latest trends in fashion and lifestyle',
      duration: '5 days',
      organizer: 'Fashion World Events'
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
      description: 'Everything for your home and garden in one place',
      duration: '5 days',
      organizer: 'Home Expo Inc'
    },
  ];

  const virtualBooths: VirtualBooth[] = [
    {
      id: '1',
      exhibitorName: 'TechCorp Global',
      boothNumber: 'A-101',
      category: 'Electronics',
      products: 156,
      rating: 4.9,
      isLive: true,
      viewers: 1247,
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
      banner: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
      description: 'Leading provider of innovative electronic solutions',
      productImages: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300',
      ],
      videos: [],
      contacts: {
        email: 'sales@techcorp.com',
        phone: '+1-555-0123',
        website: 'www.techcorp.com'
      }
    },
    {
      id: '2',
      exhibitorName: 'Fashion House Pro',
      boothNumber: 'B-205',
      category: 'Fashion',
      products: 287,
      rating: 4.8,
      isLive: true,
      viewers: 892,
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
      banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      description: 'Trendsetting fashion and accessories',
      productImages: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300',
      ],
      videos: [],
      contacts: {
        email: 'info@fashionhouse.com',
        phone: '+1-555-0456',
        website: 'www.fashionhouse.com'
      }
    },
  ];

  const [newBoothData, setNewBoothData] = useState({
    exhibitorName: '',
    category: '',
    description: '',
    productImages: [] as string[],
    videos: [] as string[],
    email: '',
    phone: '',
    website: ''
  });

  const handleJoinExpo = (expoId: string) => {
    toast.success('Successfully joined the expo!');
    setSelectedExpo(expoId);
    setActiveTab('browse');
  };

  const handleCreateBooth = () => {
    if (!newBoothData.exhibitorName || !newBoothData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Virtual booth created successfully!');
    setShowCreateBooth(false);
    setActiveTab('mybooth');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setNewBoothData({
        ...newBoothData,
        productImages: [...newBoothData.productImages, ...newImages]
      });
      toast.success(`${files.length} image(s) uploaded successfully`);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newVideos = Array.from(files).map(file => URL.createObjectURL(file));
      setNewBoothData({
        ...newBoothData,
        videos: [...newBoothData.videos, ...newVideos]
      });
      toast.success(`${files.length} video(s) uploaded successfully`);
    }
  };

  const startLiveStream = () => {
    setIsInLiveStream(true);
    toast.success('Live stream started!');
  };

  const endLiveStream = () => {
    setIsInLiveStream(false);
    toast.success('Live stream ended');
  };

  const sendChatMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        user: user?.firstName || 'Guest',
        message: newMessage,
        time: new Date().toLocaleTimeString()
      }
    ]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🎪 Online Expo Center</h1>
              <p className="text-purple-100 text-lg">
                Discover, explore, and connect with exhibitors worldwide
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                <Users className="w-5 h-5 mr-2" />
                {expos.reduce((sum, e) => sum + e.attendees, 0).toLocaleString()} Attendees
              </Badge>
              <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                <Radio className="w-5 h-5 mr-2 animate-pulse" />
                {expos.filter(e => e.status === 'live').length} Live Now
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-xl">
            <TabsTrigger value="browse" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Grid className="w-4 h-4" />
              Browse Expos
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Video className="w-4 h-4" />
              Live Streams
            </TabsTrigger>
            <TabsTrigger value="mybooth" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Store className="w-4 h-4" />
              My Booth
            </TabsTrigger>
            <TabsTrigger value="join" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-500 data-[state=active]:text-white">
              <Plus className="w-4 h-4" />
              Join Expo
            </TabsTrigger>
          </TabsList>

          {/* Browse Expos */}
          <TabsContent value="browse" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
                  <Grid className="w-4 h-4" />
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <select className="px-3 py-2 border rounded-lg text-sm">
                  <option>All Categories</option>
                  <option>Technology</option>
                  <option>Fashion</option>
                  <option>Home & Living</option>
                </select>
              </div>
            </div>

            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {expos.map((expo) => (
                <Card key={expo.id} className="overflow-hidden hover:shadow-2xl transition-shadow border-2 border-purple-100">
                  <div className="relative">
                    <img src={expo.image} alt={expo.name} className="w-full h-48 object-cover" />
                    {expo.status === 'live' && (
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white animate-pulse">
                        <Radio className="w-3 h-3 mr-1" />
                        LIVE
                      </Badge>
                    )}
                    {expo.featured && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">{expo.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{expo.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {expo.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {expo.duration}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span>{expo.attendees.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-purple-600" />
                          <span>{expo.booths} booths</span>
                        </div>
                        {expo.liveStreams > 0 && (
                          <div className="flex items-center gap-1">
                            <Video className="w-4 h-4 text-red-600" />
                            <span>{expo.liveStreams} live</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500"
                        onClick={() => handleJoinExpo(expo.id)}
                      >
                        {expo.status === 'live' ? 'Enter Expo' : 'Register'}
                      </Button>
                      <Button variant="outline" size="icon">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedExpo && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Virtual Booths</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {virtualBooths.map((booth) => (
                      <Card 
                        key={booth.id} 
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => setSelectedBooth(booth)}
                      >
                        <div className="relative">
                          <img src={booth.banner} alt={booth.exhibitorName} className="w-full h-32 object-cover rounded-t-lg" />
                          {booth.isLive && (
                            <Badge className="absolute top-2 right-2 bg-red-500 text-white animate-pulse">
                              <Video className="w-3 h-3 mr-1" />
                              LIVE
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <img src={booth.logo} alt="" className="w-12 h-12 rounded-full" />
                            <div className="flex-1">
                              <h4 className="font-semibold">{booth.exhibitorName}</h4>
                              <p className="text-sm text-gray-600">Booth {booth.boothNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span>{booth.rating}</span>
                            </div>
                            {booth.isLive && (
                              <div className="flex items-center gap-1 text-red-600">
                                <Eye className="w-4 h-4" />
                                <span>{booth.viewers.toLocaleString()}</span>
                              </div>
                            )}
                            <span className="text-gray-600">{booth.products} products</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Live Streams */}
          <TabsContent value="live" className="space-y-6">
            {isInLiveStream ? (
              <Card className="border-2 border-purple-200">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="relative bg-black rounded-lg aspect-video mb-4">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Video className="w-16 h-16 mx-auto mb-4" />
                            <p className="text-xl font-semibold">Live Stream Active</p>
                            <p className="text-gray-300 mt-2">Streaming to {virtualBooths[0].viewers.toLocaleString()} viewers</p>
                          </div>
                        </div>
                        <Badge className="absolute top-4 left-4 bg-red-500 text-white animate-pulse px-4 py-2">
                          <Radio className="w-4 h-4 mr-2" />
                          LIVE
                        </Badge>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" size="icon">
                          <Mic className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Camera className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Stream Settings
                        </Button>
                        <Button variant="destructive" onClick={endLiveStream}>
                          End Stream
                        </Button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        Live Chat
                      </h3>
                      <div className="space-y-3 h-96 overflow-y-auto mb-4">
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-sm">{msg.user}</span>
                              <span className="text-xs text-gray-500">{msg.time}</span>
                            </div>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                        />
                        <Button size="icon" onClick={sendChatMessage}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {virtualBooths.filter(b => b.isLive).map((booth) => (
                  <Card key={booth.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img src={booth.banner} alt={booth.exhibitorName} className="w-full h-48 object-cover" />
                      <Badge className="absolute top-3 right-3 bg-red-500 text-white animate-pulse">
                        <Radio className="w-3 h-3 mr-1" />
                        LIVE
                      </Badge>
                      <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{booth.exhibitorName}</span>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{booth.viewers.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-500">
                        <Play className="w-4 h-4 mr-2" />
                        Watch Live
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isInLiveStream && user?.isSeller && (
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-8 text-center">
                  <Video className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Start Your Live Stream</h3>
                  <p className="text-gray-600 mb-6">
                    Connect with thousands of potential customers in real-time
                  </p>
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-pink-500 text-lg px-8 py-6"
                    onClick={startLiveStream}
                  >
                    <Radio className="w-5 h-5 mr-2" />
                    Go Live Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Booth */}
          <TabsContent value="mybooth" className="space-y-6">
            {user?.isSeller ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Booth Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Booth Name</label>
                      <Input placeholder="Enter your booth name" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea placeholder="Describe your booth and products" rows={4} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-4">Product Images</label>
                      <input
                        ref={imageInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div
                        onClick={() => imageInputRef.current?.click()}
                        className="border-2 border-dashed border-purple-300 rounded-lg p-12 text-center hover:border-purple-500 cursor-pointer transition-colors"
                      >
                        <Upload className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                        <p className="text-lg font-medium text-gray-700">Upload Product Images</p>
                        <p className="text-sm text-gray-500 mt-2">Click or drag images to upload</p>
                      </div>
                      {newBoothData.productImages.length > 0 && (
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          {newBoothData.productImages.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img src={img} alt="" className="w-full h-32 object-cover rounded-lg" />
                              <button
                                onClick={() => setNewBoothData({
                                  ...newBoothData,
                                  productImages: newBoothData.productImages.filter((_, i) => i !== idx)
                                })}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-4">Product Videos</label>
                      <input
                        ref={videoInputRef}
                        type="file"
                        multiple
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                      <div
                        onClick={() => videoInputRef.current?.click()}
                        className="border-2 border-dashed border-purple-300 rounded-lg p-12 text-center hover:border-purple-500 cursor-pointer transition-colors"
                      >
                        <Video className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                        <p className="text-lg font-medium text-gray-700">Upload Product Videos</p>
                        <p className="text-sm text-gray-500 mt-2">Showcase your products in action</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Booth
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Booth Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold">12,456</div>
                        <div className="text-sm text-gray-600">Total Views</div>
                      </div>
                      <div className="text-center p-4 bg-pink-50 rounded-lg">
                        <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold">3,248</div>
                        <div className="text-sm text-gray-600">Favorites</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold">892</div>
                        <div className="text-sm text-gray-600">Messages</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold">+24%</div>
                        <div className="text-sm text-gray-600">Growth</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-12 text-center">
                  <Store className="w-20 h-20 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Become an Exhibitor</h3>
                  <p className="text-gray-600 mb-6">
                    Create your virtual booth and showcase your products to thousands of buyers
                  </p>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-lg px-8 py-6">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Your Booth
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Join Expo */}
          <TabsContent value="join" className="space-y-6">
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle>Join as Exhibitor</CardTitle>
                <p className="text-gray-600">Fill in the details to participate in upcoming expos</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name *</label>
                    <Input 
                      placeholder="Enter your company name"
                      value={newBoothData.exhibitorName}
                      onChange={(e) => setNewBoothData({ ...newBoothData, exhibitorName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      value={newBoothData.category}
                      onChange={(e) => setNewBoothData({ ...newBoothData, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      <option value="Technology">Technology</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home & Living">Home & Living</option>
                      <option value="Beauty">Beauty & Personal Care</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company Description *</label>
                  <Textarea
                    placeholder="Tell us about your company and products"
                    value={newBoothData.description}
                    onChange={(e) => setNewBoothData({ ...newBoothData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      placeholder="contact@company.com"
                      value={newBoothData.email}
                      onChange={(e) => setNewBoothData({ ...newBoothData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <Input
                      type="tel"
                      placeholder="+1-555-0123"
                      value={newBoothData.phone}
                      onChange={(e) => setNewBoothData({ ...newBoothData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Website</label>
                    <Input
                      type="url"
                      placeholder="www.company.com"
                      value={newBoothData.website}
                      onChange={(e) => setNewBoothData({ ...newBoothData, website: e.target.value })}
                    />
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h4 className="font-semibold mb-4">Select Expo to Join</h4>
                  <div className="space-y-3">
                    {expos.filter(e => e.status !== 'past').map((expo) => (
                      <label key={expo.id} className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md cursor-pointer transition-shadow">
                        <input type="checkbox" className="rounded text-purple-600" />
                        <div className="flex-1">
                          <div className="font-semibold">{expo.name}</div>
                          <div className="text-sm text-gray-600">{expo.date} • {expo.category}</div>
                        </div>
                        <Badge className={expo.status === 'live' ? 'bg-red-500' : 'bg-blue-500'}>
                          {expo.status}
                        </Badge>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-lg py-6"
                    onClick={handleCreateBooth}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Submit Application
                  </Button>
                  <Button variant="outline" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download Brochure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booth Detail Modal */}
      {selectedBooth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img src={selectedBooth.banner} alt={selectedBooth.exhibitorName} className="w-full h-64 object-cover" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                onClick={() => setSelectedBooth(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              {selectedBooth.isLive && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white animate-pulse px-4 py-2">
                  <Radio className="w-4 h-4 mr-2" />
                  LIVE NOW
                </Badge>
              )}
            </div>
            
            <CardContent className="p-8">
              <div className="flex items-start gap-6 mb-6">
                <img src={selectedBooth.logo} alt="" className="w-24 h-24 rounded-lg" />
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{selectedBooth.exhibitorName}</h2>
                  <p className="text-gray-600 mb-3">{selectedBooth.description}</p>
                  <div className="flex items-center gap-4">
                    <Badge>Booth {selectedBooth.boothNumber}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{selectedBooth.rating}</span>
                    </div>
                    <span className="text-gray-600">{selectedBooth.products} products</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                  <Mail className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium">{selectedBooth.contacts.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-lg">
                  <Phone className="w-6 h-6 text-pink-600" />
                  <div>
                    <div className="text-sm text-gray-600">Phone</div>
                    <div className="font-medium">{selectedBooth.contacts.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                  <Globe className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="text-sm text-gray-600">Website</div>
                    <div className="font-medium">{selectedBooth.contacts.website}</div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Featured Products</h3>
                <div className="grid grid-cols-3 gap-4">
                  {selectedBooth.productImages.map((img, idx) => (
                    <img key={idx} src={img} alt="" className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer" />
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Exhibitor
                </Button>
                <Button variant="outline">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {selectedBooth.isLive && (
                  <Button variant="outline" className="bg-red-50 text-red-600 hover:bg-red-100">
                    <Play className="w-4 h-4 mr-2" />
                    Watch Live
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Missing import
import { Store, Save } from 'lucide-react';
