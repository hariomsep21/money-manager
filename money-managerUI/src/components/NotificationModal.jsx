import React, { useEffect, useMemo, useState } from 'react';
import SimpleTimePicker from './SimpleTimePicker';

function formatTimeToHHMM(value) {
  if (!value) return '20:00';
  if (typeof value === 'string') {
    // Expecting formats like "20:00" or "8:00 PM"; try normalize
    const match24 = value.match(/^\d{1,2}:\d{2}$/);
    if (match24) {
      const [h, m] = match24[0].split(':').map((n) => parseInt(n, 10));
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      return `${hh}:${mm}`;
    }
    try {
      const d = new Date(`1970-01-01 ${value}`);
      if (!isNaN(d.getTime())) {
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
      }
    } catch {}
  }
  if (value instanceof Date) {
    const hh = String(value.getHours()).padStart(2, '0');
    const mm = String(value.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }
  return '20:00';
}

export default function NotificationModal({
  open,
  initial,
  onSave,
  onCancel,
}) {
  const initialForm = useMemo(
    () => ({
      time: formatTimeToHHMM(initial?.time || '20:00'),
      message: initial?.message || "Remember to review today's transactions.",
      recurrence: initial?.recurrence || 'daily',
      enabled: !!(initial?.enabled ?? true),
    }),
    [initial]
  );

  const [form, setForm] = useState(initialForm);
  useEffect(() => setForm(initialForm), [initialForm]);

  const handleSave = () => {
    const payload = {
      ...initial,
      time: formatTimeToHHMM(form.time),
      message: (form.message || '').trim() || "Remember to review today's transactions.",
      recurrence: form.recurrence || 'daily',
      enabled: !!form.enabled,
    };
    onSave?.(payload);
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Notification settings">
      <div className="glass-panel modal-card">
        <h2 className="modal-title">{initial?.id ? 'Edit Notification' : 'Add Notification'}</h2>
        <div className="modal-grid">
          <div className="modal-field">
            <label className="modal-label">Time</label>
            <SimpleTimePicker
              value={form.time}
              onChange={(v) => setForm((f) => ({ ...f, time: formatTimeToHHMM(v) }))}
            />
          </div>
          <div className="modal-field">
            <label className="modal-label">Repeat</label>
            <select
              className="input-field"
              value={form.recurrence}
              onChange={(e) => setForm((f) => ({ ...f, recurrence: e.target.value }))}
            >
              <option value="daily">Daily</option>
              <option value="once">One-time</option>
            </select>
          </div>
          <div className="modal-field">
            <label className="modal-label">Enabled</label>
            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
              <input
                type="checkbox"
                checked={!!form.enabled}
                onChange={(e) => setForm((f) => ({ ...f, enabled: e.target.checked }))}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: form.enabled ? '#10b981' : '#4b5563', transition: '.3s', borderRadius: '34px' }}>
                <span style={{ position: 'absolute', height: '16px', width: '16px', left: '4px', bottom: '4px', backgroundColor: 'white', transition: '.3s', borderRadius: '50%', transform: form.enabled ? 'translateX(20px)' : 'translateX(0)' }}></span>
              </span>
            </label>
          </div>
        </div>

        <div className="modal-field" style={{ marginTop: '0.75rem' }}>
          <label className="modal-label">Message</label>
          <input
            type="text"
            className="input-field"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="Your reminder message"
            style={{ width: '100%' }}
          />
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" style={{ background: 'var(--bg-tertiary)' }} onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary" style={{ background: '#10b981' }} onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
