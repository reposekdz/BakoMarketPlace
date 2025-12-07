import { useState, useRef, useEffect } from 'react';
import { DollarSign, ChevronDown, Search, TrendingUp, Star } from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
  popular?: boolean;
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 1.00, popular: true },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.92, popular: true },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.79, popular: true },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', flag: '🇷🇼', rate: 1320.00, popular: true },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', rate: 129.50 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', flag: '🇺🇬', rate: 3720.00 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', flag: '🇹🇿', rate: 2510.00 },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', flag: '🇪🇹', rate: 55.50 },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭', rate: 12.10 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', rate: 775.00 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', rate: 18.75 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 149.50, popular: true },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', rate: 7.24 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rate: 83.12 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', rate: 3.67 }
];

interface AdvancedCurrencyDropdownProps {
  value: string;
  onChange: (code: string) => void;
}

export function AdvancedCurrencyDropdown({ value, onChange }: AdvancedCurrencyDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = currencies.find(c => c.code === value) || currencies[0];
  const filtered = currencies.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const popular = filtered.filter(c => c.popular);
  const others = filtered.filter(c => !c.popular);

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
        <span className="font-medium">{selected.code}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Search */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search currency..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Currency List */}
          <div className="max-h-96 overflow-y-auto">
            {popular.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-semibold text-gray-600 uppercase">Popular</span>
                </div>
                {popular.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      onChange(currency.code);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-purple-50 transition-colors ${
                      currency.code === value ? 'bg-purple-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currency.flag}</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{currency.code}</p>
                        <p className="text-xs text-gray-500">{currency.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{currency.symbol}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {currency.rate.toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {others.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50">
                  <span className="text-xs font-semibold text-gray-600 uppercase">All Currencies</span>
                </div>
                {others.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => {
                      onChange(currency.code);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-purple-50 transition-colors ${
                      currency.code === value ? 'bg-purple-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currency.flag}</span>
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">{currency.code}</p>
                        <p className="text-xs text-gray-500">{currency.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{currency.symbol}</p>
                      <p className="text-xs text-gray-500">{currency.rate.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No currencies found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
