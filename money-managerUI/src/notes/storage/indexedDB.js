// Minimal IndexedDB wrapper for month-wise notes
const DB_NAME = 'notes-db';
const STORE_NAME = 'notes';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'monthKey' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore(mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    let result;
    try {
      result = fn(store);
    } catch (e) {
      reject(e);
      return;
    }
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getMonthNotes(monthKey) {
  try {
    return await withStore('readonly', (store) => {
      return new Promise((resolve, reject) => {
        const req = store.get(monthKey);
        req.onsuccess = () => {
          const val = req.result?.notes || [];
          if (Array.isArray(val)) resolve(val);
          else resolve([]);
        };
        req.onerror = () => reject(req.error);
      });
    });
  } catch {
    return [];
  }
}

export async function setMonthNotes(monthKey, notesArray) {
  const safe = Array.isArray(notesArray) ? notesArray : [];
  // Persist raw array JSON for each month
  const payload = { monthKey, notes: safe };
  try {
    await withStore('readwrite', (store) => store.put(payload));
    return true;
  } catch {
    return false;
  }
}

export async function listMonthKeys() {
  try {
    return await withStore('readonly', (store) => {
      return new Promise((resolve, reject) => {
        const req = store.getAllKeys();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    });
  } catch {
    return [];
  }
}
