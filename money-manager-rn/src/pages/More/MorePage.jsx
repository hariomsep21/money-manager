import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Image, Alert, Switch, Modal, FlatList } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { GlobalContext } from '../../context/GlobalState';
import * as ImagePicker from 'expo-image-picker';
import { User, Sun, Moon } from 'lucide-react-native';

const MorePage = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, updateUser, theme, toggleTheme, currency, changeCurrency } = useContext(GlobalContext);
  const [name, setName] = useState(user?.name || 'Guest');
  const [logoUrl, setLogoUrl] = useState(user?.logoUrl || '');
  const [editingName, setEditingName] = useState(false);
  const [currencyModal, setCurrencyModal] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];

  useEffect(() => {
    setName(user?.name || 'Guest');
    setLogoUrl(user?.logoUrl || '');
  }, [user]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setLogoUrl(result.assets[0].uri);
        updateUser({ name, logoUrl: result.assets[0].uri });
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const commitName = () => {
    const safeName = (name || '').trim() || 'Guest';
    updateUser({ name: safeName, logoUrl });
    setEditingName(false);
  };

  const initials = (user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bgPrimary }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Section */}
      <View style={[styles.profileSection, { backgroundColor: colors.bgTertiary }]}>
        <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
          {logoUrl ? (
            <Image
              source={{ uri: logoUrl }}
              style={styles.profileImage}
            />
          ) : (
            <View
              style={[
                styles.profileImage,
                { backgroundColor: colors.accentPrimary },
              ]}
            >
              <Text style={[styles.initialsText, { color: '#fff' }]}>
                {initials || <User size={48} color="#fff" />}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.nameSection}>
          {editingName ? (
            <TextInput
              style={[
                styles.nameInput,
                { color: colors.textPrimary, borderColor: colors.accentPrimary },
              ]}
              value={name}
              onChangeText={setName}
              onBlur={commitName}
              onSubmitEditing={commitName}
              autoFocus
            />
          ) : (
            <TouchableOpacity onPress={() => setEditingName(true)}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                {(name || '').trim() || 'Guest'}
              </Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.profileSubtitle, { color: colors.textSecondary }]}>
            Personal Money Manager
          </Text>
        </View>
      </View>

      {/* Theme Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Appearance
        </Text>
        <View style={[styles.settingRow, { backgroundColor: colors.bgTertiary }]}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              {theme === 'orange' ? (
                <Sun size={20} color={colors.accentOrange} />
              ) : (
                <Moon size={20} color={colors.accentBlue} />
              )}
            </View>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
              Theme: {theme === 'orange' ? 'Light' : 'Dark'}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.themeToggle,
              {
                backgroundColor:
                  theme === 'orange' ? colors.accentOrange : colors.accentBlue,
              },
            ]}
            onPress={() => {
              const newTheme = theme === 'orange' ? 'complementary' : 'orange';
              toggleTheme(newTheme);
            }}
          >
            <Text style={styles.themeToggleText}>
              {theme === 'orange' ? 'Light' : 'Dark'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Currency Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Settings
        </Text>
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: colors.bgTertiary }]}
          onPress={() => setCurrencyModal(true)}
        >
          <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
            Currency: {currency}
          </Text>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
            {currency}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={currencyModal}
          transparent
          animationType="slide"
          onRequestClose={() => setCurrencyModal(false)}
        >
          <View style={[styles.modalOverlay, { backgroundColor: colors.bgPrimary + '99' }]}>
            <View style={[styles.modalContent, { backgroundColor: colors.bgTertiary }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
                Select Currency
              </Text>
              <FlatList
                data={currencies}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      currency === item && { backgroundColor: colors.accentPrimary },
                    ]}
                    onPress={() => {
                      changeCurrency(item);
                      setCurrencyModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalItemText,
                        {
                          color: currency === item ? '#fff' : colors.textPrimary,
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.accentPrimary }]}
                onPress={() => setCurrencyModal(false)}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Notifications Link */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: colors.bgTertiary }]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
            Manage Notifications
          </Text>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
            {'>'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          About
        </Text>
        <TouchableOpacity
          style={[styles.settingRow, { backgroundColor: colors.bgTertiary }]}
          onPress={() => navigation.navigate('About')}
        >
          <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>
            About
          </Text>
          <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
            {'>'}
          </Text>
        </TouchableOpacity>
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
    paddingBottom: 100,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  initialsText: {
    fontSize: 32,
    fontWeight: '700',
  },
  nameSection: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: '700',
    borderBottomWidth: 2,
    paddingBottom: 4,
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 14,
  },
  themeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  themeToggleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    padding: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalItemText: {
    fontSize: 16,
  },
  closeButton: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutBox: {
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

export default MorePage;
