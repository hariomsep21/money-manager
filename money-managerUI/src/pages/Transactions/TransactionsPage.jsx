import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalState';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import { ChevronLeft, ChevronRight, ChevronDown, Plus } from 'lucide-react';

const TransactionsPage = () => {
    const { transactions, currency } = useContext(GlobalContext);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const clearEdit = () => {
        setEditingTransaction(null);
    };

    const [currentDate, setCurrentDate] = useState(new Date());

    // Filter transactions by month year AND search term
    const filteredTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        const matchesDate = tDate.getMonth() === currentDate.getMonth() && tDate.getFullYear() === currentDate.getFullYear();
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
            t.amount.toString().includes(searchTerm);
        return matchesDate && matchesSearch;
    });

    const income = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const expense = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const total = income - expense;

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value);
        const newDate = new Date(currentDate);
        newDate.setFullYear(newYear);
        setCurrentDate(newDate);
        setShowDatePicker(false);
    };

    const handleMonthChange = (e) => {
        const newMonth = parseInt(e.target.value);
        const newDate = new Date(currentDate);
        newDate.setMonth(newMonth);
        setCurrentDate(newDate);
        setShowDatePicker(false);
    };

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            {/* Header: Month Selector */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className="icon-btn" onClick={prevMonth}>
                        <ChevronLeft size={24} />
                    </button>
                    <div
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                        <h2 style={{ fontSize: '1.2rem' }}>{currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</h2>
                        <ChevronDown size={16} style={{ opacity: 0.7 }} />
                    </div>
                    <button className="icon-btn" onClick={nextMonth}>
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Date Picker Dropdown */}
                {showDatePicker && (
                    <div className="glass-panel" style={{ marginTop: '1rem', padding: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <select
                            className="input-field"
                            value={currentDate.getFullYear()}
                            onChange={handleYearChange}
                            style={{ width: 'auto' }}
                        >
                            {Array.from({ length: 11 }, (_, i) => 2020 + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <select
                            className="input-field"
                            value={currentDate.getMonth()}
                            onChange={handleMonthChange}
                            style={{ width: 'auto' }}
                        >
                            {Array.from({ length: 12 }, (_, i) => i).map(month => (
                                <option key={month} value={month}>{new Date(0, month).toLocaleString('en-US', { month: 'long' })}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Summary Stats Code */}
            <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', padding: '1.5rem 1rem' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Income</p>
                    <p style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>
                        {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : currency === 'JPY' ? '¥' : '$'}
                        {income.toFixed(2)}
                    </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Expenses</p>
                    <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
                        {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : currency === 'JPY' ? '¥' : '$'}
                        {expense.toFixed(2)}
                    </p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total</p>
                    <p style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                        {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : currency === 'JPY' ? '¥' : '$'}
                        {total.toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                    style={{
                        width: '100%',
                        padding: '0.8rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem'
                    }}
                />
            </div>

            {/* Editing Form (Conditional) */}
            {editingTransaction && (
                <div style={{ marginBottom: '2rem' }}>
                    <TransactionForm
                        transactionToEdit={editingTransaction}
                        clearEdit={clearEdit}
                        onSuccess={() => setEditingTransaction(null)}
                    />
                </div>
            )}

            {/* Transactions List */}
            <TransactionList transactions={filteredTransactions} onEdit={setEditingTransaction} />


            {/* Floating Add Button */}
            <button
                className="btn-primary"
                onClick={() => navigate('/add-transaction')}
                style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '2rem',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
                    padding: 0,
                    zIndex: 100
                }}
            >
                <Plus size={32} />
            </button>
        </div>
    );
};

export default TransactionsPage;
