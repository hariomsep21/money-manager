import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

let db = null;

async function initDB() {
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync('moneymanager.db');

  // Create tables
  await db.execAsync(`
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
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      time TEXT,
      message TEXT,
      enabled INTEGER,
      recurrence TEXT
    );
  `);

  return db;
}

export async function loadInitialState() {
  const dbi = await initDB();

  // Migrate from AsyncStorage if needed
  await migrateFromAsyncStorageIfEmpty(dbi);
  await migrateLegacyNotifications(dbi);

  const txRows = await dbi.getAllAsync('SELECT id, description, amount, type, category, date FROM transactions');
  const transactions = txRows || [];

  const notesRows = await dbi.getAllAsync('SELECT month_year, value FROM notes');
  const notes = {};
  if (notesRows) {
    notesRows.forEach(({ month_year, value }) => {
      try {
        notes[month_year] = JSON.parse(value);
      } catch {
        notes[month_year] = value;
      }
    });
  }

  function getSetting(key, fallback) {
    const query = 'SELECT value FROM settings WHERE key = ?';
    try {
      const result = db.getSync(query, [key]);
      return result?.value || fallback;
    } catch {
      return fallback;
    }
  }

  let user;
  try {
    user = JSON.parse(getSetting('user', JSON.stringify({ name: 'Guest' })));
  } catch {
    user = { name: 'Guest' };
  }

  const currency = getSetting('currency', 'INR');
  const theme = getSetting('theme', 'dark') === 'light' ? 'orange' : 'complementary';

  return { transactions, user, currency, theme, notes };
}

async function migrateFromAsyncStorageIfEmpty(dbi) {
  try {
    const txRows = await dbi.getAllAsync('SELECT COUNT(*) as c FROM transactions');
    const count = txRows?.[0]?.c || 0;
    if (count > 0) return;

    const lsTx = JSON.parse(await AsyncStorage.getItem('transactions')) || [];
    const lsNotes = JSON.parse(await AsyncStorage.getItem('notes')) || {};
    const user = JSON.parse(await AsyncStorage.getItem('user')) || { name: 'Guest' };
    const currency = (await AsyncStorage.getItem('currency')) || 'USD';
    const theme = (await AsyncStorage.getItem('theme')) || 'dark';

    for (const t of lsTx) {
      await dbi.runAsync(
        'INSERT OR REPLACE INTO transactions (id, description, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?)',
        [
          t.id,
          t.description || '',
          Number(t.amount) || 0,
          t.type || 'expense',
          t.category || 'Other',
          t.date || new Date().toISOString().slice(0, 10),
        ]
      );
    }

    for (const [k, v] of Object.entries(lsNotes)) {
      await dbi.runAsync(
        'INSERT OR REPLACE INTO notes (month_year, value) VALUES (?, ?)',
        [k, JSON.stringify(v)]
      );
    }

    await dbi.runAsync(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      ['user', JSON.stringify(user)]
    );
    await dbi.runAsync(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      ['currency', currency]
    );
    await dbi.runAsync(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      ['theme', theme]
    );
  } catch (e) {
    console.log('Migration error (non-critical):', e);
  }
}

async function migrateLegacyNotifications(dbi) {
  try {
    const notifRows = await dbi.getAllAsync('SELECT COUNT(*) as c FROM notifications');
    const hasNotifs = (notifRows?.[0]?.c || 0) > 0;
    if (hasNotifs) return;

    const settingRows = await dbi.getAllAsync("SELECT value FROM settings WHERE key='notifications'");
    if (settingRows && settingRows.length) {
      const raw = settingRows[0].value;
      let obj;
      try {
        obj = JSON.parse(raw);
      } catch {
        obj = null;
      }
      if (obj) {
        await dbi.runAsync(
          'INSERT OR REPLACE INTO notifications (id, time, message, enabled, recurrence) VALUES (?, ?, ?, ?, ?)',
          ['notif-1', obj.time || '20:00', obj.message || "Remember to review today's transactions.", obj.enabled ? 1 : 0, 'daily']
        );
      }
    }
  } catch (e) {
    console.log('Notification migration error (non-critical):', e);
  }
}

export async function getNotificationSettings() {
  const dbi = await initDB();
  try {
    const rows = await dbi.getAllAsync("SELECT value FROM settings WHERE key='notifications'");
    if (rows && rows.length) {
      return JSON.parse(rows[0].value);
    }
  } catch (e) {
    console.log('Error getting notification settings:', e);
  }
  return { enabled: false, message: "Remember to review today's transactions.", time: '20:00' };
}

export async function setNotificationSettings(settings) {
  const dbi = await initDB();
  await dbi.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    ['notifications', JSON.stringify(settings)]
  );
}

export async function listNotifications() {
  const dbi = await initDB();
  const rows = await dbi.getAllAsync('SELECT id, time, message, enabled, recurrence FROM notifications');
  if (!rows || !rows.length) return [];
  return rows.map(({ id, time, message, enabled, recurrence }) => ({
    id,
    time,
    message,
    enabled: !!enabled,
    recurrence: recurrence || 'daily',
  }));
}

export async function createNotification(n) {
  const dbi = await initDB();
  await dbi.runAsync(
    'INSERT OR REPLACE INTO notifications (id, time, message, enabled, recurrence) VALUES (?, ?, ?, ?, ?)',
    [
      n.id,
      n.time,
      n.message || "Remember to review today's transactions.",
      n.enabled ? 1 : 0,
      n.recurrence || 'daily',
    ]
  );
}

export async function updateNotification(n) {
  const dbi = await initDB();
  await dbi.runAsync(
    'INSERT OR REPLACE INTO notifications (id, time, message, enabled, recurrence) VALUES (?, ?, ?, ?, ?)',
    [
      n.id,
      n.time,
      n.message || "Remember to review today's transactions.",
      n.enabled ? 1 : 0,
      n.recurrence || 'daily',
    ]
  );
}

export async function deleteNotification(id) {
  const dbi = await initDB();
  await dbi.runAsync('DELETE FROM notifications WHERE id = ?', [id]);
}

export async function addTransaction(t) {
  const dbi = await initDB();
  await dbi.runAsync(
    'INSERT OR REPLACE INTO transactions (id, description, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?)',
    [t.id, t.description || '', Number(t.amount) || 0, t.type || 'expense', t.category || 'Other', t.date]
  );
}

export async function editTransaction(t) {
  const dbi = await initDB();
  await dbi.runAsync(
    'INSERT OR REPLACE INTO transactions (id, description, amount, type, category, date) VALUES (?, ?, ?, ?, ?, ?)',
    [t.id, t.description || '', Number(t.amount) || 0, t.type || 'expense', t.category || 'Other', t.date]
  );
}

export async function deleteTransactionById(id) {
  const dbi = await initDB();
  await dbi.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
}

export async function updateUserSetting(user) {
  const dbi = await initDB();
  await dbi.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    ['user', JSON.stringify(user)]
  );
}

export async function setCurrency(currency) {
  const dbi = await initDB();
  await dbi.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    ['currency', currency]
  );
}

export async function setTheme(theme) {
  const dbi = await initDB();
  await dbi.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    ['theme', theme]
  );
}

export async function setNote(monthYear, value) {
  const dbi = await initDB();
  await dbi.runAsync(
    'INSERT OR REPLACE INTO notes (month_year, value) VALUES (?, ?)',
    [monthYear, typeof value === 'string' ? value : JSON.stringify(value)]
  );
}

export async function deleteNote(monthYear) {
  const dbi = await initDB();
  await dbi.runAsync('DELETE FROM notes WHERE month_year = ?', [monthYear]);
}
