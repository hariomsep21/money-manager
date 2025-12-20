import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { Plus, Pencil, Trash, Check, X } from 'lucide-react';
import MonthYearSelector from '../../components/MonthYearSelector';

const NotesPage = () => {
    const { notes, updateNote } = useContext(GlobalContext);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Helper for Notes Key
    const getMonthYearKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;
    const noteKey = getMonthYearKey(currentDate);

    // Notes list for selected month
    const monthNotes = Array.isArray(notes[noteKey])
        ? notes[noteKey]
        : (typeof notes[noteKey] === 'string' && notes[noteKey].trim())
            ? [{ id: `legacy-${noteKey}`, text: notes[noteKey], createdAt: new Date().toISOString() }]
            : [];

    const [isAdding, setIsAdding] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');

    useEffect(() => {
        // Reset add input when switching months
        setIsAdding(false);
        setNewNote('');
    }, [noteKey]);

    const handleSaveNewNote = () => {
        const text = (newNote || '').trim();
        if (!text) return;
        const item = { id: `note-${Date.now()}`, text, createdAt: new Date().toISOString() };
        const updated = [...monthNotes, item];
        updateNote(noteKey, updated);
        setNewNote('');
        setIsAdding(false);
    };

    const handleDeleteNote = (id) => {
        const updated = monthNotes.filter(n => n.id !== id);
        updateNote(noteKey, updated);
        // If deleting the currently editing note, clear edit state
        if (editingId === id) {
            setEditingId(null);
            setEditingText('');
        }
    };

    const startEditNote = (n) => {
        setEditingId(n.id);
        setEditingText(n.text);
    };

    const handleSaveEdit = () => {
        const text = (editingText || '').trim();
        if (!editingId) return;
        const updated = monthNotes.map(n => n.id === editingId ? { ...n, text } : n);
        updateNote(noteKey, updated);
        setEditingId(null);
        setEditingText('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingText('');
    };

    const handleDateChange = (d) => {
        setCurrentDate(d);
    };

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>

            {/* Header: Shared Month-Year Selector */}
            <MonthYearSelector value={currentDate} onChange={handleDateChange} />

            <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 600 }}>Notes for {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    <button className="icon-btn" aria-label="Add Note" title="Add Note" onClick={() => setIsAdding(true)}>
                        <Plus size={22} />
                    </button>
                </div>

                {/* Add Note Input */}
                {isAdding && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                            className="input-field"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Write a note..."
                            style={{ flex: 1 }}
                            autoFocus
                        />
                        <button className="icon-btn icon-action save" aria-label="Save" title="Save" onClick={handleSaveNewNote}>
                            <Check size={20} />
                        </button>
                        <button className="icon-btn icon-action cancel" aria-label="Cancel" title="Cancel" onClick={() => { setIsAdding(false); setNewNote(''); }}>
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Notes List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {monthNotes.length === 0 && (
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>No notes yet. Click + to add one.</div>
                    )}
                    {monthNotes.map((n) => (
                        <div key={n.id} style={{ border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.75rem' }}>
                            {editingId === n.id ? (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <input
                                        className="input-field"
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        style={{ flex: 1 }}
                                        autoFocus
                                    />
                                    <button className="icon-btn icon-action save" aria-label="Save" title="Save" onClick={handleSaveEdit}>
                                        <Check size={18} />
                                    </button>
                                    <button className="icon-btn icon-action cancel" aria-label="Cancel" title="Cancel" onClick={handleCancelEdit}>
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.95rem' }}>{n.text}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                                            {new Date(n.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button className="icon-btn icon-action edit" aria-label="Edit" title="Edit" onClick={() => startEditNote(n)}><Pencil size={18} /></button>
                                        <button className="icon-btn icon-action delete" aria-label="Delete" title="Delete" onClick={() => handleDeleteNote(n.id)}><Trash size={18} /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotesPage;
