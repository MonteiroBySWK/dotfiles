import { Invoice, Expense, Budget, Payment, FinancialOverview } from '@/types'
import { financialService as financialRepo } from '@/repositories/financial.repository'

export class FinancialService {
  // Invoice methods
  async getInvoices(): Promise<Invoice[]> {
    return financialRepo.getInvoices()
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return financialRepo.getInvoiceById(id)
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return financialRepo.createInvoice(invoice)
  }

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<void> {
    return financialRepo.updateInvoice(id, invoice)
  }

  async deleteInvoice(id: string): Promise<void> {
    return financialRepo.deleteInvoice(id)
  }

  // Expense methods
  async getExpenses(): Promise<Expense[]> {
    return financialRepo.getExpenses()
  }

  async getExpenseById(id: string): Promise<Expense | null> {
    return financialRepo.getExpenseById(id)
  }

  async createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return financialRepo.createExpense(expense)
  }

  async updateExpense(id: string, expense: Partial<Expense>): Promise<void> {
    return financialRepo.updateExpense(id, expense)
  }

  async deleteExpense(id: string): Promise<void> {
    return financialRepo.deleteExpense(id)
  }

  // Budget methods
  async getBudgets(): Promise<Budget[]> {
    return financialRepo.getBudgets()
  }

  async getBudgetById(id: string): Promise<Budget | null> {
    return financialRepo.getBudgetById(id)
  }

  async createBudget(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return financialRepo.createBudget(budget)
  }

  async updateBudget(id: string, budget: Partial<Budget>): Promise<void> {
    return financialRepo.updateBudget(id, budget)
  }

  async deleteBudget(id: string): Promise<void> {
    return financialRepo.deleteBudget(id)
  }

  // Payment methods
  async getPayments(): Promise<Payment[]> {
    return financialRepo.getPayments()
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    return financialRepo.getPaymentById(id)
  }

  async createPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    return financialRepo.createPayment(payment)
  }

  async updatePayment(id: string, payment: Partial<Payment>): Promise<void> {
    return financialRepo.updatePayment(id, payment)
  }

  async deletePayment(id: string): Promise<void> {
    return financialRepo.deletePayment(id)
  }

  // Financial overview
  async getFinancialOverview(): Promise<FinancialOverview> {
    return financialRepo.getFinancialOverview()
  }

  // Business logic methods
  async getInvoicesByStatus(status: Invoice['status']): Promise<Invoice[]> {
    const invoices = await this.getInvoices()
    return invoices.filter(invoice => invoice.status === status)
  }

  async getExpensesByCategory(category: string): Promise<Expense[]> {
    const expenses = await this.getExpenses()
    return expenses.filter(expense => expense.category === category)
  }

  async getExpensesByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    const expenses = await this.getExpenses()
    return expenses.filter(expense => 
      expense.date >= startDate && expense.date <= endDate
    )
  }

  async getBudgetsByStatus(status: Budget['status']): Promise<Budget[]> {
    const budgets = await this.getBudgets()
    return budgets.filter(budget => budget.status === status)
  }

  async calculateTotalRevenue(): Promise<number> {
    const invoices = await this.getInvoices()
    return invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0)
  }

  async calculateMonthlyExpenses(month?: number, year?: number): Promise<number> {
    const currentDate = new Date()
    const targetMonth = month ?? currentDate.getMonth()
    const targetYear = year ?? currentDate.getFullYear()

    const expenses = await this.getExpenses()
    return expenses
      .filter(expense => 
        expense.date.getMonth() === targetMonth && 
        expense.date.getFullYear() === targetYear
      )
      .reduce((sum, expense) => sum + expense.amount, 0)
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    const invoices = await this.getInvoices()
    const today = new Date()
    
    return invoices.filter(invoice => 
      (invoice.status === 'pending' || invoice.status === 'overdue') &&
      invoice.dueDate < today
    )
  }

  async markInvoiceAsPaid(invoiceId: string): Promise<void> {
    return this.updateInvoice(invoiceId, {
      status: 'paid',
      paidAt: new Date()
    })
  }

  async markInvoiceAsOverdue(invoiceId: string): Promise<void> {
    return this.updateInvoice(invoiceId, {
      status: 'overdue'
    })
  }
}

export const financialService = new FinancialService()