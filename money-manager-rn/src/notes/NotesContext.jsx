import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { listMonthKeys, getMonthNotes, setMonthNotes } from './storage/asyncStorage';

export const NotesContext = createContext({
  notes: {},
  updateNotes: (_monthKey, _notesArray) => {},
});

export function getMonthKeyFromDate(d) {
  return `${d.getFullYear()}-${d.getMonth()}`; // 0-based month
}

export function formatMonthYear(monthKey) {
  const [y, m] = monthKey.split('-').map((x) => parseInt(x, 10));
  const d = new Date(y, m, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export const NotesProvider = ({ children }) => {
  const [notesMap, setNotesMap] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const keys = await listMonthKeys();
        const entries = await Promise.all((keys || []).map(async (k) => [k, await getMonthNotes(k)]));
        const initial = {};
        for (const [k, arr] of entries) initial[k] = Array.isArray(arr) ? arr : [];
        if (mounted) setNotesMap(initial);
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  const updateNotes = useCallback(async (monthKey, notesArray) => {
    const safe = Array.isArray(notesArray) ? notesArray : [];
    setNotesMap((prev) => ({ ...prev, [monthKey]: safe }));
    await setMonthNotes(monthKey, safe);
  }, []);

  const value = useMemo(() => ({ notes: notesMap, updateNotes }), [notesMap, updateNotes]);

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};
