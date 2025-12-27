import React, { useContext, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalProvider, GlobalContext } from './context/GlobalState';
import { ThemeProvider } from './theme/ThemeContext';
import Navigation from './navigation/Navigation';

function AppContent() {
  const { theme } = useContext(GlobalContext);
  const [appTheme, setAppTheme] = useState(theme || 'complementary');

  useEffect(() => {
    if (theme) {
      setAppTheme(theme);
    }
  }, [theme]);

  return (
    <ThemeProvider theme={appTheme}>
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Navigation />
      </SafeAreaView>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
}
