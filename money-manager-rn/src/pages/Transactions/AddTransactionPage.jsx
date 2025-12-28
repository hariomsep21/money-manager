import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { GlobalContext } from '../../context/GlobalState';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { ChevronDown } from 'lucide-react-native';

const AddTransactionPage = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { addTransaction, editTransaction } = useContext(GlobalContext);
  const transaction = route?.params?.transaction;

  const [description, setDescription] = useState(transaction?.description || '');
  const [amount, setAmount] = useState(transaction?.amount?.toString() || '');
  const [type, setType] = useState(transaction?.type || 'expense');
  const [category, setCategory] = useState(transaction?.category || 'Other');
  const [date, setDate] = useState(transaction?.date || new Date().toISOString().split('T')[0]);
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const categories = ['Food', 'Health', 'Entertainment', 'Transport', 'Shopping', 'Other'];
  const types = ['expense', 'income'];

  const handleSave = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!amount || isNaN(amount)) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const transactionData = {
      id: transaction?.id || uuidv4(),
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date,
    };

    if (transaction) {
      editTransaction(transactionData);
    } else {
      addTransaction(transactionData);
    }

    Alert.alert('Success', transaction ? 'Transaction updated' : 'Transaction added', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bgPrimary }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {transaction ? 'Edit Transaction' : 'Add Transaction'}
      </Text>

      {/* Description */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Description</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bgTertiary, color: colors.textPrimary, borderColor: colors.borderColor }]}
          placeholder="Enter description"
          placeholderTextColor={colors.textMuted}
          value={description}
          onChangeText={setDescription}
        />
      </View>

      {/* Amount */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Amount</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bgTertiary, color: colors.textPrimary, borderColor: colors.borderColor }]}
          placeholder="Enter amount"
          placeholderTextColor={colors.textMuted}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      {/* Type Selector */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Type</Text>
        <TouchableOpacity
          style={[styles.dropdownButton, { backgroundColor: colors.bgTertiary, borderColor: colors.borderColor }]}
          onPress={() => setTypeModalVisible(true)}
        >
          <Text style={[styles.dropdownText, { color: colors.textPrimary }]}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
          <ChevronDown size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <Modal
          visible={typeModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setTypeModalVisible(false)}
        >
          <View style={[styles.modalOverlay, { backgroundColor: colors.bgPrimary + '99' }]}>
            <View style={[styles.modalContent, { backgroundColor: colors.bgTertiary }]}>
              <FlatList
                data={types}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      type === item && { backgroundColor: colors.accentPrimary }
                    ]}
                    onPress={() => {
                      setType(item);
                      setTypeModalVisible(false);
                    }}
                  >
                    <Text style={[styles.modalItemText, { color: type === item ? '#fff' : colors.textPrimary }]}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.accentPrimary }]}
                onPress={() => setTypeModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Category Selector */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
        <TouchableOpacity
          style={[styles.dropdownButton, { backgroundColor: colors.bgTertiary, borderColor: colors.borderColor }]}
          onPress={() => setCategoryModalVisible(true)}
        >
          <Text style={[styles.dropdownText, { color: colors.textPrimary }]}>
            {category}
          </Text>
          <ChevronDown size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <Modal
          visible={categoryModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <View style={[styles.modalOverlay, { backgroundColor: colors.bgPrimary + '99' }]}>
            <View style={[styles.modalContent, { backgroundColor: colors.bgTertiary }]}>
              <FlatList
                data={categories}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.modalItem,
                      category === item && { backgroundColor: colors.accentPrimary }
                    ]}
                    onPress={() => {
                      setCategory(item);
                      setCategoryModalVisible(false);
                    }}
                  >
                    <Text style={[styles.modalItemText, { color: category === item ? '#fff' : colors.textPrimary }]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.accentPrimary }]}
                onPress={() => setCategoryModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Date */}
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bgTertiary, color: colors.textPrimary, borderColor: colors.borderColor }]}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textMuted}
          value={date}
          onChangeText={setDate}
        />
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.accentPrimary }]}
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>
          {transaction ? 'Update Transaction' : 'Add Transaction'}
        </Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        style={[styles.cancelButton, { backgroundColor: colors.bgTertiary }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={[styles.cancelButtonText, { color: colors.textPrimary }]}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalItemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddTransactionPage;
