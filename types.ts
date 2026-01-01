
export enum Category {
  Food = 'Food',
  Transport = 'Transport',
  Housing = 'Housing',
  Utilities = 'Utilities',
  Entertainment = 'Entertainment',
  Health = 'Health',
  Shopping = 'Shopping',
  Other = 'Other'
}

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string;
  description: string;
}

export interface MonthlyBudget {
  month: string; // YYYY-MM
  limit: number;
}

export type ViewType = 'dashboard' | 'history' | 'ai-coach' | 'settings';

export interface AIAnalysis {
  summary: string;
  advice: string[];
  savingTips: string[];
}
