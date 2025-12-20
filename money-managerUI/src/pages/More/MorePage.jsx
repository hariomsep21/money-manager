import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalState';
import { User, Bell, Sun, Moon } from 'lucide-react';

const MorePage = () => {
  const { user, updateUser, theme, toggleTheme } = useContext(GlobalContext);
  const [name, setName] = useState(user?.name || 'Guest');
  const [editingName, setEditingName] = useState(false);
  const [logoUrl, setLogoUrl] = useState(user?.logoUrl || '');
  const [logoError, setLogoError] = useState(false);
  const fileInputRef = useRef(null);
  const isLight = theme === 'light';

  useEffect(() => {
    setName(user?.name || 'Guest');
    setLogoUrl(user?.logoUrl || '');
  }, [user]);

  const persistUser = (next) => {
    const safeName = (name || '').trim() || 'Guest';
    const candidateLogo = next?.logoUrl ?? logoUrl;
    const safeLogo = (candidateLogo || '').trim();
    updateUser({ name: safeName, logoUrl: safeLogo });
  };

  const commitName = () => {
    const safeName = (name || '').trim() || 'Guest';
    updateUser({ name: safeName, logoUrl: (logoUrl || '').trim() });
    setEditingName(false);
  };

  const openFilePicker = () => {
    try {
      if (fileInputRef.current) fileInputRef.current.click();
    } catch {}
  };

  const onFileSelected = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      setLogoUrl(result);
      setLogoError(false);
      persistUser({ logoUrl: result });
    };
    reader.readAsDataURL(file);
    // reset input to allow re-selecting same file later
    e.target.value = '';
  };

  const initials = (user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('');

  return (
    <div className="container" style={{ maxWidth: '720px' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <button onClick={openFilePicker} aria-label="Change profile image" style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
            {(!logoError && (logoUrl || user?.logoUrl)) ? (
              <img
                src={(logoUrl || user?.logoUrl)}
                alt="Profile"
                onError={() => setLogoError(true)}
                style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
              />
            ) : (
              <div style={{
                width: 160, height: 160, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
              }}>
                {initials || <User size={48} color="var(--accent-primary)" />}
              </div>
            )}
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {editingName ? (
              <input
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={commitName}
                onKeyDown={(e) => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') { setEditingName(false); setName(user?.name || 'Guest'); } }}
                style={{ fontSize: '1.2rem', maxWidth: '300px', textAlign: 'center' }}
                autoFocus
              />
            ) : (
              <span style={{ fontSize: '1.6rem', fontWeight: 800, cursor: 'pointer' }} onClick={() => setEditingName(true)}>
                {(name || '').trim() || 'Guest'}
              </span>
            )}
            <small style={{ opacity: 0.7 }}>Personal Money Manager</small>
          </div>
        </div>
        <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '1rem 0' }} />
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelected} style={{ display: 'none' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          <div className="nav-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(234, 179, 8, 0.18)', color: 'var(--accent-primary)' }}>
              {isLight ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontWeight: 700 }}>Appearance</span>
              <small style={{ opacity: 0.75 }}>{isLight ? 'Light Mode' : 'Dark Mode'}</small>
            </div>
            <label className="toggle-switch" aria-label="Theme toggle" style={{ marginLeft: 'auto' }}>
              <input
                type="checkbox"
                checked={isLight}
                onChange={(e) => toggleTheme(e.target.checked ? 'light' : 'dark')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <Link to="/notifications" className="nav-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1rem', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(99, 102, 241, 0.18)', color: 'var(--accent-primary)' }}>
              <Bell size={20} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary)', textAlign: 'center' }}>Alerts</span>
              <small style={{ opacity: 0.75, textAlign: 'center' }}>Manage notifications</small>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MorePage;
