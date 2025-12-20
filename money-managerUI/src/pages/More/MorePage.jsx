import React, { useContext, useState, useEffect, useRef } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { User, Edit2, Trash2 } from 'lucide-react';

const MorePage = () => {
  const { user, updateUser } = useContext(GlobalContext);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || 'Guest');
  const [logoUrl, setLogoUrl] = useState(user?.logoUrl || '');
  const [logoError, setLogoError] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setName(user?.name || 'Guest');
    setLogoUrl(user?.logoUrl || '');
  }, [user]);

  const commitName = () => {
    const safeName = (name || '').trim() || 'Guest';
    const safeLogo = (logoUrl || '').trim();
    updateUser({ name: safeName, logoUrl: safeLogo });
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
      <h1 className="page-title">More</h1>
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.35)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={openFilePicker} aria-label="Change profile image" style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}>
              {(!logoError && (logoUrl || user?.logoUrl)) ? (
                <img
                  src={(logoUrl || user?.logoUrl)}
                  alt="Profile"
                  onError={() => setLogoError(true)}
                  style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                />
              ) : (
                <div style={{
                  width: 88, height: 88, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                }}>
                  {initials || <User size={28} color="var(--accent-primary)" />}
                </div>
              )}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {editingName ? (
                <input
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={commitName}
                  onKeyDown={(e) => { if (e.key === 'Enter') commitName(); }}
                  style={{ fontSize: '1rem', maxWidth: '260px' }}
                  autoFocus
                />
              ) : (
                <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{(name || '').trim() || 'Guest'}</span>
              )}
              <small style={{ opacity: 0.7 }}>Personal Money Manager</small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifySelf: 'end' }}>
            <button className="icon-btn" title="Edit" onClick={() => setEditingName(true)}><Edit2 size={18} /></button>
            <button className="icon-btn" title="Delete" onClick={() => { setName(''); setLogoUrl(''); updateUser({ name: '', logoUrl: '' }); }} style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
          </div>
        </div>
        <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '1rem 0' }} />
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelected} style={{ display: 'none' }} />

      </div>
    </div>
  );
};

export default MorePage;
