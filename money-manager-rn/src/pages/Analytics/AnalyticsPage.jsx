import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { GlobalContext } from '../../context/GlobalState';
import { BarChart, BarSize } from 'react-native-chart-kit';
import { getCurrencySymbol } from '../../theme/colors';
import MonthYearSelector from '../../components/MonthYearSelector';
import { BarChart3, PieChart as PieIcon } from 'lucide-react-native';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF5252', '#448AFF'];

const AnalyticsPage = () => {
  const { colors } = useTheme();
  const { transactions, currency } = useContext(GlobalContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [chartType, setChartType] = useState('bar');
  const screenWidth = Dimensions.get('window').width;

  const filteredTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return (
      tDate.getMonth() === currentDate.getMonth() &&
      tDate.getFullYear() === currentDate.getFullYear()
    );
  });

  const expenses = filteredTransactions.filter(t => t.type === 'expense' || t.amount < 0);
  const income = filteredTransactions.filter(t => t.type === 'income' || t.amount > 0);

  const totalExpense = expenses.reduce((acc, item) => acc + Math.abs(item.amount), 0);
  const totalIncome = income.reduce((acc, item) => acc + item.amount, 0);

  // Group by category
  const categoryData = expenses.reduce((acc, t) => {
    const cat = t.category || 'Other';
    if (!acc[cat]) acc[cat] = 0;
    acc[cat] += Math.abs(t.amount);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(categoryData).slice(0, 6),
    datasets: [
      {
        data: Object.values(categoryData).slice(0, 6),
      },
    ],
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bgPrimary }]}
      contentContainerStyle={styles.contentContainer}
    >
      <MonthYearSelector value={currentDate} onChange={setCurrentDate} />

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.bgTertiary }]}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Income</Text>
          <Text style={[styles.summaryValue, { color: colors.accentGreen }]}>
            {getCurrencySymbol(currency)}
            {totalIncome.toFixed(2)}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.bgTertiary }]}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Expense</Text>
          <Text style={[styles.summaryValue, { color: colors.accentRed }]}>
            {getCurrencySymbol(currency)}
            {totalExpense.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Chart Type Selector */}
      <View style={styles.chartSelector}>
        <TouchableOpacity
          style={[
            styles.chartButton,
            chartType === 'pie' && { backgroundColor: colors.accentPrimary },
            { borderColor: colors.borderColor },
          ]}
          onPress={() => setChartType('pie')}
        >
          <PieIcon
            color={chartType === 'pie' ? '#fff' : colors.textPrimary}
            size={20}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.chartButton,
            chartType === 'bar' && { backgroundColor: colors.accentPrimary },
            { borderColor: colors.borderColor },
          ]}
          onPress={() => setChartType('bar')}
        >
          <BarChart3
            color={chartType === 'bar' ? '#fff' : colors.textPrimary}
            size={20}
          />
        </TouchableOpacity>
      </View>

      {/* Chart */}
      {chartData.labels.length > 0 ? (
        <View style={[styles.chartContainer, { backgroundColor: colors.bgTertiary }]}>
          <BarChart
            data={chartData}
            width={screenWidth - 32}
            height={300}
            yAxisLabel={getCurrencySymbol(currency)}
            chartConfig={{
              backgroundColor: colors.bgTertiary,
              backgroundGradientFrom: colors.bgTertiary,
              backgroundGradientTo: colors.bgTertiary,
              decimalPlaces: 2,
              color: () => colors.accentPrimary,
              labelColor: () => colors.textSecondary,
              style: { borderRadius: 12 },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: colors.accentPrimary,
              },
            }}
            fromZero
          />
        </View>
      ) : (
        <Text style={[styles.noDataText, { color: colors.textMuted }]}>
          No expense data for this month
        </Text>
      )}

      {/* Category Breakdown */}
      <View style={styles.categorySection}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Category Breakdown
        </Text>
        {Object.entries(categoryData).map(([category, amount], index) => (
          <View key={category} style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: COLORS[index % COLORS.length] },
                ]}
              />
              <Text style={[styles.categoryName, { color: colors.textPrimary }]}>
                {category}
              </Text>
            </View>
            <Text style={[styles.categoryAmount, { color: colors.textPrimary }]}>
              {getCurrencySymbol(currency)}
              {amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
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
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  chartSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  chartButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  chartContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 40,
  },
  categorySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AnalyticsPage;
