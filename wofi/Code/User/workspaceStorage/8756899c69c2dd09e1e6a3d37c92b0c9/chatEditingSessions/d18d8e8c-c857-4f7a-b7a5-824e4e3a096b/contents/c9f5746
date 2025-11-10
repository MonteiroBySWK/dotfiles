export interface Invoice {
  id: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  dueDate: string | Date;
  createdDate: string | Date;
  client: string;
  project: string;
}

export interface Expense {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string | Date;
  type: 'subscription' | 'service' | 'training';
}

export interface Budget {
  id: number;
  name: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  progress: number;
  status: 'on-track' | 'under-budget' | 'over-budget';
}

export interface FinancialOverview {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  expenses: number;
  profit: number;
  growthRate: number;
}

