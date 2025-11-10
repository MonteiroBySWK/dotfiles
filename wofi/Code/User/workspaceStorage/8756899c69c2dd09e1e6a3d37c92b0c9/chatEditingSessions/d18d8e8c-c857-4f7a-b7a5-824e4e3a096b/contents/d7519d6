import { useState, useEffect, useCallback } from 'react';
import { Invoice, Expense, Budget, FinancialOverview } from '@/types/financial';

const mockFinancialOverview: FinancialOverview = {
  totalRevenue: 450000,
  monthlyRevenue: 75000,
  pendingInvoices: 25000,
  expenses: 35000,
  profit: 40000,
  growthRate: 12.5
};

const mockInvoices: Invoice[] = [
  {
    id: "INV-001",
    client: "TechCorp Solutions",
    project: "Sistema CRM",
    amount: 25000,
    status: "paid",
    dueDate: "2024-01-15",
    createdDate: "2024-01-01"
  },
  {
    id: "INV-002",
    client: "StartupXYZ",
    project: "App Mobile",
    amount: 15000,
    status: "pending",
    dueDate: "2024-01-20",
    createdDate: "2024-01-05"
  },
  {
    id: "INV-003",
    client: "E-commerce Plus",
    project: "Website Redesign",
    amount: 8000,
    status: "overdue",
    dueDate: "2024-01-10",
    createdDate: "2023-12-20"
  },
  {
    id: "INV-004",
    client: "Digital Agency",
    project: "Consultoria",
    amount: 12000,
    status: "draft",
    dueDate: "2024-01-25",
    createdDate: "2024-01-18"
  }
];

const mockExpenses: Expense[] = [
  {
    id: 1,
    description: "Licenças de Software",
    category: "Tecnologia",
    amount: 2500,
    date: "2024-01-15",
    type: "subscription"
  },
  {
    id: 2,
    description: "Marketing Digital",
    category: "Marketing",
    amount: 8000,
    date: "2024-01-10",
    type: "service"
  },
  {
    id: 3,
    description: "Infraestrutura AWS",
    category: "Tecnologia",
    amount: 1200,
    date: "2024-01-08",
    type: "subscription"
  },
  {
    id: 4,
    description: "Treinamento Equipe",
    category: "Educação",
    amount: 3500,
    date: "2024-01-05",
    type: "training"
  }
];

const mockBudgets: Budget[] = [
  {
    id: 1,
    name: "Projeto CRM - TechCorp",
    totalBudget: 80000,
    spent: 60000,
    remaining: 20000,
    progress: 75,
    status: "on-track"
  },
  {
    id: 2,
    name: "App Mobile - StartupXYZ",
    totalBudget: 120000,
    spent: 25000,
    remaining: 95000,
    progress: 21,
    status: "under-budget"
  },
  {
    id: 3,
    name: "Website - E-commerce",
    totalBudget: 45000,
    spent: 48000,
    remaining: -3000,
    progress: 107,
    status: "over-budget"
  }
];

export function useFinancials() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [financialOverview, setFinancialOverview] = useState<FinancialOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllFinancialData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setInvoices(mockInvoices);
      setExpenses(mockExpenses);
      setBudgets(mockBudgets);
      setFinancialOverview(mockFinancialOverview);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllFinancialData();
  }, [fetchAllFinancialData]);

  return { invoices, expenses, budgets, financialOverview, loading, error, refetch: fetchAllFinancialData };
}

