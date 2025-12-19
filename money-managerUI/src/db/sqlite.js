import initSqlJs from 'sql.js';

let sql;
let db;

// IndexedDB persistence helpers
const DB_NAME = 'money-manager-sqlite';
const STORE_NAME = 'db';
const KEY_NAME = 'main';

function openIDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const idb = request.result;
      if (!idb.objectStoreNames.contains(STORE_NAME)) {
        idb.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readBytes() {
  const idb = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(KEY_NAME);
    getReq.onsuccess = () => {
      resolve(getReq.result || null);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

async function writeBytes(bytes) {
  const idb = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const putReq = store.put(bytes, KEY_NAME);
    putReq.onsuccess = () => resolve();
    putReq.onerror = () => reject(putReq.error);
  });
}

async function persist() {
  if (!db) return;
  const bytes = db.export();
  await writeBytes(bytes);
}

async function initDB() {
  if (db) return db;
  if (!sql) {
    sql = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' });
  }
  const bytes = await readBytes();
  db = bytes ? new sql.Database(new Uint8Array(bytes)) : new sql.Database();
  // Schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      description TEXT,
      amount REAL,
      type TEXT,
      category TEXT,
      date TEXT
    );
    CREATE TABLE IF NOT EXISTS notes (
      month_year TEXT PRIMARY KEY,
      value TEXT
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);
  await persist();
  return db;
}

// Optional migration from localStorage on first run
function migrateFromLocalStorageIfEmpty() {
  const res = db.exec('SELECT COUNT(*) as c FROM transactions');
  const count = res.length ? res[0].values[0][0] : 0;
  if (count > 0) return; // already has data
  try {
    const lsTx = JSON.parse(localStorage.getItem('transactions')) || [];
    const lsNotes = JSON.parse(localStorage.getItem('notes')) || {};
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };
    const currency = localStorage.getItem('currency') || 'USD';
    const theme = localStorage.getItem('theme') || 'dark';

    const insertTx = db.prepare('INSERT OR REPLACE INTO transactions (id, description, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?)');
    lsTx.forEach(t => {
      insertTx.run([t.id, t.description || '', Number(t.amount) || 0, t.type || 'expense', t.category || 'Other', t.date || new Date().toISOString().slice(0,10)]);
    });
    insertTx.free();

    const insertNote = db.prepare('INSERT OR REPLACE INTO notes (month_year, value) VALUES (?, ?)');
    Object.entries(lsNotes).forEach(([k, v]) => {
      insertNote.run([k, JSON.stringify(v)]);
    });
    insertNote.free();

    const setSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    setSetting.run(['user', JSON.stringify(user)]);
    setSetting.run(['currency', currency]);
    setSetting.run(['theme', theme]);
    setSetting.free();
  } catch (e) {
    // ignore migration errors
  }
}

export async function loadInitialState() {
  const dbi = await initDB();
  migrateFromLocalStorageIfEmpty();
  await persist();
  const txRows = dbi.exec('SELECT id, description, amount, type, category, date FROM transactions');
  const transactions = txRows.length
    ? txRows[0].values.map(([id, description, amount, type, category, date]) => ({ id, description, amount, type, category, date }))
    : [];

  const notesRows = dbi.exec('SELECT month_year, value FROM notes');
  const notes = {};
  if (notesRows.length) {
    notesRows[0].values.forEach(([k, v]) => {
      try { notes[k] = JSON.parse(v); } catch { notes[k] = v; }
    });
  }

  function getSetting(key, fallback) {
    const rows = dbi.exec(`SELECT value FROM settings WHERE key='${key}'`);
    if (rows.length && rows[0].values.length) return rows[0].values[0][0];
    return fallback;
  }
  let user;
  try { user = JSON.parse(getSetting('user', JSON.stringify({ name: 'Guest' })))} catch { user = { name: 'Guest' }; }
  const currency = getSetting('currency', 'USD');
  const theme = getSetting('theme', 'dark');

  return { transactions, user, currency, theme, notes };
}

export async function getNotificationSettings() {
  const dbi = await initDB();
  const rows = dbi.exec("SELECT value FROM settings WHERE key='notifications'");
  if (rows.length && rows[0].values.length) {
    try { return JSON.parse(rows[0].values[0][0]); } catch { /* ignore */ }
  }
  return { enabled: false, message: 'Remember to review today\'s transactions.', time: '20:00' };
}

export async function setNotificationSettings(settings) {
  const dbi = await initDB();
  const stmt = dbi.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  stmt.run(['notifications', JSON.stringify(settings)]);
  stmt.free();
  await persist();
}

export async function addTransaction(t) {
  const dbi = await initDB();
  const stmt = dbi.prepare('INSERT OR REPLACE INTO transactions (id, description, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run([t.id, t.description || '', Number(t.amount) || 0, t.type || 'expense', t.category || 'Other', t.date]);
  stmt.free();
  await persist();
}

export async function editTransaction(t) {
  const dbi = await initDB();
  const stmt = dbi.prepare('INSERT OR REPLACE INTO transactions (id, description, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run([t.id, t.description || '', Number(t.amount) || 0, t.type || 'expense', t.category || 'Other', t.date]);
  stmt.free();
  await persist();
}

export async function deleteTransactionById(id) {
  const dbi = await initDB();
  dbi.exec(`DELETE FROM transactions WHERE id='${id.replace(/'/g, "''")}'`);
  await persist();
}

export async function updateUserSetting(user) {
  const dbi = await initDB();
  const stmt = dbi.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  stmt.run(['user', JSON.stringify(user)]);
  stmt.free();
  await persist();
}

export async function setCurrency(currency) {
  const dbi = await initDB();
  const stmt = dbi.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  stmt.run(['currency', currency]);
  stmt.free();
  await persist();
}

export async function setTheme(theme) {
  const dbi = await initDB();
  const stmt = dbi.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  stmt.run(['theme', theme]);
  stmt.free();
  await persist();
}

export async function setNote(monthYear, value) {
  const dbi = await initDB();
  const stmt = dbi.prepare('INSERT OR REPLACE INTO notes (month_year, value) VALUES (?, ?)');
  stmt.run([monthYear, typeof value === 'string' ? value : JSON.stringify(value)]);
  stmt.free();
  await persist();
}

export async function deleteNote(monthYear) {
  const dbi = await initDB();
  const stmt = dbi.prepare('DELETE FROM notes WHERE month_year = ?');
  stmt.run([monthYear]);
  stmt.free();
  await persist();
}
