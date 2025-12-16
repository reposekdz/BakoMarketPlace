
const exchangeRates: { [key: string]: number } = {
  USD: 1,
  EUR: 0.93,
  GBP: 0.79,
  JPY: 157.62,
  RWF: 1300.50,
  CAD: 1.37,
  AUD: 1.51,
  CHF: 0.90,
};

export const convertCurrency = (price: number, from: string, to: string) => {
  const priceInUsd = price / exchangeRates[from];
  return priceInUsd * exchangeRates[to];
};

export const formatCurrency = (price: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};
