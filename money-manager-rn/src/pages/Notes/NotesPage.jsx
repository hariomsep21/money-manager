import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import MonthYearSelector from '../../components/MonthYearSelector';
import { NotesContext, formatMonthYear } from '../../notes/NotesContext';
import { Plus, Pencil, Trash, Check, X } from 'lucide-react-native';
import Constants from 'expo-constants';

const NotesPage = () => {
  const { colors } = useTheme();
  const { notes, updateNotes } = useContext(NotesContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const monthKey = useMemo(() => `${currentDate.getFullYear()}-${currentDate.getMonth()}`, [currentDate]);
  const monthNotes = Array.isArray(notes[monthKey]) ? notes[monthKey] : [];
  const [orderedNotes, setOrderedNotes] = useState(monthNotes);

  useEffect(() => {
    setIsAdding(false);
    setNewText('');
    setEditingId(null);
    setEditingText('');
    setOrderedNotes(monthNotes);
  }, [monthKey, monthNotes.length]);

  const addNote = () => {
    const text = (newText || '').trim();
    if (!text) return;
    const item = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, text, createdAt: new Date().toISOString() };
    const updated = [...orderedNotes, item];
    setOrderedNotes(updated);
    updateNotes(monthKey, updated);
    setNewText('');
    setIsAdding(false);
  };

  const startEdit = (n) => { setEditingId(n.id); setEditingText(n.text); };
  const saveEdit = () => {
    const text = (editingText || '').trim();
    if (!editingId) return;
    const updated = orderedNotes.map((n) => (n.id === editingId ? { ...n, text } : n));
    setOrderedNotes(updated);
    updateNotes(monthKey, updated);
    setEditingId(null);
    setEditingText('');
  };
  const cancelEdit = () => { setEditingId(null); setEditingText(''); };
  const deleteNote = (id) => {
    const updated = orderedNotes.filter((n) => n.id !== id);
    setOrderedNotes(updated);
    updateNotes(monthKey, updated);
    if (editingId === id) cancelEdit();
  };

  const renderItemDraggable = ({ item, drag, isActive }) => (
    <View>
      <TouchableOpacity
        onLongPress={drag}
        activeOpacity={0.9}
        style={[styles.card, { backgroundColor: isActive ? colors.bgSecondary : colors.bgTertiary, borderColor: colors.borderColor }]}
      >
        {editingId === item.id ? (
          <View style={styles.row}>
            <TextInput
              value={editingText}
              onChangeText={setEditingText}
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.borderColor }]}
              autoFocus
            />
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Save" onPress={saveEdit} style={[styles.iconBtn, { backgroundColor: colors.accentPrimary }]}>
              <Check size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Cancel" onPress={cancelEdit} style={[styles.iconBtn, { backgroundColor: colors.bgSecondary }]}>
              <X size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.text, { color: colors.textPrimary }]}>{item.text}</Text>
              <Text style={[styles.meta, { color: colors.textMuted }]}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Edit" onPress={() => startEdit(item)} style={[styles.iconBtn, { backgroundColor: colors.bgSecondary }]}>
                <Pencil size={18} color={colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Delete" onPress={() => deleteNote(item.id)} style={[styles.iconBtn, { backgroundColor: '#e53935' }]}>
                <Trash size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderItemStatic = ({ item }) => (
    <View>
      <View
        style={[styles.card, { backgroundColor: colors.bgTertiary, borderColor: colors.borderColor }]}
      >
        {editingId === item.id ? (
          <View style={styles.row}>
            <TextInput
              value={editingText}
              onChangeText={setEditingText}
              style={[styles.input, { color: colors.textPrimary, borderColor: colors.borderColor }]}
              autoFocus
            />
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Save" onPress={saveEdit} style={[styles.iconBtn, { backgroundColor: colors.accentPrimary }]}>
              <Check size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Cancel" onPress={cancelEdit} style={[styles.iconBtn, { backgroundColor: colors.bgSecondary }]}>
              <X size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.text, { color: colors.textPrimary }]}>{item.text}</Text>
              <Text style={[styles.meta, { color: colors.textMuted }]}>{new Date(item.createdAt).toLocaleString()}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Edit" onPress={() => startEdit(item)} style={[styles.iconBtn, { backgroundColor: colors.bgSecondary }]}>
                <Pencil size={18} color={colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity accessibilityRole="button" accessibilityLabel="Delete" onPress={() => deleteNote(item.id)} style={[styles.iconBtn, { backgroundColor: '#e53935' }]}>
                <Trash size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  const isExpoGo = Constants?.appOwnership === 'expo';

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }] }>
      <View style={{ padding: 16, paddingBottom: 72 }}>
        <MonthYearSelector value={currentDate} onChange={setCurrentDate} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>Notes for {formatMonthYear(monthKey)}</Text>

        {isAdding && (
          <View style={[styles.addRow, { borderColor: colors.borderColor, backgroundColor: colors.bgTertiary }] }>
            <TextInput
              value={newText}
              onChangeText={setNewText}
              placeholder="Write a note..."
              placeholderTextColor={colors.textMuted}
              style={[styles.input, { color: colors.textPrimary }]}
              autoFocus
            />
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Add" onPress={addNote} style={[styles.iconBtn, { backgroundColor: colors.accentPrimary }]}>
              <Check size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity accessibilityRole="button" accessibilityLabel="Cancel" onPress={() => { setIsAdding(false); setNewText(''); }} style={[styles.iconBtn, { backgroundColor: colors.bgSecondary }]}>
              <X size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        )}

        {monthNotes.length === 0 && !isAdding && (
          <Text style={{ color: colors.textSecondary }}>No notes yet.</Text>
        )}

        {(!isExpoGo) ? (
          (() => {
            const DraggableFlatList = require('react-native-draggable-flatlist').default;
            return (
              <DraggableFlatList
                data={orderedNotes}
                keyExtractor={(item) => item.id}
                onDragEnd={({ data }) => { setOrderedNotes(data); updateNotes(monthKey, data); }}
                renderItem={renderItemDraggable}
              />
            );
          })()
        ) : (
          <FlatList
            data={orderedNotes}
            keyExtractor={(item) => item.id}
            renderItem={renderItemStatic}
          />
        )}
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Add Note"
        onPress={() => setIsAdding(true)}
        style={[styles.fab, { backgroundColor: colors.accentPrimary }]}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', marginVertical: 12 },
  card: { borderRadius: 12, padding: 12, borderWidth: 1, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  text: { fontSize: 14 },
  meta: { fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 12, padding: 10, marginBottom: 12 },
  iconBtn: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  fab: { position: 'absolute', right: 16, bottom: 16, borderRadius: 28, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', elevation: 4 }
});

export default NotesPage;
