import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Video, Phone, Send, Paperclip, Smile, X, Minimize2, Maximize2, Mic, MicOff, VideoOff, PhoneOff, User } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SellerCommunicationProps {
  seller: {
    name: string;
    id?: string;
    rating: number;
  };
  productName: string;
}

export function SellerCommunication({ seller, productName }: SellerCommunicationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'seller',
      text: `Hi! Thanks for your interest in ${productName}. How can I help you today?`,
      time: '10:30 AM',
      type: 'text'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate seller response
    setTimeout(() => {
      const responses = [
        'Yes, this product is currently in stock!',
        'Let me check the availability for you.',
        'That\'s a great question! The delivery usually takes 2-3 days.',
        'We offer free shipping on this item.',
        'I can give you a special discount if you order now!'
      ];
      
      const response = {
        id: (Date.now() + 1).toString(),
        sender: 'seller',
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  const handleStartVideoCall = () => {
    setIsVideoCall(true);
    toast.success('Starting video call...');
  };

  const handleStartAudioCall = () => {
    setIsVideoCall(true);
    setIsVideoMuted(true);
    toast.success('Starting audio call...');
  };

  const handleEndCall = () => {
    setIsVideoCall(false);
    setIsVideoMuted(false);
    setIsAudioMuted(false);
    toast.success('Call ended');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`File "${file.name}" uploaded!`);
      const fileMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: `Sent a file: ${file.name}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'file'
      };
      setMessages([...messages, fileMessage]);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          1
        </span>
      </button>
    );
  }

  return (
    <div 
      className={`fixed right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all ${
        isMinimized ? 'bottom-6 w-80 h-16' : isVideoCall ? 'bottom-6 w-[600px] h-[700px]' : 'bottom-6 w-96 h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white">{seller.name}</h4>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isVideoCall && (
            <>
              <button
                onClick={handleStartVideoCall}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Start video call"
              >
                <Video className="w-5 h-5" />
              </button>
              <button
                onClick={handleStartAudioCall}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Start audio call"
              >
                <Phone className="w-5 h-5" />
              </button>
            </>
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
          {/* Video Call View */}
          {isVideoCall ? (
            <div className="flex-1 p-4 bg-gray-900 relative" style={{ height: 'calc(100% - 140px)' }}>
              {/* Remote Video (Seller) */}
              <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12" />
                  </div>
                  <h3 className="text-white mb-2">{seller.name}</h3>
                  <p className="text-white/60">Connecting...</p>
                </div>
              </div>

              {/* Local Video (You) - Picture in Picture */}
              <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-white/20 flex items-center justify-center">
                <User className="w-8 h-8 text-white/60" />
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

                {!isVideoMuted && (
                  <button
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  >
                    <Video className="w-5 h-5 text-white" />
                  </button>
                )}

                <button
                  onClick={handleEndCall}
                  className="p-3 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                >
                  <PhoneOff className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Call Duration */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
                00:45
              </div>
            </div>
          ) : (
            /* Chat View */
            <>
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4" style={{ height: 'calc(100% - 140px)' }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Typing Indicator */}
              <div className="px-4 py-2 text-sm text-gray-500 italic">
                {/* Typing indicator would go here */}
              </div>
            </>
          )}

          {/* Input Area */}
          {!isVideoCall && (
            <div className="p-4 border-t border-gray-200">
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
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Responses */}
              <div className="flex gap-2 mt-3">
                {['Is this in stock?', 'What\'s the price?', 'Free shipping?'].map((quick) => (
                  <button
                    key={quick}
                    onClick={() => {
                      setMessage(quick);
                      handleSendMessage();
                    }}
                    className="px-3 py-1 text-sm bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
