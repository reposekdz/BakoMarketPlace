import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Search, Star, Check } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  popular?: boolean;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', popular: true },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼', popular: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', popular: true },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿', popular: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', popular: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' }
];

interface AdvancedLanguageDropdownProps {
  value: string;
  onChange: (code: string) => void;
}

export function AdvancedLanguageDropdown({ value, onChange }: AdvancedLanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = languages.find(l => l.code === value) || languages[0];
  const filtered = languages.filter(l => 
    l.code.toLowerCase().includes(search.toLowerCase()) ||
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  const popular = filtered.filter(l => l.popular);
  const others = filtered.filter(l => !l.popular);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-300 text-white border border-white/20 hover:border-white/40"
      >
        <span className="text-xl">{selected.flag}</span>
        <span className="font-medium">{selected.code.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Select Language</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search language..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-96 overflow-y-auto">
            {popular.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">Popular Languages</span>
                </div>
                {popular.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      onChange(language.code);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-purple-50 transition-colors ${
                      language.code === value ? 'bg-purple-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{language.flag}</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{language.name}</p>
                        <p className="text-xs text-gray-500">{language.nativeName}</p>
                      </div>
                    </div>
                    {language.code === value && (
                      <Check className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {others.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50">
                  <span className="text-xs font-semibold text-gray-600 uppercase">All Languages</span>
                </div>
                {others.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      onChange(language.code);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-purple-50 transition-colors ${
                      language.code === value ? 'bg-purple-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{language.flag}</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{language.name}</p>
                        <p className="text-xs text-gray-500">{language.nativeName}</p>
                      </div>
                    </div>
                    {language.code === value && (
                      <Check className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No languages found</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              {filtered.length} language{filtered.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
