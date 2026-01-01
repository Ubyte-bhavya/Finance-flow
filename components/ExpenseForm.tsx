
import React, { useState, useEffect } from 'react';
import { Expense, Category } from '../types';

interface ExpenseFormProps {
  expense?: Expense;
  onSave: (expense: Omit<Expense, 'id'>) => void;
  onClose: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    amount: 0,
    category: Category.Other,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        description: expense.description
      });
    }
  }, [expense]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {expense ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-2xl">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tight">Amount (₹)</label>
            <input 
              required
              type="number"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
              className="w-full text-2xl font-bold p-3 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white dark:bg-gray-800 dark:text-white"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tight">Description</label>
            <input 
              required
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white dark:bg-gray-800 dark:text-white"
              placeholder="What did you buy?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tight">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                className="w-full p-3 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-800 dark:text-white transition"
              >
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-tight">Date</label>
              <input 
                required
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-3 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-4 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-lg shadow-indigo-200 dark:shadow-none transition"
            >
              {expense ? 'Update' : 'Save'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
