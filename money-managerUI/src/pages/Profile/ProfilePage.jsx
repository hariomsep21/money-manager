import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { User } from 'lucide-react';

const ProfilePage = () => {
    const { user, updateUser, theme, toggleTheme } = useContext(GlobalContext);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user.name);
    const isLight = theme === 'light';

    useEffect(() => {
        setName(user.name);
    }, [user]);

    const handleSave = () => {
        updateUser({ name });
        setIsEditing(false);
    };

    const handleThemeToggle = () => {
        toggleTheme(isLight ? 'dark' : 'light');
    };

    return (
        <div className="container" style={{ maxWidth: '600px' }}>
            <h1 className="page-title">Profile</h1>
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    background: 'rgba(99, 102, 241, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem auto'
                }}>
                    <User size={50} color="var(--accent-primary)" />
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
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save</button>
                            <button className="btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{user.name}</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Money Manager User</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                            <div className="glass-panel" style={{ width: '100%', maxWidth: '360px', padding: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600 }}>Theme</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{isLight ? 'Light Mode' : 'Dark Mode'}</span>
                                        <button
                                            className="btn btn-primary"
                                            onClick={handleThemeToggle}
                                            style={{ padding: '0.5rem 0.9rem' }}
                                        >
                                            {isLight ? 'Switch to Dark' : 'Switch to Light'}
                                        </button>
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
