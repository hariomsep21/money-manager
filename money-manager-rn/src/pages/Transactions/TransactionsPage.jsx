import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { GlobalContext } from '../../context/GlobalState';
import { Trash2, Edit } from 'lucide-react-native';
import MonthYearSelector from '../../components/MonthYearSelector';
import { getCurrencySymbol } from '../../theme/colors';

const TransactionsPage = ({ navigation }) => {
  const { colors } = useTheme();
  const { transactions, currency, deleteTransaction } = useContext(GlobalContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    const matchesDate =
      tDate.getMonth() === currentDate.getMonth() &&
      tDate.getFullYear() === currentDate.getFullYear();
    const matchesSearch =
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.amount?.toString().includes(searchTerm);
    return matchesDate && matchesSearch;
  });

  const income = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const total = income - expense;

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: () => deleteTransaction(id),
          style: 'destructive',
        },
      ]
    );
  };

  const renderTransaction = ({ item }) => (
    <View
      style={[
        styles.transactionItem,
        { backgroundColor: colors.bgTertiary, borderColor: colors.borderColor },
      ]}
    >
      <View style={styles.transactionLeft}>
        <Text
          style={[styles.transactionDesc, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {item.description}
        </Text>
        <Text style={[styles.transactionCategory, { color: colors.textSecondary }]}>
          {item.category}
        </Text>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            {
              color: item.type === 'income' ? colors.accentGreen : colors.accentRed,
            },
          ]}
        >
          {item.type === 'income' ? '+' : '-'}
          {getCurrencySymbol(currency)}
          {Math.abs(item.amount).toFixed(2)}
        </Text>
        <View style={styles.transactionActions}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddTransaction', { transaction: item })
            }
          >
            <Edit color={colors.accentBlue} size={18} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Trash2 color={colors.accentRed} size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bgPrimary }]}
      contentContainerStyle={styles.contentContainer}
    >
      <MonthYearSelector value={currentDate} onChange={setCurrentDate} />

      {/* Summary Stats */}
      <View style={[styles.statsCard, { backgroundColor: colors.bgTertiary }]}>
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Income</Text>
          <Text style={[styles.statValue, { color: colors.accentGreen }]}>
            {getCurrencySymbol(currency)}
            {income.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.borderColor }]} />
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Expenses</Text>
          <Text style={[styles.statValue, { color: colors.accentRed }]}>
            {getCurrencySymbol(currency)}
            {expense.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.borderColor }]} />
        <View style={styles.stat}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total</Text>
          <Text
            style={[
              styles.statValue,
              { color: total >= 0 ? colors.accentGreen : colors.accentRed },
            ]}
          >
            {getCurrencySymbol(currency)}
            {total.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <TextInput
        style={[styles.searchInput, { backgroundColor: colors.bgTertiary, color: colors.textPrimary, borderColor: colors.borderColor }]}
        placeholder="Search transactions..."
        placeholderTextColor={colors.textMuted}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Add Transaction Button */}
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.accentPrimary }]}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Text style={styles.addButtonText}>+ Add Transaction</Text>
      </TouchableOpacity>

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            No transactions for this month
          </Text>
        }
      />
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
  statsCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 8,
  },
  searchInput: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    borderWidth: 1,
  },
  addButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  transactionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});

export default TransactionsPage;
