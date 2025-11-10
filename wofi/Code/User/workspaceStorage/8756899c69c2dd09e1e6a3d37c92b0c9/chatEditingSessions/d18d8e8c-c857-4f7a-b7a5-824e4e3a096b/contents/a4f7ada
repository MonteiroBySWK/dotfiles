import { useState, useEffect, useCallback } from 'react';
import { Invoice, Expense } from '@/types/financial';

const mockInvoices: Invoice[] = [
  { id: 'inv-1', amount: 1200, status: 'paid', dueDate: '2025-09-20', clientName: 'Client A' },
  { id: 'inv-2', amount: 2500, status: 'pending', dueDate: '2025-10-05', clientName: 'Client B' },
];

const mockExpenses: Expense[] = [
  { id: 'exp-1', amount: 500, category: 'Software', date: '2025-09-15', description: 'License for Figma' },
  { id: 'exp-2', amount: 150, category: 'Marketing', date: '2025-09-22', description: 'Google Ads' },
];

export function useFinancials() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllFinancialData = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setInvoices(mockInvoices);
      setExpenses(mockExpenses);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllFinancialData();
  }, [fetchAllFinancialData]);

  return { invoices, expenses, loading, error, refetch: fetchAllFinancialData };
}
