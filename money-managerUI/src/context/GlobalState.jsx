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
    deleteNote
} from '../db/sqlite';

// Initial state
const initialState = {
    transactions: [],
    user: { name: 'Guest' },
    currency: 'USD',
    theme: 'dark',
    notes: {}
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

    // Initial load from SQLite
    useEffect(() => {
        let mounted = true;
        (async () => {
            const initial = await loadInitialState();
            if (mounted) {
                dispatch({ type: 'INIT_STATE', payload: initial });
                document.body.setAttribute('data-theme', initial.theme);
            }
        })();
        return () => { mounted = false; };
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
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
