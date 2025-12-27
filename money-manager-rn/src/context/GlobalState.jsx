import React, { createContext, useReducer, useEffect, useRef } from 'react';
import AppReducer from './AppReducer';
import {
  loadInitialState,
  addTransaction as dbAddTransaction,
  editTransaction as dbEditTransaction,
  deleteTransactionById,
  updateUserSetting,
  setCurrency,
  setTheme,
  setNote,
  deleteNote,
  listNotifications,
  createNotification as dbCreateNotification,
  updateNotification as dbUpdateNotification,
  deleteNotification as dbDeleteNotification,
} from '../db/sqlite';
import * as Notifications from 'expo-notifications';

// Initial state
const initialState = {
  transactions: [],
  user: { name: 'Guest' },
  currency: 'INR',
  theme: 'complementary',
  notes: {},
  notifications: [],
};

// Create context
export const GlobalContext = createContext(initialState);

// Notification handler setup
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  function deleteTransaction(id) {
    deleteTransactionById(id).then(() => {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    });
  }

  function addTransaction(transaction) {
    dbAddTransaction(transaction).then(() => {
      dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    });
  }

  function editTransaction(transaction) {
    dbEditTransaction(transaction).then(() => {
      dispatch({ type: 'EDIT_TRANSACTION', payload: transaction });
    });
  }

  function updateUser(user) {
    updateUserSetting(user).then(() => {
      dispatch({ type: 'UPDATE_USER', payload: user });
    });
  }

  function changeCurrency(currency) {
    setCurrency(currency).then(() => {
      dispatch({ type: 'CHANGE_CURRENCY', payload: currency });
    });
  }

  function toggleTheme(theme) {
    setTheme(theme).then(() => {
      dispatch({ type: 'TOGGLE_THEME', payload: theme });
    });
  }

  function updateNote(monthYear, text) {
    const actionPayload = { monthYear, text };
    if (!text || (typeof text === 'string' && text.length === 0)) {
      deleteNote(monthYear).then(() => {
        dispatch({ type: 'UPDATE_NOTE', payload: { monthYear, text: '' } });
      });
    } else {
      setNote(monthYear, text).then(() => {
        dispatch({ type: 'UPDATE_NOTE', payload: actionPayload });
      });
    }
  }

  // Notifications
  const timersRef = useRef(new Map());

  function clearTimerFor(id) {
    const t = timersRef.current.get(id);
    if (t) {
      clearTimeout(t);
      timersRef.current.delete(id);
    }
  }

  async function scheduleNotificationItem(item) {
    clearTimerFor(item.id);
    if (!item.enabled) return;

    const [hh, mm] = (item.time || '20:00').split(':').map(n => parseInt(n, 10));
    const now = new Date();
    const next = new Date();
    next.setHours(hh, mm, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);

    const delay = next.getTime() - now.getTime();

    const timerId = setTimeout(async () => {
      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'FinTrack Reminder',
            body: item.message || "Remember to review today's transactions.",
          },
          trigger: null, // Send immediately
        });
      } catch (e) {
        console.log('Notification error:', e);
      }

      // Reschedule if recurring
      if ((item.recurrence || 'daily') === 'daily') {
        scheduleNotificationItem(item);
      } else {
        clearTimerFor(item.id);
      }
    }, delay);

    timersRef.current.set(item.id, timerId);
  }

  function scheduleAll(items) {
    (items || []).forEach(scheduleNotificationItem);
  }

  async function addNotification(item) {
    const id = item.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const toSave = {
      id,
      time: item.time,
      message: item.message,
      enabled: !!item.enabled,
      recurrence: item.recurrence || 'daily',
    };

    // Request notification permission if needed
    if (toSave.enabled) {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Notification permission not granted');
        }
      } catch (e) {
        console.log('Permission error:', e);
      }
    }

    await dbCreateNotification(toSave);
    dispatch({ type: 'ADD_NOTIFICATION', payload: toSave });
    scheduleNotificationItem(toSave);
  }

  async function editNotification(item) {
    const toSave = {
      id: item.id,
      time: item.time,
      message: item.message,
      enabled: !!item.enabled,
      recurrence: item.recurrence || 'daily',
    };

    if (toSave.enabled) {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Notification permission not granted');
        }
      } catch (e) {
        console.log('Permission error:', e);
      }
    }

    await dbUpdateNotification(toSave);
    dispatch({ type: 'UPDATE_NOTIFICATION', payload: toSave });
    scheduleNotificationItem(toSave);
  }

  async function removeNotification(id) {
    clearTimerFor(id);
    await dbDeleteNotification(id);
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  }

  // Initial load from database
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const initial = await loadInitialState();
        const notifList = await listNotifications();
        if (mounted) {
          dispatch({ type: 'INIT_STATE', payload: initial });
          dispatch({ type: 'SET_NOTIFICATIONS', payload: notifList });
          scheduleAll(notifList);
        }
      } catch (e) {
        console.log('Error loading initial state:', e);
      }
    })();

    return () => {
      mounted = false;
      timersRef.current.forEach(t => clearTimeout(t));
      timersRef.current.clear();
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        transactions: state.transactions,
        user: state.user,
        currency: state.currency,
        theme: state.theme,
        notes: state.notes,
        deleteTransaction,
        addTransaction,
        editTransaction,
        updateUser,
        changeCurrency,
        toggleTheme,
        updateNote,
        notifications: state.notifications,
        addNotification,
        editNotification,
        removeNotification,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
