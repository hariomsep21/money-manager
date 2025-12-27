import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { format } from 'date-fns';

const MonthYearSelector = ({ value, onChange }) => {
  const { colors } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const currentMonth = value.getMonth();
  const currentYear = value.getFullYear();

  const handlePrevMonth = () => {
    const newDate = new Date(value);
    newDate.setMonth(newDate.getMonth() - 1);
    onChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(value);
    newDate.setMonth(newDate.getMonth() + 1);
    onChange(newDate);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.bgTertiary }]}>
      <TouchableOpacity onPress={handlePrevMonth}>
        <ChevronLeft color={colors.textPrimary} size={24} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.monthYearButton}>
        <Text style={[styles.monthYearText, { color: colors.textPrimary }]}>
          {months[currentMonth]} {currentYear}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNextMonth}>
        <ChevronRight color={colors.textPrimary} size={24} />
      </TouchableOpacity>

      <Modal
        visible={showPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={[styles.pickerModal, { backgroundColor: colors.bgPrimary }]}>
          <View style={styles.pickerContent}>
            <Text style={[styles.pickerTitle, { color: colors.textPrimary }]}>Select Month & Year</Text>
            
            <View style={styles.pickerRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Month</Text>
                <FlatList
                  data={months}
                  keyExtractor={(_, i) => i.toString()}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        const newDate = new Date(value);
                        newDate.setMonth(index);
                        onChange(newDate);
                      }}
                      style={[
                        styles.monthItem,
                        index === currentMonth && { backgroundColor: colors.accentPrimary }
                      ]}
                    >
                      <Text style={[
                        styles.monthItemText,
                        { color: index === currentMonth ? '#fff' : colors.textPrimary }
                      ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  scrollEnabled
                  nestedScrollEnabled
                  height={300}
                />
              </View>

              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Year</Text>
                <FlatList
                  data={Array.from({ length: 20 }, (_, i) => currentYear - 10 + i)}
                  keyExtractor={item => item.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        const newDate = new Date(value);
                        newDate.setFullYear(item);
                        onChange(newDate);
                      }}
                      style={[
                        styles.yearItem,
                        item === currentYear && { backgroundColor: colors.accentPrimary }
                      ]}
                    >
                      <Text style={[
                        styles.yearItemText,
                        { color: item === currentYear ? '#fff' : colors.textPrimary }
                      ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  scrollEnabled
                  nestedScrollEnabled
                  height={300}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setShowPicker(false)}
              style={[styles.closeButton, { backgroundColor: colors.accentPrimary }]}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: 12,
  },
  monthYearButton: {
    flex: 1,
    alignItems: 'center',
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  pickerContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  monthItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  monthItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  yearItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  yearItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MonthYearSelector;
