import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { Wallet, Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountsPage = () => {
    const { currency, changeCurrency, theme, toggleTheme } = useContext(GlobalContext);
    const navigate = useNavigate();

    return (
        <div className="container">
            <h1 className="page-title">My Profile</h1>

            <div className="glass-panel" style={{ padding: '0.5rem 1.5rem' }}>
                {/* Currency Section */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.2rem 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '8px', borderRadius: '10px' }}>
                            <Wallet size={20} color="#60a5fa" />
                        </div>
                        <span style={{ fontSize: '1rem' }}>Currency</span>
                    </div>
                    <select
                        value={currency}
                        onChange={(e) => changeCurrency(e.target.value)}
                        className="input-field"
                        style={{ width: 'auto', padding: '0.5rem', fontSize: '0.9rem', minWidth: '80px', border: 'none', background: 'rgba(255,255,255,0.05)' }}
                    >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                        <option value="JPY">JPY (¥)</option>
                    </select>
                </div>

                {/* Notifications Row */}
                <div style={{ padding: '1rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <div className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '0.75rem', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/notifications')}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '8px', borderRadius: '10px' }}>
                            <Bell size={20} color="#10b981" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '1rem' }}>Notifications</span>
                            <small style={{ opacity: 0.7 }}>Manage reminders</small>
                        </div>
                        <ChevronRight size={18} style={{ opacity: 0.7 }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountsPage;
