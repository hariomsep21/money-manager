import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { Trash2, Edit2, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import './TransactionList.css';

const TransactionList = ({ onEdit, transactions }) => {
    // const { transactions } = useContext(GlobalContext); // Removed context usage for list data, receiving props now.
    const { deleteTransaction, currency } = useContext(GlobalContext);

    if (!transactions.length) {
        return (
            <div className="glass-panel empty-state">
                <p>No transactions added yet.</p>
            </div>
        )
    }

    // Sort transactions by date descending
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    const groupedTransactions = sortedTransactions.reduce((groups, transaction) => {
        const date = transaction.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {});

    return (
        <div className="transaction-list">
            {Object.keys(groupedTransactions).map(date => {
                const dayTransactions = groupedTransactions[date];
                const dayTotal = dayTransactions.reduce((sum, t) => sum + (t.type === 'expense' ? -Math.abs(t.amount) : Math.abs(t.amount)), 0);
                const dayIncome = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
                const dayExpense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

                return (
                    <div key={date} className="daily-group">
                        <div className="date-header">
                            <div className="date-info">
                                <span className="day-number">{format(new Date(date), 'dd')}</span>
                                <div className="date-meta">
                                    <span className="day-name">{format(new Date(date), 'EEE')}</span>
                                    <span className="month-year">{format(new Date(date), 'MM.yyyy')}</span>
                                </div>
                            </div>
                            <div className="day-summary">
                                {dayIncome > 0 && <span className="income-text">+{currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : currency === 'JPY' ? '¥' : '$'}{dayIncome.toFixed(2)}</span>}
                                {dayExpense > 0 && <span className="expense-text">-{currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency === 'INR' ? '₹' : currency === 'JPY' ? '¥' : '$'}{dayExpense.toFixed(2)}</span>}
                            </div>
                        </div>

                        {dayTransactions.map(transaction => (
                            <div key={transaction.id} className="transaction-item">
                                <div className={`transaction-icon-wrapper ${transaction.type}`}>
                                    {transaction.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                </div>
                                <div className="transaction-info">
                                    <h4>{transaction.description}</h4>
                                    <span className="transaction-account">{transaction.category || 'Other'}</span>
                                </div>
                                <div className="transaction-amount">
                                    <span className={transaction.type}>
                                        {currency === 'USD' ? '$' :
                                            currency === 'EUR' ? '€' :
                                                currency === 'GBP' ? '£' :
                                                    currency === 'INR' ? '₹' :
                                                        currency === 'JPY' ? '¥' : '$'}
                                        {Math.abs(transaction.amount).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default TransactionList;
