import React, { createContext, useReducer, useEffect } from 'react';
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
    getNotificationSettings,
    setNotificationSettings
} from '../db/sqlite';

// Initial state
const initialState = {
    transactions: [],
    user: { name: 'Guest' },
    currency: 'USD',
    theme: 'dark',
    notes: {},
    notifications: { enabled: false, message: "Remember to review today's transactions.", time: '20:00' }
};

// Create context
export const GlobalContext = createContext(initialState);

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
    const scheduleRef = React.useRef(null);
    function scheduleNotification(settings) {
        if (scheduleRef.current) {
            clearTimeout(scheduleRef.current);
            scheduleRef.current = null;
        }
        if (!settings?.enabled) return;
        const [hh, mm] = (settings.time || '20:00').split(':').map(n => parseInt(n, 10));
        const now = new Date();
        const next = new Date();
        next.setHours(hh, mm, 0, 0);
        if (next <= now) next.setDate(next.getDate() + 1);
        const delay = next.getTime() - now.getTime();
        scheduleRef.current = setTimeout(() => {
            try {
                if (Notification && Notification.permission === 'granted') {
                    new Notification(settings.message || "Remember to review today's transactions.");
                } else {
                    // Fallback: simple alert if permission not granted
                    alert(settings.message || "Remember to review today's transactions.");
                }
            } catch {
                alert(settings.message || "Remember to review today's transactions.");
            }
            // reschedule for next day
            scheduleNotification(settings);
        }, delay);
    }

    async function updateNotifications(newSettings) {
        const merged = { ...state.notifications, ...newSettings };
        // ask permission when enabling
        if (merged.enabled && typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
            try { await Notification.requestPermission(); } catch { /* ignore */ }
        }
        await setNotificationSettings(merged);
        dispatch({ type: 'UPDATE_NOTIFICATIONS', payload: merged });
        scheduleNotification(merged);
    }

    // Initial load from SQLite
    useEffect(() => {
        let mounted = true;
        (async () => {
            const initial = await loadInitialState();
            const notif = await getNotificationSettings();
            if (mounted) {
                dispatch({ type: 'INIT_STATE', payload: { ...initial, notifications: notif } });
                document.body.setAttribute('data-theme', initial.theme);
                scheduleNotification(notif);
            }
        })();
        return () => { mounted = false; if (scheduleRef.current) clearTimeout(scheduleRef.current); };
    }, []);

    // Keep theme attribute updated
    useEffect(() => {
        document.body.setAttribute('data-theme', state.theme);
    }, [state.theme]);

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
                updateNote
                ,
                notifications: state.notifications,
                updateNotifications
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
