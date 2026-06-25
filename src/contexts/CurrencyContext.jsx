import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext(null);

export const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', currency: 'USD' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', currency: 'CAD' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
  { code: 'EU', name: 'Europe', flag: '🇪🇺', currency: 'EUR' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', currency: 'JPY' },
  { code: 'IN', name: 'India', flag: '🇮🇳', currency: 'INR' }
];

export const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' }
];

const exchangeRates = {
  USD: 1.0,
  CAD: 1.35,
  GBP: 0.78,
  EUR: 0.92,
  JPY: 155.0,
  INR: 83.5
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState(
    localStorage.getItem('merchora_country') || 'US'
  );
  const [selectedCurrency, setSelectedCurrency] = useState(
    localStorage.getItem('merchora_currency') || 'USD'
  );

  // Sync with localstorage
  useEffect(() => {
    localStorage.setItem('merchora_country', selectedCountry);
  }, [selectedCountry]);

  useEffect(() => {
    localStorage.setItem('merchora_currency', selectedCurrency);
  }, [selectedCurrency]);

  const updateCountry = (countryCode) => {
    setSelectedCountry(countryCode);
    // Auto-update matching currency
    const country = countries.find(c => c.code === countryCode);
    if (country) {
      setSelectedCurrency(country.currency);
    }
  };

  const updateCurrency = (currencyCode) => {
    setSelectedCurrency(currencyCode);
  };

  // Convert price from USD base
  const convert = (priceInUsd) => {
    const rate = exchangeRates[selectedCurrency] || 1.0;
    return parseFloat((priceInUsd * rate).toFixed(2));
  };

  // Convert and format price string
  const formatPrice = (priceInUsd) => {
    const convertedVal = convert(priceInUsd);
    const currency = currencies.find(c => c.code === selectedCurrency);
    const symbol = currency ? currency.symbol : '$';
    
    // Format options (e.g. JPY has no decimals typically, but we can show standard 2 decimal format or JPY round)
    if (selectedCurrency === 'JPY') {
      return `${symbol}${Math.round(convertedVal).toLocaleString()}`;
    }
    
    return `${symbol}${convertedVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{
      selectedCountry,
      selectedCurrency,
      updateCountry,
      updateCurrency,
      convert,
      formatPrice,
      countries,
      currencies
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
