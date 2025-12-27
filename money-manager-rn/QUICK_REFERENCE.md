# Quick Reference Guide

## 🚀 Commands

```bash
# Setup
npm install
npm start

# Run on devices
npm run ios                # iOS Simulator
npm run android           # Android Emulator
npm run web              # Web (testing)

# Build for production
eas build --platform ios
eas build --platform android

# Code quality
npx eslint src/
npx prettier --write src/
```

## 📁 File Locations Quick Index

| What | Where |
|------|-------|
| Add new page | `src/pages/FeatureName/FeatureName.jsx` |
| Add component | `src/components/ComponentName.jsx` |
| Theme colors | `src/theme/colors.js` |
| Database functions | `src/db/sqlite.js` |
| State management | `src/context/GlobalState.jsx` |
| Navigation setup | `src/navigation/Navigation.jsx` |
| App entry | `src/App.jsx` |

## 🎨 Common Styling

```jsx
import { StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

const MyComponent = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Title</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
});
```

## 🔄 Context Usage

```jsx
import { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';

const MyComponent = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    user,
    updateUser,
    currency,
    changeCurrency,
    theme,
    toggleTheme,
  } = useContext(GlobalContext);

  // Use any of these in your component
};
```

## 🗄️ Database Usage

```javascript
import {
  addTransaction,
  deleteTransaction,
  editTransaction,
  setCurrency,
  setTheme,
  setNote,
  deleteNote,
  addNotification,
  editNotification,
  deleteNotification,
} from '../../db/sqlite';

// All are async
await addTransaction(data);
await deleteTransaction(id);
```

## 🧭 Navigation

```jsx
// Navigate to another screen
navigation.navigate('TransactionsTab');
navigation.navigate('Notifications');

// Go back
navigation.goBack();

// Pass params
navigation.navigate('AddTransaction', { transaction: item });

// Receive params
const { params } = route;
const transaction = params?.transaction;
```

## 💾 Persisting Data

```javascript
// Automatic with context
const { addTransaction } = useContext(GlobalContext);
await addTransaction(data); // Saves to DB

// Direct DB access
import { setNote } from '../../db/sqlite';
await setNote('2024-12', 'Monthly notes here');
```

## 🔔 Notifications

```javascript
const { notifications, addNotification } = useContext(GlobalContext);

// Add notification
await addNotification({
  id: 'notif-1',
  time: '20:00',
  message: 'Reminder message',
  enabled: true,
  recurrence: 'daily'
});
```

## 🎨 Theme Usage

```javascript
import { useTheme } from '../../theme/ThemeContext';

const { colors, theme } = useTheme();

// Colors available:
colors.bgPrimary
colors.bgSecondary
colors.bgTertiary
colors.textPrimary
colors.textSecondary
colors.textMuted
colors.accentPrimary
colors.accentBlue
colors.accentOrange
colors.accentGreen
colors.accentRed
colors.borderColor

// Current theme: 'complementary' or 'orange'
```

## 💱 Currency

```javascript
import { getCurrencySymbol, currencySymbols } from '../../theme/colors';

// Get symbol
const symbol = getCurrencySymbol('USD'); // '$'
const symbol = getCurrencySymbol('INR'); // '₹'

// Direct access
currencySymbols.USD    // '$'
currencySymbols.EUR    // '€'
currencySymbols.GBP    // '£'
currencySymbols.INR    // '₹'
currencySymbols.JPY    // '¥'
```

## 📅 Date Formatting

```javascript
import { format, parse } from 'date-fns';

// Format date
format(new Date(), 'yyyy-MM-dd'); // '2024-12-27'

// Parse date
const date = parse('2024-12-27', 'yyyy-MM-dd', new Date());

// Get month-year
const monthYear = `${year}-${month.padStart(2, '0')}`;
```

## 🎯 Common Component Patterns

### Button
```jsx
<TouchableOpacity onPress={() => handlePress()} style={styles.button}>
  <Text style={styles.buttonText}>Click Me</Text>
</TouchableOpacity>
```

### Input
```jsx
<TextInput
  style={styles.input}
  placeholder="Enter text"
  value={text}
  onChangeText={setText}
/>
```

### List
```jsx
<FlatList
  data={items}
  renderItem={({ item }) => <ItemComponent item={item} />}
  keyExtractor={item => item.id}
  scrollEnabled={false}
/>
```

### Modal
```jsx
<Modal visible={visible} transparent animationType="slide">
  <View style={styles.modal}>
    {/* Content */}
    <TouchableOpacity onPress={() => setVisible(false)}>
      <Text>Close</Text>
    </TouchableOpacity>
  </View>
</Modal>
```

### Dropdown
```jsx
const [selectedValue, setSelectedValue] = useState('Option 1');
const [modalVisible, setModalVisible] = useState(false);

<TouchableOpacity onPress={() => setModalVisible(true)}>
  <Text>{selectedValue}</Text>
</TouchableOpacity>

<Modal visible={modalVisible}>
  <FlatList
    data={options}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => {
        setSelectedValue(item);
        setModalVisible(false);
      }}>
        <Text>{item}</Text>
      </TouchableOpacity>
    )}
  />
</Modal>
```

## ⚠️ Alerts

```javascript
import { Alert } from 'react-native';

// Simple alert
Alert.alert('Title', 'Message');

// Confirmation
Alert.alert(
  'Delete?',
  'Are you sure?',
  [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => handleDelete() }
  ]
);
```

## 🐛 Debugging

```javascript
// Console
console.log('Debug:', value);
console.warn('Warning:', message);
console.error('Error:', error);

// Log to see in terminal
// npm start shows all logs

// In Expo Go app:
// Shake device → Debug menu
```

## 🎞️ Screen Names

```javascript
// Available screens for navigation:
'Landing'
'Main'
'TransactionsList'
'AddTransaction'
'AnalyticsTab'
'NotesTab'
'ProfileTab'
'Notifications'
```

## 📊 Styling Tips

```javascript
// Flexbox (all RN layouts)
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',      // Horizontal
    justifyContent: 'center',  // H-align
    alignItems: 'center',      // V-align
    gap: 8,                    // Space between
  },
  column: {
    flex: 1,                   // Take all space
    flexDirection: 'column',   // Vertical (default)
  },
});

// Colors
backgroundColor: colors.bgPrimary
color: colors.textPrimary
borderColor: colors.borderColor
borderWidth: 1

// Spacing
padding: 16
paddingVertical: 12
paddingHorizontal: 16
margin: 8
marginTop: 4

// Size
width: 100
height: 100
aspectRatio: 1

// Radius
borderRadius: 8
borderTopLeftRadius: 12
```

## 🔑 Form Validation

```javascript
const validateForm = () => {
  const errors = {};

  if (!name.trim()) errors.name = 'Required';
  if (!email.includes('@')) errors.email = 'Invalid email';
  if (amount <= 0) errors.amount = 'Must be positive';

  if (Object.keys(errors).length > 0) {
    Alert.alert('Validation Error', Object.values(errors).join('\n'));
    return false;
  }

  return true;
};
```

## 🔗 Linking to Pages

```jsx
// From anywhere in app
navigation.navigate('ScreenName', { param: value });

// Receiving in component
const { params } = route;
const value = params?.param;
```

## 🎨 Layout Tricks

```jsx
// Full screen
<View style={{ flex: 1 }}>

// Center content
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

// Spacer
<View style={{ flex: 1 }} />

// Row with space-between
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

// Safe area
<SafeAreaView style={{ flex: 1 }}>
```

## 📱 Platform Specific

```javascript
import { Platform } from 'react-native';

if (Platform.OS === 'ios') {
  // iOS only
} else if (Platform.OS === 'android') {
  // Android only
}
```

## 🔐 Permissions

```javascript
// Image picker auto-requests
// Notifications auto-request

// Manual request:
import * as Notifications from 'expo-notifications';
const { status } = await Notifications.requestPermissionsAsync();
if (status === 'granted') {
  // Has permission
}
```

## 📚 Key Files to Know

- `src/App.jsx` - App root
- `src/index.js` - Entry point
- `src/context/GlobalState.jsx` - All app state
- `src/db/sqlite.js` - All database ops
- `src/theme/ThemeContext.js` - Theme provider
- `src/theme/colors.js` - Color definitions
- `src/navigation/Navigation.jsx` - All routes

---

**Print this page or bookmark for quick reference while coding!**
