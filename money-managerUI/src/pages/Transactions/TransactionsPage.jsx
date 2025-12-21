import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalState';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import { ChevronLeft, ChevronRight, ChevronDown, Plus } from 'lucide-react';
import MonthYearSelector from '../../components/MonthYearSelector';
import './TransactionsPage.css';

const TransactionsPage = () => {
    const { transactions, currency } = useContext(GlobalContext);
    const [editingTransaction, setEditingTransaction] = useState(null);
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

    const handleDateChange = (d) => {
        setCurrentDate(d);
    };

    return (
        <div className="container transactions-page">
            {/* Header: Shared Month-Year Selector */}
            <MonthYearSelector value={currentDate} onChange={handleDateChange} />

            {/* Summary Stats */}
            <div className="glass-panel stats-card">
                <div className="stat">
                    <span className="stat-label">Income</span>
                    <span className="stat-value income">
                        {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : currency === 'JPY' ? '¥' : '$'}
                        {income.toFixed(2)}
                    </span>
                </div>
                <div className="stat">
                    <span className="stat-label">Expenses</span>
                    <span className="stat-value expense">
                        {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : currency === 'JPY' ? '¥' : '$'}
                        {expense.toFixed(2)}
                    </span>
                </div>
                <div className="stat">
                    <span className="stat-label">Total</span>
                    <span className="stat-value total">
                        {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : currency === 'JPY' ? '¥' : '$'}
                        {total.toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-wrapper">
                <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field search-input"
                />
            </div>

            {/* Editing Form (Conditional) */}
            {editingTransaction && (
                <div className="edit-form-wrapper">
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
                className="btn-primary fab"
                onClick={() => navigate('/add-transaction')}
                aria-label="Add transaction"
            >
                <Plus size={28} />
            </button>
        </div>
    );
};

export default TransactionsPage;
