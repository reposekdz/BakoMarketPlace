import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Video, Phone, Send, Paperclip, Smile, X, Minimize2, Maximize2, Mic, MicOff, VideoOff, PhoneOff, User, Search, Filter, Clock, Download, Image as ImageIcon, File, CheckCheck, Check, MoreVertical, Archive, Trash2, Flag, Star } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  orderId?: string;
  orderProduct?: string;
  isActive: boolean;
  rating?: number;
  tags?: string[];
}

interface Message {
  id: string;
  sender: 'user' | 'other';
  text: string;
  time: string;
  timestamp: number;
  type: 'text' | 'file' | 'image' | 'order';
  fileInfo?: { name: string; size: string; type: string };
  imageUrl?: string;
  orderInfo?: { orderId: string; product: string; amount: number };
  read: boolean;
}

export function BuyerConversationHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isAudioCall, setIsAudioCall] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'orders' | 'archived'>('all');
  const [message, setMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      participantId: 'seller-1',
      participantName: 'TechGlobal Store',
      lastMessage: 'Your order is being prepared for shipment',
      lastMessageTime: '2 min ago',
      unread: 2,
      orderId: 'ORD-12345',
      orderProduct: 'Premium Ultrabook Pro 15"',
      isActive: true,
      tags: ['order', 'active']
    },
    {
      id: '2',
      participantId: 'seller-2',
      participantName: 'Fashion Forward Inc.',
      lastMessage: 'We have the item in your size!',
      lastMessageTime: '15 min ago',
      unread: 0,
      isActive: true,
      tags: ['inquiry']
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'other',
      text: 'Hi! Thank you for your purchase. We are processing your order now.',
      time: '10:30 AM',
      timestamp: Date.now() - 3600000,
      type: 'text',
      read: true
    },
    {
      id: '2',
      sender: 'user',
      text: 'Great! What is the expected delivery time?',
      time: '10:35 AM',
      timestamp: Date.now() - 3300000,
      type: 'text',
      read: true
    },
    {
      id: '3',
      sender: 'other',
      text: 'Your order is being prepared for shipment',
      time: 'Just now',
      timestamp: Date.now(),
      type: 'text',
      read: false
    }
  ]);

  const messageTemplates = [
    'Is this still available?',
    'What is the best price you can offer?',
    'Do you offer international shipping?',
    'When will you restock?',
    'Can I get a bulk discount?',
    'What is the warranty period?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if ((isVideoCall || isAudioCall) && callDuration < 3600) {
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isVideoCall, isAudioCall, callDuration]);

  const formatCallDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours > 0 ? hours + ':' : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now(),
      type: 'text',
      read: true
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'other',
        text: 'Got it! Let me check that for you.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        type: 'text',
        read: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`File "${file.name}" uploaded!`);
      const fileMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        text: `Shared file: ${file.name}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        type: 'file',
        fileInfo: {
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          type: file.type
        },
        read: true
      };
      setMessages([...messages, fileMessage]);
    }
  };

  const handleVideoCall = () => {
    setIsVideoCall(true);
    setCallDuration(0);
    toast.success('Starting video call with seller...');
  };

  const handleAudioCall = () => {
    setIsAudioCall(true);
    setCallDuration(0);
    toast.success('Starting audio call with seller...');
  };

  const handleEndCall = () => {
    setIsVideoCall(false);
    setIsAudioCall(false);
    setCallDuration(0);
    setIsVideoMuted(false);
    setIsAudioMuted(false);
    toast.success('Call ended');
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'unread') return matchesSearch && conv.unread > 0;
    if (filterType === 'orders') return matchesSearch && conv.orderId;
    if (filterType === 'archived') return matchesSearch && conv.tags?.includes('archived');
    
    return matchesSearch;
  });

  const currentConversation = conversations.find(c => c.id === selectedConversation);

  if (!isOpen) {
    const unreadCount = conversations.reduce((sum, c) => sum + c.unread, 0);
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
      >
        <MessageCircle className="w-7 h-7" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all ${
        isMinimized ? 'bottom-6 w-80 h-16' : isVideoCall || isAudioCall ? 'bottom-6 w-[700px] h-[750px]' : 'bottom-6 w-[500px] h-[700px]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          {selectedConversation && currentConversation ? (
            <>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-semibold">{currentConversation.participantName}</h4>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Online
                </p>
              </div>
            </>
          ) : (
            <>
              <MessageCircle className="w-6 h-6" />
              <h4 className="text-white font-semibold">Messages</h4>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedConversation && !isVideoCall && !isAudioCall && (
            <>
              <button
                onClick={handleVideoCall}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Start video call"
              >
                <Video className="w-5 h-5" />
              </button>
              <button
                onClick={handleAudioCall}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Start audio call"
              >
                <Phone className="w-5 h-5" />
              </button>
            </>
          )}
          {selectedConversation && (
            <button
              onClick={() => setSelectedConversation(null)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {selectedConversation ? (
            <>
              {/* Video/Audio Call View */}
              {(isVideoCall || isAudioCall) && (
                <div className="flex-1 p-4 bg-gray-900 relative flex flex-col" style={{ height: 'calc(100% - 140px)' }}>
                  {/* Remote Video */}
                  <div className="flex-1 bg-gradient-to-br from-blue-900 to-cyan-900 rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-12 h-12" />
                      </div>
                      <h3 className="text-white mb-2">{currentConversation?.participantName}</h3>
                      <p className="text-white/60">{isVideoCall ? 'Video call' : 'Audio call'} in progress...</p>
                    </div>
                  </div>

                  {/* Local Video PiP */}
                  {isVideoCall && (
                    <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-white/20 flex items-center justify-center">
                      <User className="w-8 h-8 text-white/60" />
                    </div>
                  )}

                  {/* Call Duration */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {formatCallDuration(callDuration)}
                  </div>

                  {/* Call Controls */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3">
                    <button
                      onClick={() => setIsAudioMuted(!isAudioMuted)}
                      className={`p-3 rounded-full transition-colors ${
                        isAudioMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
                      }`}
                    >
                      {isAudioMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                    </button>

                    {isVideoCall && (
                      <button
                        onClick={() => setIsVideoMuted(!isVideoMuted)}
                        className={`p-3 rounded-full transition-colors ${
                          isVideoMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'
                        }`}
                      >
                        {isVideoMuted ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
                      </button>
                    )}

                    <button
                      onClick={handleEndCall}
                      className="p-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                    >
                      <PhoneOff className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* Chat View */}
              {!isVideoCall && !isAudioCall && (
                <>
                  {/* Order Info Banner */}
                  {currentConversation?.orderId && (
                    <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Order {currentConversation.orderId}</p>
                        <p className="text-xs text-blue-700">{currentConversation.orderProduct}</p>
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">
                        View Order
                      </button>
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50" style={{ height: 'calc(100% - 200px)' }}>
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
                        <p>No messages yet</p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%]`}>
                            {msg.type === 'text' && (
                              <div
                                className={`rounded-2xl px-4 py-2 ${
                                  msg.sender === 'user'
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                                    : 'bg-white border border-gray-200 text-gray-900'
                                }`}
                              >
                                <p>{msg.text}</p>
                                <p className={`text-xs mt-1 flex items-center gap-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                                  {msg.time}
                                  {msg.sender === 'user' && msg.read && <CheckCheck className="w-3 h-3" />}
                                </p>
                              </div>
                            )}

                            {msg.type === 'file' && msg.fileInfo && (
                              <div className={`rounded-2xl px-4 py-3 ${
                                msg.sender === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border border-gray-200'
                              }`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <File className="w-5 h-5" />
                                  <div>
                                    <p className="font-medium text-sm">{msg.fileInfo.name}</p>
                                    <p className={`text-xs ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>{msg.fileInfo.size}</p>
                                  </div>
                                </div>
                                <button className={`text-xs px-2 py-1 rounded ${msg.sender === 'user' ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                  Download
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-4 border-t border-gray-200 space-y-3">
                    {showTemplates && (
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2 mb-2">
                        {messageTemplates.map((template, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setMessage(template);
                              setShowTemplates(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                          >
                            {template}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Attach file"
                      >
                        <Paperclip className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setShowTemplates(!showTemplates)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Message templates"
                      >
                        <Smile className="w-5 h-5 text-gray-600" />
                      </button>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {/* Conversations List */}
              <div className="flex-1 flex flex-col" style={{ height: 'calc(100% - 70px)' }}>
                {/* Search & Filter */}
                <div className="p-4 border-b border-gray-200 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search conversations..."
                      className="w-full pl-9 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>

                  <div className="flex gap-2 overflow-x-auto">
                    {['all', 'unread', 'orders', 'archived'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setFilterType(filter as any)}
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                          filterType === filter
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversations */}
                <div className="overflow-y-auto flex-1">
                  {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 py-8">
                      <MessageCircle className="w-10 h-10 mb-2 opacity-50" />
                      <p className="text-sm">No conversations</p>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv.id)}
                        className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                          selectedConversation === conv.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm text-gray-900">{conv.participantName}</h4>
                            {conv.unread > 0 && (
                              <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {conv.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{conv.lastMessageTime}</p>
                        </div>
                        <p className={`text-xs line-clamp-2 ${conv.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                          {conv.lastMessage}
                        </p>
                        {conv.orderId && (
                          <p className="text-xs text-blue-600 mt-2">{conv.orderId}</p>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
