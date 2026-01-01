
import React from 'react';
import { Category } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.Food]: '#F87171', // red-400
  [Category.Transport]: '#FB923C', // orange-400
  [Category.Housing]: '#60A5FA', // blue-400
  [Category.Utilities]: '#FACC15', // yellow-400
  [Category.Entertainment]: '#C084FC', // purple-400
  [Category.Health]: '#4ADE80', // green-400
  [Category.Shopping]: '#F472B6', // pink-400
  [Category.Other]: '#94A3B8', // slate-400
};

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.Food]: <span>🍕</span>,
  [Category.Transport]: <span>🚗</span>,
  [Category.Housing]: <span>🏠</span>,
  [Category.Utilities]: <span>💡</span>,
  [Category.Entertainment]: <span>🍿</span>,
  [Category.Health]: <span>🏥</span>,
  [Category.Shopping]: <span>🛍️</span>,
  [Category.Other]: <span>📦</span>,
};
