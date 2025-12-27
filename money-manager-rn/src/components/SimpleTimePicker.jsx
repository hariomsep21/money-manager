import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const SimpleTimePicker = ({ time = '20:00', onTimeChange, label = 'Select Time' }) => {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [hours, setHours] = useState(parseInt(time.split(':')[0]) || 20);
  const [minutes, setMinutes] = useState(parseInt(time.split(':')[1]) || 0);

  const handleConfirm = () => {
    const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    onTimeChange(timeStr);
    setVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.bgTertiary }]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
          {label}: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={[styles.modal, { backgroundColor: colors.bgPrimary + '99' }]}>
          <View style={[styles.content, { backgroundColor: colors.bgTertiary }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Select Time</Text>

            <View style={styles.timeInputContainer}>
              <View style={styles.timeField}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Hours</Text>
                <View style={styles.spinnerContainer}>
                  <TouchableOpacity onPress={() => setHours(Math.max(0, hours - 1))}>
                    <Text style={[styles.spinnerButton, { color: colors.accentPrimary }]}>−</Text>
                  </TouchableOpacity>
                  <Text style={[styles.timeValue, { color: colors.textPrimary }]}>
                    {String(hours).padStart(2, '0')}
                  </Text>
                  <TouchableOpacity onPress={() => setHours(Math.min(23, hours + 1))}>
                    <Text style={[styles.spinnerButton, { color: colors.accentPrimary }]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.separator, { color: colors.textPrimary }]}>:</Text>

              <View style={styles.timeField}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Minutes</Text>
                <View style={styles.spinnerContainer}>
                  <TouchableOpacity onPress={() => setMinutes(Math.max(0, minutes - 5))}>
                    <Text style={[styles.spinnerButton, { color: colors.accentPrimary }]}>−</Text>
                  </TouchableOpacity>
                  <Text style={[styles.timeValue, { color: colors.textPrimary }]}>
                    {String(minutes).padStart(2, '0')}
                  </Text>
                  <TouchableOpacity onPress={() => setMinutes(Math.min(59, minutes + 5))}>
                    <Text style={[styles.spinnerButton, { color: colors.accentPrimary }]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.bgSecondary }]}
                onPress={() => setVisible(false)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textPrimary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: colors.accentPrimary }]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    borderRadius: 16,
    padding: 20,
    width: '85%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  timeField: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  spinnerContainer: {
    alignItems: 'center',
  },
  spinnerButton: {
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: '700',
    marginVertical: 4,
  },
  separator: {
    fontSize: 28,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SimpleTimePicker;
