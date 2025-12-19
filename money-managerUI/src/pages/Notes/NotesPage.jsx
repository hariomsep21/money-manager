import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const NotesPage = () => {
    const { notes, updateNote } = useContext(GlobalContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Helper for Notes Key
    const getMonthYearKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;
    const noteKey = getMonthYearKey(currentDate);

    // Load initial note
    const [localNote, setLocalNote] = useState('');
    const [noteDate, setNoteDate] = useState(null);

    // Update local note when date changes
    useEffect(() => {
        const savedNote = notes[noteKey];
        if (typeof savedNote === 'object' && savedNote !== null) {
            setLocalNote(savedNote.text || '');
            setNoteDate(savedNote.date);
        } else {
            setLocalNote(savedNote || '');
            setNoteDate(null);
        }
    }, [noteKey, notes]);

    const handleNoteSave = () => {
        const dateStr = new Date().toISOString();
        updateNote(noteKey, { text: localNote, date: dateStr });
        setNoteDate(dateStr);
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    const handleYearChange = (e) => {
        const newYear = parseInt(e.target.value);
        const newDate = new Date(currentDate);
        newDate.setFullYear(newYear);
        setCurrentDate(newDate);
        setShowDatePicker(false); // Auto-close
    };

    const handleMonthChange = (e) => {
        const newMonth = parseInt(e.target.value);
        const newDate = new Date(currentDate);
        newDate.setMonth(newMonth);
        setCurrentDate(newDate);
        setShowDatePicker(false); // Auto-close
    };

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <h1 className="page-title">Notes</h1>

            {/* Header: Month Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button className="icon-btn" onClick={prevMonth}>
                        <ChevronLeft size={24} />
                    </button>
                    <div
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                    >
                        <h2 style={{ fontSize: '1.2rem' }}>{currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</h2>
                        <ChevronDown size={16} style={{ opacity: 0.7 }} />
                    </div>
                    <button className="icon-btn" onClick={nextMonth}>
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Date Picker Dropdown */}
                {showDatePicker && (
                    <div className="glass-panel" style={{ marginTop: '1rem', padding: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <select
                            className="input-field"
                            value={currentDate.getFullYear()}
                            onChange={handleYearChange}
                            style={{ width: 'auto' }}
                        >
                            {Array.from({ length: 11 }, (_, i) => 2020 + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <select
                            className="input-field"
                            value={currentDate.getMonth()}
                            onChange={handleMonthChange}
                            style={{ width: 'auto' }}
                        >
                            {Array.from({ length: 12 }, (_, i) => i).map(month => (
                                <option key={month} value={month}>{new Date(0, month).toLocaleString('en-US', { month: 'long' })}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
                <textarea
                    className="input-field"
                    value={localNote}
                    onChange={(e) => setLocalNote(e.target.value)}
                    placeholder={`Write your notes for ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}...`}
                    style={{
                        width: '100%',
                        flex: 1,
                        minHeight: '200px',
                        resize: 'none',
                        fontFamily: 'inherit',
                        border: 'none',
                        background: 'transparent',
                        marginBottom: '0.5rem'
                    }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {noteDate ? `Last saved: ${new Date(noteDate).toLocaleString()}` : ''}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            updateNote(noteKey, '');
                            setLocalNote('');
                        }}
                        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
                    >
                        Delete
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleNoteSave}
                        style={{ background: 'var(--accent-blue)' }}
                    >
                        Save Note
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotesPage;
