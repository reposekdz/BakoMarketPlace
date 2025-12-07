import React, { createContext, useContext, useState, useEffect } from 'react';

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  translations: Record<string, string>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
];

const DEFAULT_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    home: 'Home', products: 'Products', categories: 'Categories', cart: 'Cart', wishlist: 'Wishlist',
    search: 'Search products...', login: 'Login', signup: 'Sign Up', logout: 'Logout', profile: 'Profile',
    orders: 'Orders', messages: 'Messages', notifications: 'Notifications', settings: 'Settings',
    shops: 'Shops', nearby: 'Nearby', expo: 'Expo', live: 'Live', deals: 'Deals', new: 'New',
    trending: 'Trending', featured: 'Featured', price: 'Price', rating: 'Rating', reviews: 'Reviews',
    addToCart: 'Add to Cart', buyNow: 'Buy Now', viewDetails: 'View Details', outOfStock: 'Out of Stock',
    inStock: 'In Stock', freeShipping: 'Free Shipping', discount: 'Discount', sale: 'Sale',
    electronics: 'Electronics', fashion: 'Fashion', homeGarden: 'Home & Garden', beauty: 'Beauty',
    sports: 'Sports', books: 'Books', toys: 'Toys', food: 'Food & Beverages'
  },
  rw: {
    home: 'Ahabanza', products: 'Ibicuruzwa', categories: 'Ibyiciro', cart: 'Agakarito', wishlist: 'Ibyifuzo',
    search: 'Shakisha ibicuruzwa...', login: 'Injira', signup: 'Iyandikishe', logout: 'Sohoka', profile: 'Umwirondoro',
    orders: 'Ibicuruzwa byatumijwe', messages: 'Ubutumwa', notifications: 'Imenyesha', settings: 'Igenamiterere',
    shops: 'Amaduka', nearby: 'Hafi', expo: 'Imurikagurisha', live: 'Kuri Live', deals: 'Amahitamo', new: 'Bishya',
    trending: 'Bikunzwe', featured: 'Byatoranijwe', price: 'Igiciro', rating: 'Amanota', reviews: 'Ibitekerezo',
    addToCart: 'Shyira muri Karito', buyNow: 'Gura Nonaha', viewDetails: 'Reba Ibisobanuro', outOfStock: 'Nta bicuruzwa',
    inStock: 'Birahari', freeShipping: 'Kohereza Ubuntu', discount: 'Kugabanya', sale: 'Igurisha',
    electronics: 'Ikoranabuhanga', fashion: 'Imyambarire', homeGarden: 'Inzu n\'Ubusitani', beauty: 'Ubwiza',
    sports: 'Siporo', books: 'Ibitabo', toys: 'Ibikinisho', food: 'Ibiryo n\'Ibinyobwa'
  }
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState<Record<string, string>>(DEFAULT_TRANSLATIONS.en);

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    loadTranslations(savedLang);
  }, []);

  const loadTranslations = async (lang: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/translations/ui/${lang}`);
      if (response.ok) {
        const data = await response.json();
        setTranslations({ ...DEFAULT_TRANSLATIONS[lang] || DEFAULT_TRANSLATIONS.en, ...data });
      } else {
        setTranslations(DEFAULT_TRANSLATIONS[lang] || DEFAULT_TRANSLATIONS.en);
      }
    } catch (error) {
      setTranslations(DEFAULT_TRANSLATIONS[lang] || DEFAULT_TRANSLATIONS.en);
    }
  };

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    loadTranslations(lang);
  };

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, t, translations }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('useTranslation must be used within TranslationProvider');
  return context;
};

export { SUPPORTED_LANGUAGES };
