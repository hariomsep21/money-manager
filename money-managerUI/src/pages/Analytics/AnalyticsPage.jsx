import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, BarChart, Bar, CartesianGrid } from 'recharts';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';
import MonthYearSelector from '../../components/MonthYearSelector';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF5252', '#448AFF'];

const AnalyticsPage = () => {
    const { transactions, currency } = useContext(GlobalContext);
    const [chartType, setChartType] = useState('pie'); // pie, bar
    const [currentDate, setCurrentDate] = useState(new Date());

    // Filter by month
    const filteredTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentDate.getMonth() && tDate.getFullYear() === currentDate.getFullYear();
    });

    const expenses = filteredTransactions.filter(t => t.type === 'expense' || t.amount < 0);
    const income = filteredTransactions.filter(t => t.type === 'income' || t.amount > 0);

    const totalExpense = expenses.reduce((acc, item) => acc + Math.abs(item.amount), 0);
    const totalIncome = income.reduce((acc, item) => acc + item.amount, 0);

    // Group by Category (for Pie/Bar)
    const categoryData = expenses.reduce((acc, t) => {
        const cat = t.category || 'Other';
        if (!acc[cat]) acc[cat] = 0;
        acc[cat] += Math.abs(t.amount);
        return acc;
    }, {});
    
    // Prepare and sort chart data descending by expense amount
    const preferredOrder = ['Health', 'Food', 'Other'];
    const sortedChartData = Object.keys(categoryData)
        .map(key => ({ name: key, value: categoryData[key] }))
        .sort((a, b) => {
            const byAmount = b.value - a.value;
            if (byAmount !== 0) return byAmount;
            const ai = preferredOrder.indexOf(a.name);
            const bi = preferredOrder.indexOf(b.name);
            return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
        });

    // Daily Spend Data (for Line Chart)
    const dailyDataObj = expenses.reduce((acc, t) => {
        const date = t.date;
        if (!acc[date]) acc[date] = 0;
        acc[date] += Math.abs(t.amount);
        return acc;
    }, {});

    // Convert to array and sort by date
    const lineChartData = Object.keys(dailyDataObj).map(date => ({
        date: new Date(date).getDate(), // Day of month
        amount: dailyDataObj[date],
        fullDate: date
    })).sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));


    const handleDateChange = (d) => setCurrentDate(d);

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <MonthYearSelector value={currentDate} onChange={handleDateChange} />

            <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Income</p>
                    <h3 style={{ color: 'var(--accent-blue)', fontSize: '1.5rem' }}>
                        {currency === 'USD' ? '$' :
                            currency === 'EUR' ? '€' :
                                currency === 'GBP' ? '£' :
                                    currency === 'INR' ? '₹' :
                                        currency === 'JPY' ? '¥' : '$'}
                        {totalIncome.toFixed(2)}
                    </h3>
                </div>
                <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Expense</p>
                    <h3 style={{ color: 'var(--accent-orange)', fontSize: '1.5rem' }}>
                        {currency === 'USD' ? '$' :
                            currency === 'EUR' ? '€' :
                                currency === 'GBP' ? '£' :
                                    currency === 'INR' ? '₹' :
                                        currency === 'JPY' ? '¥' : '$'}
                        {totalExpense.toFixed(2)}
                    </h3>
                </div>
            </div>

            <div className="glass-panel" style={{ marginBottom: '2rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <button className={`icon-btn ${chartType === 'pie' ? 'active' : ''}`} onClick={() => setChartType('pie')} style={{ color: chartType === 'pie' ? 'var(--accent-blue)' : '' }}>
                        <PieIcon size={24} />
                    </button>
                    <button className={`icon-btn ${chartType === 'bar' ? 'active' : ''}`} onClick={() => setChartType('bar')} style={{ color: chartType === 'bar' ? 'var(--accent-blue)' : '' }}>
                        <BarChart3 size={24} />
                    </button>
                </div>

                <div style={{ height: '300px', width: '100%' }}>
                    {sortedChartData.length === 0 ? (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            No data for this month
                        </div>
                    ) : (
                        <>
                            {chartType === 'pie' && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sortedChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {sortedChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                            {chartType === 'bar' && (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sortedChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="name" stroke="#666" />
                                        <YAxis stroke="#666" />
                                        <Tooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
                                        <Legend />
                                        <Bar dataKey="value" name="Expense">
                                            {sortedChartData.map((entry, index) => (
                                                <Cell key={`bar-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </>
                    )}
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '1rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Top Expenses</h3>
                {sortedChartData.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span>{item.name}</span>
                        </div>
                        <span style={{ fontWeight: 'bold' }}>-
                            {currency === 'USD' ? '$' :
                                currency === 'EUR' ? '€' :
                                    currency === 'GBP' ? '£' :
                                        currency === 'INR' ? '₹' :
                                            currency === 'JPY' ? '¥' : '$'}
                            {item.value.toFixed(2)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsPage;
