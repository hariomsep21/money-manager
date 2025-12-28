import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GlobalContext } from '../context/GlobalState';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Pages
import LandingPage from '../pages/Landing/LandingPage';
import TransactionsPage from '../pages/Transactions/TransactionsPage';
import AddTransactionPage from '../pages/Transactions/AddTransactionPage';
import AnalyticsPage from '../pages/Analytics/AnalyticsPage';
import NotesPage from '../pages/Notes/NotesPage';
import NotificationsPage from '../pages/Notifications/NotificationsPage';
import MorePage from '../pages/More/MorePage';
import AboutPage from '../pages/More/AboutPage';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

function TransactionsStack() {
  const { colors } = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.bgTertiary,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Stack.Screen name="TransactionsList" component={TransactionsPage} />
      <Stack.Screen name="AddTransaction" component={AddTransactionPage} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  const { colors } = useTheme();

  return (
    <MoreStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.bgTertiary,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: colors.bgPrimary,
        },
      }}
    >
      <MoreStack.Screen
        name="MoreHome"
        component={MorePage}
        options={{ headerShown: false }}
      />
      <MoreStack.Screen
        name="About"
        component={AboutPage}
        options={{ title: 'About' }}
      />
    </MoreStack.Navigator>
  );
}

function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accentPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.bgTertiary,
          borderTopColor: colors.borderColor,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="TransactionsTab"
        component={TransactionsStack}
        options={{
          tabBarLabel: 'Trans.',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" color={color} size={size || 24} />
          ),
        }}
      />
      <Tab.Screen
        name="AnalyticsTab"
        component={AnalyticsPage}
        options={{
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" color={color} size={size || 24} />
          ),
        }}
      />
      <Tab.Screen
        name="NotesTab"
        component={NotesPage}
        options={{
          tabBarLabel: 'Notes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color} size={size || 24} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size || 24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { theme } = useContext(GlobalContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Landing">
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Notifications" component={NotificationsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
