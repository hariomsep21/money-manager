import React, { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { Sun, Moon } from 'lucide-react';

const ThemePage = () => {
  const { theme, toggleTheme } = useContext(GlobalContext);
  const isLight = theme === 'light';

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1 className="page-title">Theme</h1>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isLight ? <Sun size={18} color="var(--text-primary)" /> : <Moon size={18} color="var(--text-primary)" />}
            Appearance
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
      <small style={{ opacity: 0.7 }}>Theme settings are isolated to this section.</small>
    </div>
  );
};

export default ThemePage;
