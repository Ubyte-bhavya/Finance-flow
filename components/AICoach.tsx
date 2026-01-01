
import React, { useState, useEffect } from 'react';
import { Expense, AIAnalysis } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface AICoachProps {
  expenses: Expense[];
  budget: number;
}

const AICoach: React.FC<AICoachProps> = ({ expenses, budget }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (expenses.length === 0) return;
    setLoading(true);
    const result = await getFinancialAdvice(expenses, budget);
    if (result) setAnalysis(result);
    setLoading(false);
  };

  useEffect(() => {
    if (expenses.length >= 3 && !analysis) {
       generateReport();
    }
  }, [expenses.length]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 transition-colors duration-300">
      <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Personal Financial Coach</h1>
          <p className="text-indigo-100 opacity-90 max-w-xl">
            Our AI analyzes your spending patterns in Rupees to provide personalized advice, saving tips, and budget insights.
          </p>
          <button 
            onClick={generateReport}
            disabled={loading || expenses.length === 0}
            className="mt-6 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 disabled:opacity-50 transition shadow-lg"
          >
            {loading ? 'Analyzing Habits...' : 'Generate New Insight'}
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 text-[200px] select-none">
          🧠
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Crunching the numbers...</p>
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-6 animate-in slide-in-from-bottom-10 duration-500">
          {/* Summary Section */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📝</span>
              <h2 className="text-xl font-bold dark:text-white">Monthly Summary</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg italic">
              "{analysis.summary}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Advice Section */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">💡</span>
                <h2 className="text-xl font-bold dark:text-white">Actionable Advice</h2>
              </div>
              <ul className="space-y-4">
                {analysis.advice.map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex-shrink-0 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Savings Section */}
            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border dark:border-gray-800 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">💰</span>
                <h2 className="text-xl font-bold dark:text-white">Saving Strategies</h2>
              </div>
              <ul className="space-y-4">
                {analysis.savingTips.map((tip, idx) => (
                  <li key={idx} className="flex gap-4 items-start">
                    <span className="text-green-500">✨</span>
                    <span className="text-gray-700 dark:text-gray-300 leading-tight">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {!analysis && !loading && expenses.length < 3 && (
        <div className="text-center py-20 border-2 border-dashed dark:border-gray-800 rounded-3xl bg-gray-50 dark:bg-gray-900 transition-colors">
           <p className="text-gray-400 text-lg">Add at least 3 transactions to get AI analysis.</p>
        </div>
      )}
    </div>
  );
};

export default AICoach;
