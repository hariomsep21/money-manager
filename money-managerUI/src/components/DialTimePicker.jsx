import React, { useMemo } from 'react';

function polarToCartesian(radius, angleDeg) {
  const angle = (angleDeg - 90) * (Math.PI / 180);
  const x = radius + radius * Math.cos(angle);
  const y = radius + radius * Math.sin(angle);
  return { x, y };
}

export default function DialTimePicker({ value = '20:00', onChange }) {
  const [hh, mm] = useMemo(() => {
    const parts = String(value || '20:00').split(':');
    const h = Math.max(0, Math.min(23, parseInt(parts[0] || '20', 10)));
    const m = Math.max(0, Math.min(59, parseInt(parts[1] || '0', 10)));
    return [h, m];
  }, [value]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0..55 step 5

  const radius = 80;
  const centerStyle = {
    position: 'absolute',
    left: radius - 20,
    top: radius - 20,
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    background: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    fontWeight: 600,
  };

  const wrapperStyle = { display: 'flex', gap: '1rem', alignItems: 'center' };
  const dialStyle = {
    position: 'relative',
    width: radius * 2,
    height: radius * 2,
    borderRadius: '50%',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-primary)',
  };

  const renderDial = (items, selected, onSelect, label) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
      <small style={{ opacity: 0.7 }}>{label}</small>
      <div style={dialStyle}>
        <div style={centerStyle}>{String(selected).padStart(2, '0')}</div>
        {items.map((val, idx) => {
          const angle = (360 / items.length) * idx;
          const { x, y } = polarToCartesian(radius - 20, angle);
          const style = {
            position: 'absolute',
            left: x - 16,
            top: y - 16,
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            fontSize: '0.8rem',
            cursor: 'pointer',
            background: val === selected ? '#10b981' : 'transparent',
            color: val === selected ? '#ffffff' : 'var(--text-secondary)',
          };
          return (
            <div key={`${label}-${val}`} style={style} onClick={() => onSelect(val)}>
              {String(val).padStart(2, '0')}
            </div>
          );
        })}
      </div>
    </div>
  );

  const updateTime = (newH, newM) => {
    const hhStr = String(newH == null ? hh : newH).padStart(2, '0');
    const mmStr = String(newM == null ? mm : newM).padStart(2, '0');
    onChange?.(`${hhStr}:${mmStr}`);
  };

  return (
    <div style={wrapperStyle}>
      {renderDial(hours, hh, (h) => updateTime(h, null), 'Hour')}
      {renderDial(minutes, Math.round(mm / 5) * 5, (m) => updateTime(null, m), 'Minute')}
    </div>
  );
}
