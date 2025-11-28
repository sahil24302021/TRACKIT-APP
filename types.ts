
export enum Category {
  FOOD = 'Food',
  TRAVEL = 'Travel',
  SHOPPING = 'Shopping',
  BILLS = 'Bills',
  ESSENTIALS = 'Essentials',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health',
  INCOME = 'Income',
  OTHER = 'Other'
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: Category;
  date: string;
  type: 'income' | 'expense';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'tip' | 'success';
  date: string;
  read: boolean;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  categoryBreakdown: Record<string, number>;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  dueDate: number; // Day of month
  logo: string;
}
