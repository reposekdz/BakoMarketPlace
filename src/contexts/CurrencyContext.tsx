import React, { createContext, useContext, useState, useEffect } from 'react';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'RWF' | 'KES' | 'TZS' | 'UGX';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  formatPrice: (price: number) => string;
  convertPrice: (price: number, fromCurrency?: Currency) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates (relative to USD)
const exchangeRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  RWF: 1245, // Rwandan Franc
  KES: 129, // Kenyan Shilling
  TZS: 2520, // Tanzanian Shilling
  UGX: 3720, // Ugandan Shilling
};

// Currency symbols and formatting
const currencyConfig: Record<Currency, { symbol: string; decimals: number; position: 'before' | 'after' }> = {
  USD: { symbol: '$', decimals: 2, position: 'before' },
  EUR: { symbol: '€', decimals: 2, position: 'before' },
  GBP: { symbol: '£', decimals: 2, position: 'before' },
  RWF: { symbol: 'FRw', decimals: 0, position: 'after' },
  KES: { symbol: 'KSh', decimals: 0, position: 'before' },
  TZS: { symbol: 'TSh', decimals: 0, position: 'before' },
  UGX: { symbol: 'USh', decimals: 0, position: 'before' },
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('bako_currency');
    return (saved as Currency) || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('bako_currency', currency);
  }, [currency]);

  const convertPrice = (price: number, fromCurrency: Currency = 'USD'): number => {
    // Convert from source currency to USD first, then to target currency
    const usdPrice = price / exchangeRates[fromCurrency];
    return usdPrice * exchangeRates[currency];
  };

  const formatPrice = (price: number): string => {
    const config = currencyConfig[currency];
    const convertedPrice = convertPrice(price);
    const formattedNumber = convertedPrice.toLocaleString('en-US', {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    });

    if (config.position === 'before') {
      return `${config.symbol}${formattedNumber}`;
    } else {
      return `${formattedNumber} ${config.symbol}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
}
