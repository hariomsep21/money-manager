import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { Bell, Plus, Trash2, Edit2, Repeat, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationModal from '../../components/NotificationModal';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { notifications, addNotification, editNotification, removeNotification } = useContext(GlobalContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const onModalSave = async (payload) => {
    if (payload?.id) {
      await editNotification(payload);
    } else {
      await addNotification(payload);
    }
    setEditingItem(null);
    setModalOpen(false);
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="icon-btn" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
          <h1 className="page-title" style={{ margin: 0 }}>Notifications</h1>
        </div>
        <button
          className="btn btn-primary"
          style={{ background: '#10b981' }}
          onClick={() => { setEditingItem(null); setModalOpen(true); }}
        >
          Add Notification
        </button>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {(notifications || []).length === 0 && (
          <div className="glass-panel" style={{ padding: '0.75rem 1rem' }}>
            <small style={{ opacity: 0.7 }}>No notifications yet. Tap + to add one.</small>
          </div>
        )}
        {(notifications || []).map(n => (
          <div key={n.id} className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'grid', gridTemplateColumns: 'auto 1fr auto auto', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '6px', borderRadius: '8px' }}>
              <Bell size={18} color={'#10b981'} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.95rem' }}>{n.message}</span>
              <small style={{ opacity: 0.7 }}>{n.time} • {n.recurrence === 'daily' ? 'Daily' : 'One-time'}</small>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
              <input type="checkbox" checked={!!n.enabled} onChange={(e) => editNotification({ ...n, enabled: e.target.checked })} style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: n.enabled ? '#10b981' : '#4b5563', transition: '.3s', borderRadius: '34px' }}>
                <span style={{ position: 'absolute', height: '16px', width: '16px', left: '4px', bottom: '4px', backgroundColor: 'white', transition: '.3s', borderRadius: '50%', transform: n.enabled ? 'translateX(20px)' : 'translateX(0)' }}></span>
              </span>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="icon-btn" title="Edit" onClick={() => { setEditingItem(n); setModalOpen(true); }}><Edit2 size={18} /></button>
              <button className="icon-btn" title="Delete" onClick={() => removeNotification(n.id)} style={{ color: '#ef4444' }}><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <NotificationModal
        open={isModalOpen}
        initial={editingItem || null}
        onSave={onModalSave}
        onCancel={() => { setEditingItem(null); setModalOpen(false); }}
      />
    </div>
  );
};

export default NotificationsPage;
