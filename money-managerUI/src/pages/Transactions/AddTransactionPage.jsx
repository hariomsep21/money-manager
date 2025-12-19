import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from './TransactionForm';
import { X } from 'lucide-react';

const AddTransactionPage = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/transactions');
    };

    return (
        <div className="container" style={{ maxWidth: '800px', position: 'relative' }}>
            <button
                className="icon-btn"
                onClick={() => navigate('/transactions')}
                style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    padding: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                }}
            >
                <X size={24} />
            </button>
            <div style={{ marginTop: '2rem' }}>
                <TransactionForm onSuccess={handleSuccess} />
            </div>
        </div>
    );
};

export default AddTransactionPage;
