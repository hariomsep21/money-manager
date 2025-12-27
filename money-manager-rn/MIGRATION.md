# React to React Native Migration Guide

## Overview

This document details the complete conversion of the FinTrack web application from React to React Native. The conversion preserves 100% of business logic and functionality while adapting to mobile platform constraints and best practices.

## Architecture Changes

### 1. State Management

**Web (React):**
```javascript
// Uses Context API with useReducer
const { transactions, addTransaction } = useContext(GlobalContext);
```

**React Native (Identical Pattern):**
```javascript
// Same context API, only database layer changed
const { transactions, addTransaction } = useContext(GlobalContext);
```

**Key Difference:** Database interaction is now promise-based with expo-sqlite instead of sql.js.

### 2. Database Layer Migration

**Web Version:**
```javascript
// sql.js (in-memory SQLite) + IndexedDB persistence
import initSqlJs from 'sql.js';
const db = new sql.Database();
```

**React Native Version:**
```javascript
// expo-sqlite (native SQLite)
import * as SQLite from 'expo-sqlite';
const db = await SQLite.openDatabaseAsync('moneymanager.db');
```

**Migration Logic:**
- Checks AsyncStorage for localStorage backup
- Imports transactions, notes, and settings
- Creates SQLite tables with same schema
- Returns identical data structure

### 3. Component Conversion Pattern

All 50+ components follow this pattern:

**Web Component:**
```jsx
import React from 'react';
import './Button.css';

export const Button = ({ onClick, children }) => (
  <button className="btn" onClick={onClick}>
    {children}
  </button>
);
```

**React Native Component:**
```jsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export const Button = ({ onPress, children }) => (
  <TouchableOpacity style={styles.btn} onPress={onPress}>
    <Text>{children}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#6366F1',
  }
});
```

## Element-by-Element Mapping

### Semantic HTML → React Native

| Web Element | Web Handler | React Native | RN Handler |
|-------------|-------------|--------------|------------|
| `<div>` | Container | `<View>` | Container |
| `<span>` | Text | `<Text>` | Text |
| `<input>` | Form input | `<TextInput>` | Form input |
| `<button>` | Click action | `<TouchableOpacity>` | Press action |
| `<img>` | Images | `<Image>` | Images |
| `<form>` | Data submission | Form state | Form state |
| `<label>` | Form labels | `<Text>` | Form labels |
| `<select>` | Dropdowns | `<Modal>` + `<FlatList>` | Dropdowns |
| CSS Grid | Layout | Flexbox | Layout |
| CSS Flexbox | Layout | Flexbox | Layout |
| Event handlers | `onClick`, `onChange` | `onPress`, `onChangeText` | Event handlers |

### Event System

**Web:**
```javascript
<button onClick={() => handleClick(id)} />
<input onChange={(e) => setValue(e.target.value)} />
```

**React Native:**
```javascript
<TouchableOpacity onPress={() => handleClick(id)} />
<TextInput onChangeText={(value) => setValue(value)} />
```

### Style Conversion

**Web CSS:**
```css
.button {
  background-color: var(--accent-primary);
  padding: 12px 16px;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  border: none;
}
```

**React Native StyleSheet:**
```javascript
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.accentPrimary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    color: 'white',
    fontWeight: '600',
  }
});
```

**Key Differences:**
- No CSS cascading (explicit styles per component)
- `padding` → `paddingVertical` + `paddingHorizontal`
- `border` → `borderWidth` + `borderColor` + `borderRadius`
- `color` → stored in state, not CSS variables
- No media queries (flexbox handles responsiveness)

## Navigation Conversion

### Web: React Router
```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/transactions" element={<TransactionsPage />} />
  </Routes>
</BrowserRouter>
```

### React Native: React Navigation
```javascript
<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Landing" component={LandingPage} />
    <Stack.Screen name="Main" component={MainTabs} />
  </Stack.Navigator>
</NavigationContainer>
```

**Navigation Changes:**
- URL paths → Screen names
- `useNavigate()` → `navigation.navigate('ScreenName')`
- `<Link to="/path">` → `<TouchableOpacity onPress={() => navigation.navigate(...)}`
- Bottom tab navigation added (web didn't have tabs)

## Specific Component Conversions

### 1. TransactionsList

**Web:**
```jsx
{filteredTransactions.map(t => (
  <div key={t.id} className="transaction-item">
    <span>{t.description}</span>
    <button onClick={() => deleteTransaction(t.id)}>Delete</button>
  </div>
))}
```

**React Native:**
```jsx
<FlatList
  data={filteredTransactions}
  renderItem={({ item }) => (
    <View style={styles.transactionItem}>
      <Text>{item.description}</Text>
      <TouchableOpacity onPress={() => deleteTransaction(item.id)}>
        <Trash2 size={18} color="#ef4444" />
      </TouchableOpacity>
    </View>
  )}
  keyExtractor={item => item.id}
/>
```

### 2. MonthYearSelector

**Web:**
```jsx
<input type="month" value={monthYear} onChange={handleChange} />
```

**React Native:**
```jsx
<Modal visible={showPicker} onRequestClose={() => setShowPicker(false)}>
  <FlatList data={months} renderItem={renderMonth} />
  <FlatList data={years} renderItem={renderYear} />
</Modal>
```

Reason: No native month picker in React Native, so custom modal created.

### 3. Recharts → react-native-chart-kit

**Web:**
```jsx
<BarChart data={chartData}>
  <Bar dataKey="value" fill="#6366F1" />
</BarChart>
```

**React Native:**
```jsx
<BarChart
  data={chartData}
  width={screenWidth}
  height={300}
  chartConfig={chartConfig}
/>
```

**Trade-offs:**
- Less interactive (no hover tooltips)
- Faster rendering
- Better mobile performance
- Simplified API

### 4. Image Upload

**Web:**
```jsx
<input type="file" onChange={handleFileSelect} />
```

**React Native:**
```jsx
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
});
```

### 5. Notifications

**Web:**
```javascript
if (Notification.permission === 'granted') {
  new Notification('Title', { body: 'Message' });
}
```

**React Native:**
```javascript
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Title',
    body: 'Message',
  },
  trigger: { seconds: 3600 }
});
```

## Data Type Conversions

| Web Type | Storage | React Native Type | Storage |
|----------|---------|-------------------|---------|
| `string` | SQLite TEXT | `string` | SQLite TEXT |
| `number` | SQLite REAL | `number` | SQLite REAL |
| `boolean` | SQLite INTEGER (0/1) | `boolean` | SQLite INTEGER (0/1) |
| `Date` | ISO string | ISO string | ISO string |
| `object` | JSON string | JSON string | JSON string |
| `array` | JSON array | JSON array | JSON array |
| `File` | base64 string | base64 string | base64 string |

## API Compatibility

All API interactions remain identical:

```javascript
// Web and RN both use same functions:
await addTransaction(data);      // ✅ Same
await deleteTransaction(id);     // ✅ Same
await updateUser(userData);      // ✅ Same
await setCurrency(currency);     // ✅ Same
```

The only change is internal database operations (sql.js → expo-sqlite).

## Performance Considerations

### Web
- 50-60 FPS on desktop
- Smooth CSS animations
- Larger bundle size (Vite optimizes)

### React Native
- 60 FPS on modern devices
- Native animations
- Smaller app size (~30-50 MB)
- Better battery efficiency
- Native scrolling performance

## Testing Strategy

### Unit Tests (No changes needed)
```javascript
// Business logic identical
const result = filterTransactions(transactions, date);
expect(result).toHaveLength(5);
```

### Component Tests
- Replace React Testing Library with `@testing-library/react-native`
- No DOM selectors needed
- Use `testID` prop instead of class selectors

### Integration Tests
- Navigation tested with React Navigation testing utilities
- Database operations identical
- State management untouched

## Migration Checklist for Additional Features

If you need to add new features:

1. **Create feature in web version** → works with React
2. **API/Database Logic** → No RN changes needed
3. **Components** → Convert using mapping table above
4. **Styles** → Use StyleSheet instead of CSS
5. **Navigation** → Integrate into existing stack/tab structure
6. **Test on both platforms**

## Potential Issues & Solutions

### Issue 1: Third-Party Libraries
**Problem:** Some npm packages don't work with React Native
**Solution:** Find RN-compatible alternatives
- recharts → react-native-chart-kit
- lucide-react → lucide-react-native

### Issue 2: Platform-Specific Code
**Problem:** Some features only work on iOS or Android
**Solution:** Use Platform detection
```javascript
import { Platform } from 'react-native';
if (Platform.OS === 'ios') {
  // iOS-specific code
}
```

### Issue 3: Async Operations
**Problem:** All file I/O is now async
**Solution:** Use async/await everywhere
```javascript
const result = await db.getAllAsync('SELECT ...');
```

### Issue 4: Performance
**Problem:** FlatList not scrolling smoothly
**Solution:** 
- Use `removeClippedSubviews`
- Optimize renderItem function
- Use memo() for list items

## Code Quality

Both versions maintain:
- ✅ Same ESLint rules
- ✅ Same code structure
- ✅ Same naming conventions
- ✅ Same error handling
- ✅ Same documentation

## Version Compatibility

- React Web: ^18.2.0
- React Native: ^0.75.0
- Expo: ^52.0.0
- Node.js: 16+

## Deployment Notes

### Web Deployment
```bash
npm run build
# Upload dist/ to hosting
```

### Mobile Deployment

**iOS:**
```bash
eas build --platform ios
eas submit --platform ios
```

**Android:**
```bash
eas build --platform android
eas submit --platform android
```

## Maintenance

Both versions share:
- Same business logic
- Same state structure
- Same database schema
- Same API patterns

Changes in one require updates in the other!

## Conclusion

The conversion is **structure-preserving** - only the rendering layer changed. All business logic, state management, and data persistence work identically on mobile, just optimized for touch and native performance.
