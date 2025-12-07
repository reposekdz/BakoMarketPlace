import { useState, useEffect } from 'react';
import { Video, Users, Heart, ShoppingBag, Send } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';

const API_URL = 'http://localhost:5000/api';

interface LiveStream {
  id: number;
  shop_name: string;
  logo: string;
  title: string;
  viewers_count: number;
  products_featured: any[];
}

export function LiveStreamingHub({ onViewProduct }: any) {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadStreams();
    const interval = setInterval(loadStreams, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadStreams = async () => {
    try {
      const res = await fetch(`${API_URL}/innovations/live-streams`);
      const data = await res.json();
      setStreams(data);
    } catch (error) {
      console.error('Failed to load streams');
    }
  };

  const joinStream = async (stream: LiveStream) => {
    setSelectedStream(stream);
    try {
      await fetch(`${API_URL}/innovations/live-stream/${stream.id}/view`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to track view');
    }
  };

  if (selectedStream) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex">
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
            <Video className="w-32 h-32 text-white/20" />
            <div className="absolute top-4 left-4 flex items-center gap-3 text-white">
              <Avatar className="w-12 h-12">
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
            <div className="absolute top-4 right-4 flex items-center gap-2 text-white">
              <Users className="w-5 h-5" />
              <span className="font-bold">{selectedStream.viewers_count}</span>
            </div>
            <Button
              variant="ghost"
              className="absolute top-4 right-20 text-white"
              onClick={() => setSelectedStream(null)}
            >
              Close
            </Button>
          </div>
        </div>
        
        <div className="w-96 bg-white flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-bold">Live Chat</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-center text-sm text-gray-500">Chat messages will appear here</div>
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Say something..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {selectedStream.products_featured && selectedStream.products_featured.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <h4 className="font-semibold mb-3">Featured Products</h4>
              <div className="space-y-2">
                {selectedStream.products_featured.map((product: any) => (
                  <Card key={product.id} className="p-3 flex gap-3 cursor-pointer hover:shadow-md">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h5 className="font-medium text-sm">{product.name}</h5>
                      <p className="text-lg font-bold text-purple-600">${product.price}</p>
                    </div>
                    <Button size="sm">
                      <ShoppingBag className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Video className="w-8 h-8 text-red-600" />
        <div>
          <h2 className="text-2xl font-bold">Live Shopping</h2>
          <p className="text-gray-600">Watch live streams and shop in real-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream) => (
          <Card
            key={stream.id}
            className="overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
            onClick={() => joinStream(stream)}
          >
            <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="w-16 h-16 text-white/50" />
              </div>
              <Badge className="absolute top-3 left-3 bg-red-600 animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full mr-2" />
                LIVE
              </Badge>
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full text-white">
                <Users className="w-4 h-4" />
                <span className="font-bold">{stream.viewers_count}</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <img src={stream.logo} alt={stream.shop_name} />
                </Avatar>
                <div>
                  <h3 className="font-semibold">{stream.shop_name}</h3>
                  <p className="text-sm text-gray-600">{stream.title}</p>
                </div>
              </div>
              <Button className="w-full">
                <Video className="w-4 h-4 mr-2" />
                Join Stream
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
