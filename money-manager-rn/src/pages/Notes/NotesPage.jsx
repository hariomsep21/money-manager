import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { GlobalContext } from '../../context/GlobalState';
import MonthYearSelector from '../../components/MonthYearSelector';
import { Save } from 'lucide-react-native';

const NotesPage = () => {
  const { colors } = useTheme();
  const { notes, updateNote } = useContext(GlobalContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthYear = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const currentNote = notes[monthYear] || '';
  const [noteText, setNoteText] = useState(currentNote);

  const handleSaveNote = () => {
    updateNote(monthYear, noteText);
    Alert.alert('Success', 'Note saved');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bgPrimary }]}
      contentContainerStyle={styles.contentContainer}
    >
      <MonthYearSelector value={currentDate} onChange={setCurrentDate} />

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Month Notes
      </Text>

      <TextInput
        style={[
          styles.noteInput,
          {
            backgroundColor: colors.bgTertiary,
            color: colors.textPrimary,
            borderColor: colors.borderColor,
          },
        ]}
        placeholder="Write your notes for this month..."
        placeholderTextColor={colors.textMuted}
        multiline
        numberOfLines={12}
        value={noteText}
        onChangeText={setNoteText}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.accentPrimary }]}
        onPress={handleSaveNote}
      >
        <Save size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Save Note</Text>
      </TouchableOpacity>

      {currentNote && (
        <View style={[styles.savedNoteSection, { backgroundColor: colors.bgTertiary }]}>
          <Text style={[styles.savedNoteTitle, { color: colors.textSecondary }]}>
            Saved Note
          </Text>
          <Text style={[styles.savedNoteText, { color: colors.textPrimary }]}>
            {currentNote}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  noteInput: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    borderWidth: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  savedNoteSection: {
    borderRadius: 12,
    padding: 16,
  },
  savedNoteTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  savedNoteText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default NotesPage;
