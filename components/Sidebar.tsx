
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: '📊' },
    { id: 'history' as ViewType, label: 'Transactions', icon: '📋' },
    { id: 'ai-coach' as ViewType, label: 'AI Coach', icon: '🤖' },
    { id: 'settings' as ViewType, label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-950 border-r dark:border-gray-800 h-full hidden md:flex flex-col transition-colors duration-300">
      <div className="p-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                currentView === item.id 
                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-auto p-6 border-t dark:border-gray-800">
        <div className="bg-indigo-600 rounded-2xl p-4 text-white">
          <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Pro Tip</p>
          <p className="text-sm leading-relaxed">
            Upload your receipts to let AI categorize them automatically!
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
