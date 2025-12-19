import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { Wallet, Moon, Sun } from 'lucide-react';

const AccountsPage = () => {
    const { currency, changeCurrency, theme, toggleTheme } = useContext(GlobalContext);

    return (
        <div className="container">
            <h1 className="page-title">Accounts & Settings</h1>

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

                {/* Theme Section */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.2rem 0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: theme === 'dark' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)', padding: '8px', borderRadius: '10px' }}>
                            {theme === 'dark' ? <Moon size={20} color="#a78bfa" /> : <Sun size={20} color="#fbbf24" />}
                        </div>
                        <span style={{ fontSize: '1rem' }}>Dark Mode</span>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '28px' }}>
                        <input
                            type="checkbox"
                            checked={theme === 'dark'}
                            onChange={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')}
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                            position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: theme === 'dark' ? '#10b981' : '#4b5563',
                            transition: '.4s', borderRadius: '34px'
                        }}>
                            <span style={{
                                position: 'absolute', content: '""', height: '20px', width: '20px', left: '4px', bottom: '4px',
                                backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                                transform: theme === 'dark' ? 'translateX(22px)' : 'translateX(0)'
                            }}></span>
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default AccountsPage;
