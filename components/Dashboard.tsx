
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Expense, Category } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface DashboardProps {
  expenses: Expense[];
  budget: number;
  onUpdateBudget: (val: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, budget }) => {
  const currentMonth = new Date().toISOString().substring(0, 7);
  
  const monthlyExpenses = useMemo(() => {
    return expenses.filter(e => e.date.startsWith(currentMonth));
  }, [expenses, currentMonth]);

  const totalSpent = useMemo(() => {
    return monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [monthlyExpenses]);

  const categoryData = useMemo(() => {
    const data: Record<string, number> = {};
    monthlyExpenses.forEach(e => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [monthlyExpenses]);

  const dailyData = useMemo(() => {
    const data: Record<string, number> = {};
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      data[dateStr] = 0;
    }
    
    expenses.forEach(e => {
      if (data[e.date] !== undefined) {
        data[e.date] += e.amount;
      }
    });

    return Object.entries(data).map(([date, amount]) => ({
      date: date.split('-').slice(1).join('/'),
      amount
    }));
  }, [expenses]);

  const percentage = Math.min((totalSpent / budget) * 100, 100);
  const isOverBudget = totalSpent > budget;

  return (
    <div className="p-6 space-y-6 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Spent Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Spent (Monthly)</p>
            <h2 className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
          </div>
          <div className="mt-4">
             <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-indigo-600'}`}
                  style={{ width: `${percentage}%` }}
                ></div>
             </div>
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
               {percentage.toFixed(1)}% of your ₹{budget.toLocaleString('en-IN')} budget
             </p>
          </div>
        </div>

        {/* Budget Status Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Remaining Budget</p>
            <h2 className={`text-3xl font-bold mt-2 ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}>
              ₹{Math.max(0, budget - totalSpent).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            {isOverBudget ? 'You have exceeded your monthly limit.' : 'You are currently within budget!'}
          </p>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800 shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transactions</p>
          <div className="flex items-center gap-4 mt-4">
             <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-xl">
               🧾
             </div>
             <div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{monthlyExpenses.length}</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400">Recorded this month</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800 shadow-sm h-[400px]">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Spending by Category</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category] || '#CBD5E1'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#FFF' }}
                itemStyle={{ color: '#FFF' }}
                formatter={(value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} 
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800 shadow-sm h-[400px]">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Daily Activity (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={dailyData}>
              <XAxis dataKey="date" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#FFF' }}
                itemStyle={{ color: '#FFF' }}
                formatter={(value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`} 
              />
              <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
