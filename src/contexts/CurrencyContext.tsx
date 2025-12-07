import React, { createContext, useContext, useState, useEffect } from 'react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
}

interface CurrencyContextType {
  currency: string;
  setCurrency: (code: string) => void;
  currencies: Currency[];
  convertPrice: (amount: number, fromCurrency?: string) => number;
  formatPrice: (amount: number, fromCurrency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const DEFAULT_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', exchange_rate: 1.00 },
  { code: 'EUR', name: 'Euro', symbol: '€', exchange_rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', exchange_rate: 0.79 },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', exchange_rate: 1320.00 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', exchange_rate: 129.50 },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', exchange_rate: 3720.00 },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', exchange_rate: 2510.00 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', exchange_rate: 149.50 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', exchange_rate: 7.24 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', exchange_rate: 83.12 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', exchange_rate: 3.67 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', exchange_rate: 18.75 }
];

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState('USD');
  const [currencies, setCurrencies] = useState<Currency[]>(DEFAULT_CURRENCIES);

  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency') || 'USD';
    setCurrency(savedCurrency);
    loadCurrencies();
  }, []);

  const loadCurrencies = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/currencies');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) setCurrencies(data);
      }
    } catch (error) {
      console.log('Using default currencies');
    }
  };

  const handleSetCurrency = (code: string) => {
    setCurrency(code);
    localStorage.setItem('currency', code);
  };

  const convertPrice = (amount: number, fromCurrency: string = 'USD'): number => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.exchange_rate || 1;
    const toRate = currencies.find(c => c.code === currency)?.exchange_rate || 1;
    return (amount / fromRate) * toRate;
  };

  const formatPrice = (amount: number, fromCurrency: string = 'USD'): string => {
    const converted = convertPrice(amount, fromCurrency);
    const currencyData = currencies.find(c => c.code === currency);
    const symbol = currencyData?.symbol || '$';
    
    return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, currencies, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
