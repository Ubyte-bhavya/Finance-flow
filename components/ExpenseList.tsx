
import React from 'react';
import { Expense } from '../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../constants';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (e: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed dark:border-gray-800 rounded-3xl bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-400 text-lg">No transactions found yet.</p>
        <p className="text-gray-400 text-sm">Add your first expense or scan a receipt!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border dark:border-gray-800 shadow-sm overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Expense</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: `${CATEGORY_COLORS[expense.category]}20` }}
                    >
                      {CATEGORY_ICONS[expense.category]}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{expense.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-gray-900 dark:text-white">₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button 
                      onClick={() => onEdit(expense)}
                      className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => onDelete(expense.id)}
                      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;
