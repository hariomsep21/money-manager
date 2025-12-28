import React, { useContext, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GlobalProvider, GlobalContext } from './context/GlobalState';
import { NotesProvider } from './notes/NotesContext';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import Navigation from './navigation/Navigation';

function AppLayout() {
  const { colors, theme } = useTheme();
  const isDarkTheme = theme === 'complementary';

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <StatusBar
        barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
        backgroundColor={colors.bgSecondary}
        translucent={false}
      />
      <Navigation />
    </SafeAreaView>
  );
}

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
      <SafeAreaProvider>
        <AppLayout />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <NotesProvider>
        <AppContent />
      </NotesProvider>
    </GlobalProvider>
  );
}
