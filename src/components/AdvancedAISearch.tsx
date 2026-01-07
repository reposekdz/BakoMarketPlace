import { useState } from 'react';
import { Search, Mic, Camera, Sparkles, TrendingUp, Clock, X } from 'lucide-react';

interface AdvancedAISearchProps {
  onSearch: (query: string) => void;
}

export function AdvancedAISearch({ onSearch }: AdvancedAISearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [searchHistory, setSearchHistory] = useState([
    'Wireless Headphones',
    'Smart Watch',
    'Gaming Laptop',
  ]);
  const [aiSuggestions] = useState([
    { text: 'iPhone 15 Pro Max', trend: '+120%' },
    { text: 'PS5 Console', trend: '+85%' },
    { text: 'MacBook Air M3', trend: '+67%' },
    { text: 'AirPods Pro 2', trend: '+54%' },
  ]);

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Simulate voice search
    setTimeout(() => {
      setIsListening(false);
      onSearch('wireless headphones');
    }, 2000);
  };

  const handleVisualSearch = () => {
    // Trigger file input for image upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        // Process image search
        console.log('Visual search with:', file.name);
      }
    };
    input.click();
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Sparkles className="absolute right-20 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 animate-pulse" />
          <input
            type="text"
            placeholder="AI-Powered Search: Try 'best laptop for gaming under $1000'..."
            className="w-full pl-12 pr-24 py-4 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-gradient-to-r from-purple-50 to-pink-50"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        <button
          onClick={handleVoiceSearch}
          className={`px-4 py-2 rounded-xl transition-all ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg'
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>
        
        <button
          onClick={handleVisualSearch}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-shadow"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* AI Suggestions Dropdown */}
      <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-200 p-6 z-50">
        <div className="grid grid-cols-2 gap-6">
          {/* Left: Trending Now */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="text-purple-600">Trending Now</h3>
            </div>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSearch(suggestion.text)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-50 rounded-lg transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-purple-600">{suggestion.text}</span>
                  <span className="text-green-600 text-xs px-2 py-1 bg-green-50 rounded-full">{suggestion.trend}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Recent Searches */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="text-gray-700">Recent Searches</h3>
            </div>
            <div className="space-y-2">
              {searchHistory.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <button
                    onClick={() => onSearch(item)}
                    className="flex-1 text-left text-gray-600 group-hover:text-gray-900"
                  >
                    {item}
                  </button>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Smart Categories */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-gray-700 mb-3">Smart Categories</h4>
          <div className="flex flex-wrap gap-2">
            {[
              'Electronics',
              'Fashion',
              'Home & Garden',
              'Sports',
              'Beauty',
              'Toys',
              'Books',
              'Automotive',
            ].map((category) => (
              <button
                key={category}
                onClick={() => onSearch(category)}
                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full hover:from-purple-200 hover:to-pink-200 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
