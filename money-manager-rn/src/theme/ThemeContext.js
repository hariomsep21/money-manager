import React, { createContext } from 'react';
import { getThemeColors } from './colors';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children, theme = 'complementary' }) => {
  const colors = getThemeColors(theme);

  const themeValue = {
    colors,
    theme,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
