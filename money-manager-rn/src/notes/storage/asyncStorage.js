import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'notes:'; // keys like notes:YYYY-M

export async function listMonthKeys() {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return (keys || []).filter((k) => k.startsWith(PREFIX)).map((k) => k.slice(PREFIX.length));
  } catch {
    return [];
  }
}

export async function getMonthNotes(monthKey) {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + monthKey);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  } catch {
    return [];
  }
}

export async function setMonthNotes(monthKey, notesArray) {
  try {
    const safe = Array.isArray(notesArray) ? notesArray : [];
    await AsyncStorage.setItem(PREFIX + monthKey, JSON.stringify(safe));
    return true;
  } catch {
    return false;
  }
}
