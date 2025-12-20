import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { User } from 'lucide-react';
import { Sun, Moon } from 'lucide-react';
const ProfilePage = () => {
    const { user, updateUser, theme, toggleTheme } = useContext(GlobalContext);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user?.name || 'Guest');
    const [logoError, setLogoError] = useState(false);
    const [logoUrl, setLogoUrl] = useState(user?.logoUrl || '');
    const isLight = theme === 'light';

    useEffect(() => {
        setName(user?.name || 'Guest');
        setLogoUrl(user?.logoUrl || '');
    }, [user]);

    const handleSave = () => {
        const safeName = (name || '').trim() || 'Guest';
        const safeLogo = (logoUrl || '').trim();
        updateUser({ name: safeName, logoUrl: safeLogo });
        setIsEditing(false);
    };

    const initials = (user?.name || 'U')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(s => s[0]?.toUpperCase())
        .join('');

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <h1 className="page-title">My Profile</h1>
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                {/* Identity Section: User logo + name */}
                <div className="glass-panel" style={{
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                }}>
                    {user?.logoUrl && !logoError ? (
                        <img
                            src={user.logoUrl}
                            alt="User Logo"
                            onError={() => setLogoError(true)}
                            style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                        />
                    ) : (
                        <div style={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: 'var(--accent-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700
                        }}>
                            {initials || <User size={24} color="var(--accent-primary)" />}
                        </div>
                    )}
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{(user?.name || '').trim() || 'Guest'}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Welcome back</div>
                    </div>
                </div>

                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                        <input
                            className="input-field"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            className="input-field"
                            placeholder="Logo image URL (optional)"
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                        />
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save</button>
                            <button className="btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{(user?.name || '').trim() || 'Guest'}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Money Manager User</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                            <div className="glass-panel" style={{ width: '100%', maxWidth: '360px', padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {isLight ? <Sun size={18} color="var(--text-primary)" /> : <Moon size={18} color="var(--text-primary)" />}
                                        Theme
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            {isLight ? 'Light Mode' : 'Dark Mode'}
                                        </span>
                                        <label className="toggle-switch" aria-label="Theme toggle">
                                            <input
                                                type="checkbox"
                                                checked={isLight}
                                                onChange={(e) => toggleTheme(e.target.checked ? 'light' : 'dark')}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
