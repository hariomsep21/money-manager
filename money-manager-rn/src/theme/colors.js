// Theme color definitions
export const themes = {
  complementary: {
    bgPrimary: '#121212',
    bgSecondary: '#000000',
    bgTertiary: '#2d2d2d',
    textPrimary: '#ffffff',
    textSecondary: '#aaaaaa',
    textMuted: '#666666',
    accentPrimary: '#6366F1',
    accentBlue: '#3b82f6',
    accentOrange: '#f97316',
    accentGreen: '#10b981',
    accentRed: '#ef4444',
    borderColor: '#333333',
  },
  orange: {
    bgPrimary: '#ffffff',
    bgSecondary: '#fff7ed',
    bgTertiary: '#ffedd5',
    textPrimary: '#1f2937',
    textSecondary: '#4b5563',
    textMuted: '#9ca3af',
    accentPrimary: '#f97316',
    accentBlue: '#3b82f6',
    accentOrange: '#f97316',
    accentGreen: '#10b981',
    accentRed: '#ef4444',
    borderColor: '#e5e7eb',
  },
};

export const getThemeColors = (themeName = 'complementary') => {
  return themes[themeName] || themes.complementary;
};

export const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹',
  JPY: '¥',
};

export const getCurrencySymbol = (currency) => {
  return currencySymbols[currency] || '$';
};
