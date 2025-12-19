import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { v4 as uuidv4 } from 'uuid';
import './TransactionForm.css';

const TransactionForm = ({ transactionToEdit, clearEdit, onSuccess }) => {
    const { addTransaction, editTransaction } = useContext(GlobalContext);

    const [text, setText] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('Other');

    const categories = ['Salary', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Other'];

    useEffect(() => {
        if (transactionToEdit) {
            setText(transactionToEdit.description);
            setAmount(Math.abs(transactionToEdit.amount));
            setDate(transactionToEdit.date);
            setType(transactionToEdit.type || (transactionToEdit.amount < 0 ? 'expense' : 'income'));
            setCategory(transactionToEdit.category || 'Other');
        } else {
            resetForm();
        }
    }, [transactionToEdit]);

    const resetForm = () => {
        setText('');
        setAmount('');
        setDate(new Date().toISOString().split('T')[0]);
        setType('expense');
        setCategory('Other');
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const newAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));

        const transactionData = {
            id: transactionToEdit ? transactionToEdit.id : uuidv4(),
            description: text,
            amount: newAmount,
            date: date,
            type: type,
            category: category
        };

        if (transactionToEdit) {
            editTransaction(transactionData);
            clearEdit();
        } else {
            addTransaction(transactionData);
        }

        if (onSuccess) {
            onSuccess();
        }

        if (!transactionToEdit) {
            resetForm();
        }
    };

    return (
        <div className="glass-panel form-container">
            <h3>{transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}</h3>
            <form onSubmit={onSubmit}>
                <div className="form-control">
                    <label htmlFor="text">Description</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text..."
                        required
                        className="input-field"
                    />
                </div>
                <div className="form-group-row">
                    <div className="form-control">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount..."
                            required
                            className="input-field"
                        />
                    </div>
                </div>

                <div className="form-group-row">
                    <div className="form-control">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="category">Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input-field"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-control">
                    <label>Type</label>
                    <div className="type-selector">
                        <button
                            type="button"
                            className={`type-btn ${type === 'income' ? 'active income' : ''}`}
                            onClick={() => setType('income')}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
                            onClick={() => setType('expense')}
                        >
                            Expense
                        </button>
                    </div>
                </div>
                <div className="form-actions">
                    {transactionToEdit && (
                        <button type="button" className="btn btn-danger" onClick={clearEdit}>Cancel</button>
                    )}
                    <button className="btn btn-primary">{transactionToEdit ? 'Update Transaction' : 'Add Transaction'}</button>
                </div>
            </form>
        </div>
    );
};

export default TransactionForm;
