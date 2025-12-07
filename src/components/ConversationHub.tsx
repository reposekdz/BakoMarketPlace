import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Paperclip, X, Search, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

const API_URL = 'http://localhost:5000/api';

interface Conversation {
  id: number;
  other_name: string;
  other_avatar: string;
  last_message: string;
  last_message_at: string;
  unread_buyer: number;
  unread_seller: number;
  product_name: string;
  product_price: number;
}

interface Message {
  id: number;
  sender_id: number;
  message: string;
  attachment_url?: string;
  created_at: string;
  first_name: string;
  avatar: string;
}

export function ConversationHub({ userId }: { userId: number }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedConv) {
      loadMessages(selectedConv);
      const interval = setInterval(() => loadMessages(selectedConv), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations');
    }
  };

  const loadMessages = async (convId: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/conversations/${convId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConv) return;

    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/conversations/${selectedConv}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: newMessage })
      });
      setNewMessage('');
      loadMessages(selectedConv);
      loadConversations();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const filteredConversations = conversations.filter(c =>
    c.other_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversation = conversations.find(c => c.id === selectedConv);

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConv(conv.id)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedConv === conv.id ? 'bg-blue-50' : ''}`}
            >
              <div className="flex gap-3">
                <Avatar className="w-12 h-12">
                  <img src={conv.other_avatar || '/placeholder-avatar.png'} alt={conv.other_name} />
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{conv.other_name}</h3>
                    {(conv.unread_buyer > 0 || conv.unread_seller > 0) && (
                      <Badge variant="default" className="ml-2">{conv.unread_buyer + conv.unread_seller}</Badge>
                    )}
                  </div>
                  {conv.product_name && (
                    <p className="text-xs text-gray-500 truncate">{conv.product_name}</p>
                  )}
                  <p className="text-sm text-gray-600 truncate mt-1">{conv.last_message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(conv.last_message_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <img src={selectedConversation.other_avatar || '/placeholder-avatar.png'} alt={selectedConversation.other_name} />
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedConversation.other_name}</h3>
                  {selectedConversation.product_name && (
                    <p className="text-xs text-gray-500">{selectedConversation.product_name} - ${selectedConversation.product_price}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender_id === userId ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="w-8 h-8">
                    <img src={msg.avatar || '/placeholder-avatar.png'} alt={msg.first_name} />
                  </Avatar>
                  <div className={`max-w-[70%] ${msg.sender_id === userId ? 'items-end' : ''}`}>
                    <div className={`rounded-lg p-3 ${msg.sender_id === userId ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
                      <p>{msg.message}</p>
                      {msg.attachment_url && (
                        <img src={msg.attachment_url} alt="attachment" className="mt-2 rounded max-w-full" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
