
import React, { useState, useEffect, useMemo } from 'react';
import { Expense, Category, ViewType, MonthlyBudget, AIAnalysis } from './types';
import Dashboard from './components/Dashboard';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import AICoach from './components/AICoach';
import Sidebar from './components/Sidebar';
import { analyzeReceipt } from './services/geminiService';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudget] = useState<number>(() => {
    const saved = localStorage.getItem('monthlyBudget');
    return saved ? JSON.parse(saved) : 50000;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('monthlyBudget', JSON.stringify(budget));
  }, [budget]);

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense = { ...newExpense, id: crypto.randomUUID() };
    setExpenses(prev => [expense, ...prev]);
  };

  const updateExpense = (id: string, updated: Omit<Expense, 'id'>) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...updated, id } : e)));
    setEditingExpense(undefined);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await analyzeReceipt(base64);
      if (result) {
        setEditingExpense({
          id: '',
          amount: result.amount || 0,
          category: (result.category as Category) || Category.Other,
          date: result.date || new Date().toISOString().split('T')[0],
          description: result.description || 'Receipt Scan'
        });
        setIsFormOpen(true);
      }
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard expenses={expenses} budget={budget} onUpdateBudget={setBudget} />;
      case 'history':
        return (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold dark:text-white">Transaction History</h1>
              <button 
                onClick={() => { setEditingExpense(undefined); setIsFormOpen(true); }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg"
              >
                + Add Expense
              </button>
            </div>
            <ExpenseList expenses={expenses} onEdit={(e) => { setEditingExpense(e); setIsFormOpen(true); }} onDelete={deleteExpense} />
          </div>
        );
      case 'ai-coach':
        return <AICoach expenses={expenses} budget={budget} />;
      case 'settings':
        return (
          <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Settings</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Monthly Budget Target (₹)</label>
                <input 
                  type="number" 
                  value={budget} 
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
              <button 
                onClick={() => { if(confirm('Clear all data?')) { setExpenses([]); localStorage.clear(); } }}
                className="w-full py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition dark:border-red-900/50 dark:hover:bg-red-950/20"
              >
                Reset Application Data
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard expenses={expenses} budget={budget} onUpdateBudget={setBudget} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden transition-colors duration-300">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b dark:border-gray-800 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">💰</span>
            </div>
            <span className="font-bold text-xl text-gray-800 dark:text-white">SpendWise AI</span>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
             <label className="cursor-pointer group">
              <input type="file" className="hidden" accept="image/*" onChange={handleScanReceipt} disabled={isScanning} />
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${isScanning ? 'bg-gray-100 dark:bg-gray-800' : 'dark:border-gray-700 dark:text-gray-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>
                {isScanning ? (
                   <div className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                     <span className="text-sm font-medium">Scanning...</span>
                   </div>
                ) : (
                  <>
                    <span className="text-lg">📷</span>
                    <span className="text-sm font-medium">Scan Receipt</span>
                  </>
                )}
              </div>
            </label>
            <button 
              onClick={() => { setEditingExpense(undefined); setIsFormOpen(true); }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
            >
              + Add
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>

        {isFormOpen && (
          <ExpenseForm 
            expense={editingExpense} 
            onSave={(exp) => {
              if (editingExpense?.id) updateExpense(editingExpense.id, exp);
              else addExpense(exp);
              setIsFormOpen(false);
            }} 
            onClose={() => {
              setIsFormOpen(false);
              setEditingExpense(undefined);
            }} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
