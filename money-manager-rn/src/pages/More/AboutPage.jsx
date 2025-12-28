import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const AboutPage = () => {
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bgPrimary }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={[styles.card, { backgroundColor: colors.bgTertiary }]}
      >
        <Text style={[styles.appName, { color: colors.textPrimary }]}>FinTrack</Text>
        <Text style={[styles.appVersion, { color: colors.textSecondary }]}>Version 1.0.0</Text>
        <Text style={[styles.appDescription, { color: colors.textMuted }]}
        >
          Your personal money manager for tracking finances smartly
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 12,
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AboutPage;
