import { BaseRepository } from './base.repository'
import { Invoice, Expense, Budget, Payment, FinancialOverview } from '@/types'

export class InvoiceRepository extends BaseRepository<Invoice> {
  constructor() {
    super('invoices')
  }
}

export class ExpenseRepository extends BaseRepository<Expense> {
  constructor() {
    super('expenses')
  }
}

export class BudgetRepository extends BaseRepository<Budget> {
  constructor() {
    super('budgets')
  }
}

export class PaymentRepository extends BaseRepository<Payment> {
  constructor() {
    super('payments')
  }
}

// Financial service class that aggregates all repositories
export class FinancialService {
  private invoiceRepo = new InvoiceRepository()
  private expenseRepo = new ExpenseRepository()
  private budgetRepo = new BudgetRepository()
  private paymentRepo = new PaymentRepository()

  // Invoice methods
  async getInvoices(): Promise<Invoice[]> {
    return this.invoiceRepo.getAll()
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return this.invoiceRepo.getById(id)
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.invoiceRepo.create({
      ...invoice,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<void> {
    return this.invoiceRepo.update(id, {
      ...invoice,
      updatedAt: new Date()
    })
  }

  async deleteInvoice(id: string): Promise<void> {
    return this.invoiceRepo.delete(id)
  }

  // Expense methods
  async getExpenses(): Promise<Expense[]> {
    return this.expenseRepo.getAll()
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    return this.expenseRepo.getById(id)
  }

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.expenseRepo.create({
      ...expense,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  async updateExpense(id: string, expense: Partial<Expense>): Promise<void> {
    return this.expenseRepo.update(id, {
      ...expense,
      updatedAt: new Date()
    })
  }

  async deleteExpense(id: string): Promise<void> {
    return this.expenseRepo.delete(id)
  }

  // Budget methods
  async getBudgets(): Promise<Budget[]> {
    return this.budgetRepo.getAll()
  }

  async getBudgetById(id: string): Promise<Budget | null> {
    return this.budgetRepo.getById(id)
  }

  async createBudget(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.budgetRepo.create({
      ...budget,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  async updateBudget(id: string, budget: Partial<Budget>): Promise<void> {
    return this.budgetRepo.update(id, {
      ...budget,
      updatedAt: new Date()
    })
  }

  async deleteBudget(id: string): Promise<void> {
    return this.budgetRepo.delete(id)
  }

  // Payment methods
  async getPayments(): Promise<Payment[]> {
    return this.paymentRepo.getAll()
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    return this.paymentRepo.getById(id)
  }

  async createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return this.paymentRepo.create({
      ...payment,
      createdAt: new Date(),
      updatedAt: new Date()
    })
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<void> {
    return this.paymentRepo.update(id, {
      ...payment,
      updatedAt: new Date()
    })
  }

  async deletePayment(id: string): Promise<void> {
    return this.paymentRepo.delete(id)
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

export const financialService = new FinancialService()