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
    id: "1",
    name: "Marketing Digital Q4",
    category: "Campanhas",
    totalBudget: 450000,
    spent: 342000,
    remaining: 108000,
    progress: 76,
    status: "on-track",
    projectId: "PROJ-001",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    updatedAt: "2024-09-21",
  },
  {
    id: "2",
    name: "Desenvolvimento de Software",
    category: "Projetos",
    totalBudget: 680000,
    spent: 578000,
    remaining: 102000,
    progress: 85,
    status: "over-budget",
    projectId: "PROJ-002",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    updatedAt: "2024-09-20",
  },
  {
    id: "3",
    name: "Recursos Humanos",
    category: "Operacional",
    totalBudget: 320000,
    spent: 186000,
    remaining: 134000,
    progress: 58,
    status: "under-budget",
    projectId: "PROJ-003",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    updatedAt: "2024-09-19",
  },
  {
    id: "4",
    name: "Vendas e Comercial",
    category: "Operacional",
    totalBudget: 580000,
    spent: 435000,
    remaining: 145000,
    progress: 75,
    status: "on-track",
    projectId: "PROJ-004",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    updatedAt: "2024-09-21",
  },
  {
    id: "5",
    name: "Infraestrutura TI",
    category: "Infraestrutura",
    totalBudget: 290000,
    spent: 145000,
    remaining: 145000,
    progress: 50,
    status: "under-budget",
    projectId: "PROJ-005",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    updatedAt: "2024-09-18",
  },
  {
    id: "6",
    name: "Pesquisa e Desenvolvimento",
    category: "Inovação",
    totalBudget: 180000,
    spent: 189000,
    remaining: -9000,
    progress: 105,
    status: "over-budget",
    projectId: "PROJ-006",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    updatedAt: "2024-09-21",
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

