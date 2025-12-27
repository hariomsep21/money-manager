# Development Guide & Code Examples

## Adding a New Feature

### Example: Add "Budget Limit" Feature

#### Step 1: Update Database Schema

**File:** `src/db/sqlite.js`

```javascript
// In initDB() function, add to CREATE TABLE:
await db.execAsync(`
  ...existing tables...
  CREATE TABLE IF NOT EXISTS budgets (
    id TEXT PRIMARY KEY,
    category TEXT,
    limit_amount REAL,
    month_year TEXT
  );
`);
```

#### Step 2: Add Database Functions

```javascript
// Add to src/db/sqlite.js

export async function addBudget(budget) {
  const dbi = await initDB();
  await dbi.runAsync(
    'INSERT OR REPLACE INTO budgets (id, category, limit_amount, month_year) VALUES (?, ?, ?, ?)',
    [budget.id, budget.category, budget.limit_amount, budget.month_year]
  );
}

export async function getBudgets(monthYear) {
  const dbi = await initDB();
  return await dbi.getAllAsync(
    'SELECT * FROM budgets WHERE month_year = ?',
    [monthYear]
  );
}
```

#### Step 3: Update Context/Reducer

**File:** `src/context/AppReducer.js`

```javascript
case 'ADD_BUDGET':
  return {
    ...state,
    budgets: [...(state.budgets || []), action.payload]
  };

case 'DELETE_BUDGET':
  return {
    ...state,
    budgets: (state.budgets || []).filter(b => b.id !== action.payload)
  };
```

#### Step 4: Update GlobalState

**File:** `src/context/GlobalState.jsx`

```javascript
// Add to initial state:
const initialState = {
  ...existing,
  budgets: []
};

// Add action function:
function addBudget(budget) {
  dbAddBudget(budget).then(() => {
    dispatch({ type: 'ADD_BUDGET', payload: budget });
  });
}

// Add to context value:
value={{
  ...existing,
  budgets: state.budgets,
  addBudget
}}
```

#### Step 5: Create UI Component

**File:** `src/pages/Budgets/BudgetsPage.jsx`

```jsx
import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { GlobalContext } from '../../context/GlobalState';
import MonthYearSelector from '../../components/MonthYearSelector';

const BudgetsPage = () => {
  const { colors } = useTheme();
  const { budgets, addBudget } = useContext(GlobalContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthYear = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const monthBudgets = (budgets || []).filter(b => b.month_year === monthYear);

  const handleAddBudget = () => {
    const newBudget = {
      id: `${Date.now()}`,
      category: 'Food',
      limit_amount: 500,
      month_year: monthYear
    };
    addBudget(newBudget);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <MonthYearSelector value={currentDate} onChange={setCurrentDate} />
      
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.accentPrimary }]}
        onPress={handleAddBudget}
      >
        <Text style={{ color: '#fff' }}>+ Add Budget</Text>
      </TouchableOpacity>

      <FlatList
        data={monthBudgets}
        renderItem={({ item }) => (
          <View style={[styles.budgetItem, { backgroundColor: colors.bgTertiary }]}>
            <Text style={{ color: colors.textPrimary }}>{item.category}</Text>
            <Text style={{ color: colors.accentBlue }}>₹{item.limit_amount}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetItem: {
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  }
});

export default BudgetsPage;
```

#### Step 6: Add to Navigation

**File:** `src/navigation/Navigation.jsx`

```javascript
import BudgetsPage from '../pages/Budgets/BudgetsPage';

// In MainTabs:
<Tab.Screen
  name="BudgetsTab"
  component={BudgetsPage}
  options={{
    tabBarLabel: 'Budgets',
    tabBarIcon: ({ color }) => <TrendingUp color={color} size={24} />
  }}
/>
```

## Common Patterns

### Pattern 1: Form with Modal Dropdown

```jsx
import React, { useState } from 'react';
import { Modal, FlatList, TouchableOpacity, Text, View } from 'react-native';

function FormWithDropdown() {
  const [selectedValue, setSelectedValue] = useState('Option 1');
  const [modalVisible, setModalVisible] = useState(false);
  const options = ['Option 1', 'Option 2', 'Option 3'];

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text>{selectedValue}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#333', paddingBottom: 20 }}>
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedValue(item);
                    setModalVisible(false);
                  }}
                  style={{ padding: 15 }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
```

### Pattern 2: Async Data Loading

```jsx
useEffect(() => {
  let mounted = true;
  
  (async () => {
    try {
      const data = await loadData();
      if (mounted) {
        setData(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  })();

  return () => { mounted = false; };
}, []);
```

### Pattern 3: Theme-Aware Styling

```jsx
const MyComponent = () => {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: colors.bgPrimary }
    ]}>
      <Text style={[
        styles.title,
        { color: colors.textPrimary }
      ]}>
        Hello
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '700'
  }
});
```

### Pattern 4: Form Validation

```jsx
const handleSubmit = () => {
  const errors = {};

  if (!name.trim()) {
    errors.name = 'Name is required';
  }

  if (!email.includes('@')) {
    errors.email = 'Invalid email';
  }

  if (Object.keys(errors).length > 0) {
    Alert.alert('Validation Error', Object.values(errors).join('\n'));
    return;
  }

  // Proceed with submission
  submitForm();
};
```

### Pattern 5: List with Swipe Actions

```jsx
// Using FlatList with onLongPress for delete
<FlatList
  data={items}
  renderItem={({ item }) => (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <TouchableOpacity
        onLongPress={() => Alert.alert('Delete?', '', [
          { text: 'Cancel' },
          { text: 'Delete', onPress: () => deleteItem(item.id), style: 'destructive' }
        ])}
      >
        <Text>Hold to delete</Text>
      </TouchableOpacity>
    </View>
  )}
  keyExtractor={item => item.id}
/>
```

## Debugging Tips

### 1. Enable Debug Menu
```javascript
// In app, shake device or press:
// iOS: Cmd+D in simulator
// Android: Cmd+M in emulator
```

### 2. Console Logging
```javascript
console.log('User:', user);
console.warn('Warning:', message);
console.error('Error:', error);

// Check logs:
// npm start → shows console output
```

### 3. Network Debugging
```javascript
// Add in App.js for debugging
import { LogBox } from 'react-native';
// LogBox.ignoreAllLogs(); // Disable yellow warnings
```

### 4. Redux DevTools (if using Redux)
```javascript
// Install: npm install redux-devtools-extension
// Configure in store setup
```

### 5. Database Inspection

```javascript
// Temporary debug function
export async function debugDB() {
  const dbi = await initDB();
  const txs = await dbi.getAllAsync('SELECT * FROM transactions');
  console.log('Transactions:', txs);
}

// Call from component for testing
```

## Performance Optimization

### 1. Memoize Components
```jsx
import { memo } from 'react';

const TransactionItem = memo(({ item, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Text>{item.description}</Text>
  </TouchableOpacity>
));

export default TransactionItem;
```

### 2. Optimize FlatList
```jsx
<FlatList
  data={largeList}
  renderItem={renderItem}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
/>
```

### 3. Use useCallback for Handlers
```jsx
const handleDelete = useCallback((id) => {
  deleteTransaction(id);
}, [deleteTransaction]);

<FlatList
  data={transactions}
  renderItem={({ item }) => (
    <Item onDelete={() => handleDelete(item.id)} />
  )}
/>
```

## Testing Examples

### Unit Test
```javascript
// __tests__/currency.test.js
import { getCurrencySymbol } from '../theme/colors';

describe('getCurrencySymbol', () => {
  it('returns correct symbol for USD', () => {
    expect(getCurrencySymbol('USD')).toBe('$');
  });

  it('returns default symbol for unknown currency', () => {
    expect(getCurrencySymbol('UNKNOWN')).toBe('$');
  });
});
```

### Component Test
```javascript
// __tests__/MonthYearSelector.test.jsx
import React from 'react';
import { render } from '@testing-library/react-native';
import MonthYearSelector from '../components/MonthYearSelector';

describe('MonthYearSelector', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(
      <MonthYearSelector value={new Date()} onChange={() => {}} />
    );
    expect(getByTestId('month-year-button')).toBeTruthy();
  });
});
```

## Environment Setup

### .env File (if needed)
```bash
# .env
API_URL=https://api.example.com
LOG_LEVEL=debug
```

Load in app:
```javascript
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.apiUrl;
```

## Useful Commands

```bash
# Start development
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Build for production
eas build --platform ios
eas build --platform android

# Run tests
npm test

# Lint code
npx eslint src/

# Format code
npx prettier --write src/
```

## Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit)
- [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)

---

This guide provides the patterns and examples needed to extend the FinTrack app with new features while maintaining consistency with the existing codebase.
