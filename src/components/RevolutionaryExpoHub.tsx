import { useState, useEffect } from 'react';
import { Video, Users, ShoppingBag, Heart, Send, Mic, Camera, Share2, Gift, TrendingUp, Zap } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

interface Stream {
  id: number;
  shop_name: string;
  logo: string;
  title: string;
  viewers_count: number;
  booth_number: string;
  rating: number;
}

export function RevolutionaryExpoHub({ expoId, user }: any) {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStream, setSelectedStream] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participants, setParticipants] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [reactions, setReactions] = useState<string[]>([]);

  useEffect(() => {
    if (expoId) loadStreams();
  }, [expoId]);

  useEffect(() => {
    if (selectedStream) {
      loadMessages();
      loadParticipants();
      const interval = setInterval(() => {
        loadMessages();
        loadParticipants();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedStream]);

  const loadStreams = async () => {
    try {
      const res = await fetch(`${API_URL}/streaming/expo/${expoId}/streams`);
      const data = await res.json();
      setStreams(data);
    } catch (error) {
      console.error('Failed to load streams');
    }
  };

  const joinStream = async (stream: Stream) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/streaming/stream/${stream.id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: 'viewer' })
      });
      const data = await res.json();
      setSelectedStream(data);
      setProducts(data.products ? JSON.parse(data.products) : []);
    } catch (error) {
      toast.error('Failed to join stream');
    }
  };

  const loadMessages = async () => {
    if (!selectedStream) return;
    try {
      const res = await fetch(`${API_URL}/streaming/stream/${selectedStream.id}/chat`);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages');
    }
  };

  const loadParticipants = async () => {
    if (!selectedStream) return;
    try {
      const res = await fetch(`${API_URL}/streaming/stream/${selectedStream.id}/participants`);
      const data = await res.json();
      setParticipants(data);
    } catch (error) {
      console.error('Failed to load participants');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/streaming/stream/${selectedStream.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: newMessage })
      });
      const data = await res.json();
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const sendReaction = async (type: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/streaming/stream/${selectedStream.id}/reaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reaction_type: type })
      });
      setReactions([...reactions, type]);
      setTimeout(() => setReactions(reactions.filter(r => r !== type)), 2000);
    } catch (error) {
      console.error('Failed to send reaction');
    }
  };

  if (selectedStream) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col md:flex-row">
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 flex items-center justify-center">
            <Video className="w-32 h-32 text-white/10" />
            
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-white">
                  <img src={selectedStream.logo} alt={selectedStream.shop_name} />
                </Avatar>
                <div>
                  <h3 className="font-bold">{selectedStream.shop_name}</h3>
                  <p className="text-sm opacity-80">{selectedStream.title}</p>
                </div>
                <Badge className="bg-red-600 animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full mr-2" />
                  LIVE
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                  <Users className="w-5 h-5" />
                  <span className="font-bold">{selectedStream.viewers_count}</span>
                </div>
                <Button variant="ghost" onClick={() => setSelectedStream(null)}>Close</Button>
              </div>
            </div>

            <div className="absolute bottom-20 left-4 flex gap-2">
              {['❤️', '👍', '🔥', '😍', '🎉'].map((emoji) => (
                <Button
                  key={emoji}
                  variant="secondary"
                  size="sm"
                  className="text-2xl"
                  onClick={() => sendReaction(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>

            {reactions.map((reaction, idx) => (
              <div
                key={idx}
                className="absolute bottom-32 left-8 text-4xl animate-bounce"
                style={{ animationDuration: '2s' }}
              >
                {reaction}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-96 bg-white flex flex-col">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="participants">People</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-2">
                    <Avatar className="w-8 h-8">
                      <img src={msg.avatar || '/placeholder-avatar.png'} alt={msg.first_name} />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{msg.first_name}</span>
                        <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Say something..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="products" className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {products.map((product: any) => (
                  <Card key={product.id} className="p-3 flex gap-3 hover:shadow-lg transition-shadow">
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{product.name}</h4>
                      <div className="flex items-center gap-2">
                        {product.special_price && (
                          <>
                            <span className="text-lg font-bold text-red-600">${product.special_price}</span>
                            <span className="text-sm line-through text-gray-400">${product.price}</span>
                            <Badge className="bg-red-600">
                              <Zap className="w-3 h-3 mr-1" />
                              {Math.round(((product.price - product.special_price) / product.price) * 100)}% OFF
                            </Badge>
                          </>
                        )}
                      </div>
                      <Button size="sm" className="w-full mt-2">
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Buy Now
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="participants" className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <Avatar className="w-10 h-10">
                      <img src={participant.avatar || '/placeholder-avatar.png'} alt={participant.first_name} />
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{participant.first_name} {participant.last_name}</h4>
                      <div className="flex gap-2">
                        <Badge variant={participant.role === 'host' ? 'default' : 'secondary'}>
                          {participant.role}
                        </Badge>
                        {participant.is_camera_on && <Camera className="w-4 h-4 text-green-600" />}
                        {participant.is_mic_on && <Mic className="w-4 h-4 text-green-600" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Live Expo Streams</h1>
        <p className="text-lg opacity-90">Watch live product demonstrations and shop in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {streams.map((stream) => (
          <Card
            key={stream.id}
            className="overflow-hidden cursor-pointer hover:shadow-2xl transition-all group"
            onClick={() => joinStream(stream)}
          >
            <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="w-16 h-16 text-white/30" />
              </div>
              <Badge className="absolute top-3 left-3 bg-red-600 animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full mr-2" />
                LIVE
              </Badge>
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full text-white">
                <Users className="w-4 h-4" />
                <span className="font-bold">{stream.viewers_count}</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <Badge className="bg-blue-600">Booth {stream.booth_number}</Badge>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-12 h-12">
                  <img src={stream.logo} alt={stream.shop_name} />
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{stream.shop_name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1">{stream.title}</p>
                </div>
              </div>
              <Button className="w-full group-hover:bg-purple-600">
                <Video className="w-4 h-4 mr-2" />
                Join Stream
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {streams.length === 0 && (
        <Card className="p-12 text-center">
          <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold mb-2">No Live Streams</h3>
          <p className="text-gray-600">Check back later for live product demonstrations</p>
        </Card>
      )}
    </div>
  );
}
