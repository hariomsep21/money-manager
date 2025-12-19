import React, { useMemo, useRef } from 'react';

function pad2(n) { return String(n).padStart(2, '0'); }

function supportsTimeInput() {
  const input = document.createElement('input');
  input.setAttribute('type', 'time');
  return input.type === 'time';
}

export default function SimpleTimePicker({ value = '20:00', onChange }) {
  const [hh, mm] = useMemo(() => {
    const parts = String(value || '20:00').split(':');
    const h = Math.max(0, Math.min(23, parseInt(parts[0] || '20', 10)));
    const m = Math.max(0, Math.min(59, parseInt(parts[1] || '0', 10)));
    return [h, m];
  }, [value]);

  const useNative = supportsTimeInput();

  if (useNative) {
    const inputRef = useRef(null);
    const openPicker = () => {
      const el = inputRef.current;
      if (!el) return;
      try {
        el.focus();
        if (typeof el.showPicker === 'function') el.showPicker();
      } catch {
        // fallback: focus is enough on many platforms
      }
    };
    return (
      <div className="time-input-wrapper" onClick={openPicker}>
        <input
          ref={inputRef}
          type="time"
          className="input-field time-input"
          value={`${pad2(hh)}:${pad2(mm)}`}
          step={60}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    );
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <select
        className="input-field time-input"
        value={hh}
        onChange={(e) => onChange?.(`${pad2(parseInt(e.target.value, 10))}:${pad2(mm)}`)}
      >
        {hours.map((h) => (
          <option key={`h-${h}`} value={h}>{pad2(h)}</option>
        ))}
      </select>
      <span style={{ alignSelf: 'center', opacity: 0.7 }}>:</span>
      <select
        className="input-field time-input"
        value={mm}
        onChange={(e) => onChange?.(`${pad2(hh)}:${pad2(parseInt(e.target.value, 10))}`)}
      >
        {minutes.map((m) => (
          <option key={`m-${m}`} value={m}>{pad2(m)}</option>
        ))}
      </select>
    </div>
  );
}
