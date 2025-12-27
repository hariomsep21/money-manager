# FinTrack - React Native Edition

This is a complete React Native conversion of the FinTrack money management web application. The app maintains 100% feature parity with the original React web version while fully optimizing for iOS and Android platforms.

## 📋 Conversion Summary

### ✅ What's Been Converted

| Feature | Status | Notes |
|---------|--------|-------|
| **Transactions Management** | ✅ Complete | Add, edit, delete with full filtering |
| **Analytics & Charts** | ✅ Complete | Bar chart visualization of spending by category |
| **Monthly Notes** | ✅ Complete | Month-based note storage with month selector |
| **Theme System** | ✅ Complete | Dark (complementary) and Light (orange) themes |
| **Currency Support** | ✅ Complete | USD, EUR, GBP, INR, JPY with proper symbols |
| **Notifications** | ✅ Complete | Scheduled daily/recurring notifications |
| **Profile Management** | ✅ Complete | User profile, image upload, settings |
| **Data Persistence** | ✅ Complete | SQLite database with AsyncStorage fallback |
| **Navigation** | ✅ Complete | React Navigation (bottom tabs + stack) |
| **Responsive Design** | ✅ Complete | Mobile-optimized layouts |

### 🔧 Technology Replacements

| Web | React Native |
|-----|--------------|
| React Router | React Navigation |
| CSS / CSS-in-JS | React Native StyleSheet |
| HTML elements (div, button, input) | RN components (View, TouchableOpacity, TextInput) |
| sql.js + IndexedDB | expo-sqlite + AsyncStorage |
| Recharts | react-native-chart-kit |
| lucide-react | lucide-react-native |
| Browser Notifications API | expo-notifications |
| File Input API | expo-image-picker |
| localStorage | AsyncStorage |

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (for iOS simulator)
- Android: Android Studio (for Android emulator)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd money-manager-rn
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo server:**
   ```bash
   npm start
   ```

4. **Run on your preferred platform:**

   - **iOS (Simulator):**
     ```bash
     npm run ios
     ```

   - **Android (Emulator):**
     ```bash
     npm run android
     ```

   - **Web (Testing):**
     ```bash
     npm run web
     ```

   - **Physical Device:**
     - Install Expo Go from App Store or Play Store
     - Scan QR code from terminal

## 📁 Project Structure

```
money-manager-rn/
├── src/
│   ├── App.jsx                      # Root component
│   ├── index.js                     # App entry point
│   ├── context/
│   │   ├── GlobalState.jsx          # Global state with notifications
│   │   └── AppReducer.js            # State reducer
│   ├── db/
│   │   └── sqlite.js                # Database layer (expo-sqlite)
│   ├── theme/
│   │   ├── colors.js                # Theme definitions
│   │   └── ThemeContext.js          # Theme provider
│   ├── navigation/
│   │   └── Navigation.jsx           # React Navigation setup
│   ├── components/
│   │   ├── MonthYearSelector.jsx    # Month/year picker
│   │   └── SimpleTimePicker.jsx     # Time picker for notifications
│   └── pages/
│       ├── Landing/
│       │   └── LandingPage.jsx
│       ├── Transactions/
│       │   ├── TransactionsPage.jsx
│       │   └── AddTransactionPage.jsx
│       ├── Analytics/
│       │   └── AnalyticsPage.jsx
│       ├── Notes/
│       │   └── NotesPage.jsx
│       ├── More/
│       │   └── MorePage.jsx
│       └── Notifications/
│           └── NotificationsPage.jsx
├── app.json                         # Expo config
├── babel.config.js
├── package.json
└── README.md
```

## 🔑 Key Implementation Details

### 1. **Database Layer** (`src/db/sqlite.js`)

Uses **expo-sqlite** for local SQLite storage instead of sql.js:

```javascript
// Automatically migrates from AsyncStorage if needed
// Schema includes: transactions, notes, settings, notifications
const db = await initDB();
await addTransaction(transactionData);
```

Features:
- Automatic schema creation
- Migration from web localStorage
- Async/await API
- All query operations preserved

### 2. **State Management** (`src/context/GlobalState.jsx`)

Maintains identical reducer pattern with React Native notifications:

```javascript
// All actions from web version are preserved
const { addTransaction, deleteTransaction, editTransaction } = useContext(GlobalContext);

// Notifications use expo-notifications instead of Browser API
await Notifications.scheduleNotificationAsync({
  content: { title, body },
  trigger: null
});
```

### 3. **Theme System** (`src/theme/ThemeContext.js`)

Replaces CSS variables with React Native context:

```javascript
const { colors, theme } = useTheme();

// Access: colors.bgPrimary, colors.accentPrimary, etc.
<View style={{ backgroundColor: colors.bgPrimary }} />
```

Supports:
- **Dark theme**: Deep grays, indigo accent
- **Light theme**: White/cream, orange accent
- Dynamic switching with state persistence

### 4. **Navigation** (`src/navigation/Navigation.jsx`)

**Bottom Tab Navigation** with 4 main screens:
- Transactions (with stack for add/edit)
- Analytics
- Notes
- Profile (More)

Plus modal navigation for Notifications.

### 5. **Components**

All components converted to RN equivalents:

| Web | React Native |
|-----|--------------|
| `<input>` | `<TextInput>` |
| `<div>` | `<View>` |
| `<button>` | `<TouchableOpacity>` |
| `<span>` | `<Text>` |
| `<img>` | `<Image>` |
| CSS flexbox | StyleSheet flexbox (identical) |

## 🎨 Theme Customization

Edit `src/theme/colors.js` to customize colors:

```javascript
export const themes = {
  complementary: {
    bgPrimary: '#121212',      // Main background
    accentPrimary: '#6366F1',  // Primary accent
    accentOrange: '#f97316',   // Orange (currency, etc.)
    accentGreen: '#10b981',    // Income (green)
    accentRed: '#ef4444',      // Expense (red)
    // ... more colors
  },
  orange: {
    // Light theme colors
  }
};
```

## 📱 Platform-Specific Features

### iOS
- Safe Area insets automatically handled
- Native Image Picker integration
- Notification permissions
- Document picker for image uploads

### Android
- Material Design styling
- Back button handling
- File permissions
- Notification channels

## 🧪 Testing Checklist

- [ ] Add/edit/delete transactions
- [ ] Filter transactions by month and search
- [ ] View analytics charts
- [ ] Create and edit monthly notes
- [ ] Toggle between light/dark themes
- [ ] Change currency
- [ ] Upload profile image
- [ ] Create scheduled notifications
- [ ] Data persists after app restart
- [ ] All numbers format correctly with currency symbols

## 🔄 Data Migration

The app automatically migrates data from the web version:

1. **From localStorage** → SQLite database
2. **Notification settings** → New notification system
3. All existing transactions, notes, and settings are preserved

First launch will check AsyncStorage and import any existing data.

## 🚨 Important Notes

### Notifications
- iOS: Set `Info.plist` permissions (handled by Expo)
- Android: Notifications appear in system tray
- User must grant permission on first use

### Image Upload
- Uses `expo-image-picker`
- Converts to base64 for storage
- Handles both library and camera access

### Dates
- Format: `YYYY-MM-DD`
- Month selector UI shows full month/year
- Stored as strings for compatibility

## 📦 Dependencies

Key libraries used:
- `expo`: Development framework
- `react-native`: Core framework
- `@react-navigation/*`: Navigation
- `expo-sqlite`: Database
- `@react-native-async-storage/async-storage`: Key-value storage
- `react-native-chart-kit`: Charts
- `expo-notifications`: Push notifications
- `expo-image-picker`: Image selection
- `lucide-react-native`: Icons
- `date-fns`: Date utilities

## 🐛 Troubleshooting

### App doesn't start
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start
```

### Database issues
- Clear app data in settings
- Check app permissions
- Verify SQLite initialization in logs

### Notification issues
- Grant notification permissions when prompted
- Check system notification settings
- Verify notification time format (HH:MM)

### Image upload fails
- Grant camera/photo library permissions
- Check file size limits
- Ensure valid base64 conversion

## 🔐 Storage & Privacy

- All data stored locally on device
- No cloud sync
- SQLite database in app sandbox
- AsyncStorage for simple key-value pairs
- Images stored as base64 strings in DB

## 📄 License

Same as original web project

## 🎯 Feature Completeness

✅ **100% Feature Parity** - All functionality from web version
✅ **Mobile Optimized** - Touch-friendly UI
✅ **Offline First** - Works without internet
✅ **Data Persistence** - SQLite + AsyncStorage
✅ **Responsive** - Adapts to all screen sizes
✅ **Dark & Light Themes** - User-switchable
✅ **Notifications** - Scheduled and recurring
✅ **Charts** - Visual analytics
✅ **Multi-currency** - 5 currency support

---

## Next Steps

1. Build for iOS/Android production
2. Deploy to App Store/Play Store
3. Configure app signing certificates
4. Set up automatic updates with EAS

For detailed build instructions, see: [Expo Build Guide](https://docs.expo.dev/build/introduction/)
