import { BaseRepository } from './base.repository'
import { Invoice, Expense, Budget, Payment, FinancialOverview } from '@/types'

export class InvoiceRepository extends BaseRepository<Invoice> {
  constructor() {
    super('invoices')
  }

  async getInvoices(): Promise<Invoice[]> {
    return this.getAll()
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return this.getById(id)
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.create(invoice)
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<void> {
    return this.update(id, invoice)
  }

  async deleteInvoice(id: string): Promise<void> {
    return this.delete(id)
  }
}

export class ExpenseRepository extends BaseRepository<Expense> {
  constructor() {
    super('expenses')
  }

  // Expense methods
  async getExpenses(): Promise<Expense[]> {
    return this.getAll<Expense>('expenses')
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    return this.getById<Expense>('expenses', id)
  }

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    return this.create<Expense>('expenses', expense)
  }

  async updateExpense(id: string, expense: Partial<Expense>): Promise<Expense | null> {
    return this.update<Expense>('expenses', id, expense)
  }

  async deleteExpense(id: string): Promise<boolean> {
    return this.delete('expenses', id)
  }

  // Budget methods
  async getBudgets(): Promise<Budget[]> {
    return this.getAll<Budget>('budgets')
  }

  async getBudgetById(id: string): Promise<Budget | null> {
    return this.getById<Budget>('budgets', id)
  }

  async createBudget(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> {
    return this.create<Budget>('budgets', budget)
  }

  async updateBudget(id: string, budget: Partial<Budget>): Promise<Budget | null> {
    return this.update<Budget>('budgets', id, budget)
  }

  async deleteBudget(id: string): Promise<boolean> {
    return this.delete('budgets', id)
  }

  // Payment methods
  async getPayments(): Promise<Payment[]> {
    return this.getAll<Payment>('payments')
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    return this.getById<Payment>('payments', id)
  }

  async createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    return this.create<Payment>('payments', payment)
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<Payment | null> {
    return this.update<Payment>('payments', id, payment)
  }

  async deletePayment(id: string): Promise<boolean> {
    return this.delete('payments', id)
  }

  // Financial overview calculation
  async getFinancialOverview(): Promise<FinancialOverview> {
    try {
      const [invoices, expenses] = await Promise.all([
        this.getInvoices(),
        this.getExpenses()
      ])

      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      // Calculate total revenue (paid invoices)
      const paidInvoices = invoices.filter(invoice => invoice.status === 'paid')
      const totalRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)

      // Calculate monthly revenue
      const monthlyRevenue = paidInvoices
        .filter(invoice => {
          const invoiceDate = invoice.paidAt || invoice.createdAt
          return invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear
        })
        .reduce((sum, invoice) => sum + invoice.amount, 0)

      // Calculate pending invoices
      const pendingInvoices = invoices
        .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
        .reduce((sum, invoice) => sum + invoice.amount, 0)

      // Calculate total expenses
      const totalExpenses = expenses
        .filter(expense => {
          return expense.date.getMonth() === currentMonth && expense.date.getFullYear() === currentYear
        })
        .reduce((sum, expense) => sum + expense.amount, 0)

      // Calculate profit
      const profit = monthlyRevenue - totalExpenses

      // Calculate growth rate (simplified - comparing with previous month)
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
      
      const previousMonthRevenue = paidInvoices
        .filter(invoice => {
          const invoiceDate = invoice.paidAt || invoice.createdAt
          return invoiceDate.getMonth() === previousMonth && invoiceDate.getFullYear() === previousMonthYear
        })
        .reduce((sum, invoice) => sum + invoice.amount, 0)

      const growthRate = previousMonthRevenue > 0 
        ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
        : 0

      return {
        totalRevenue,
        monthlyRevenue,
        pendingInvoices,
        expenses: totalExpenses,
        profit,
        growthRate
      }
    } catch (error) {
      console.error('Error calculating financial overview:', error)
      return {
        totalRevenue: 0,
        monthlyRevenue: 0,
        pendingInvoices: 0,
        expenses: 0,
        profit: 0,
        growthRate: 0
      }
    }
  }
}

export const financialRepository = new FinancialRepository()