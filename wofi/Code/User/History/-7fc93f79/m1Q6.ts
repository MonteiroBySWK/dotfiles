import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Invoice, Expense, Budget, Payment, FinancialOverview } from '@/types'
import { financialService } from '@/repositories/financial.repository'

interface FinancialState {
  // Data
  invoices: Invoice[]
  expenses: Expense[]
  budgets: Budget[]
  payments: Payment[]
  financialOverview: FinancialOverview | null

  // Loading states
  isLoading: boolean
  isInvoicesLoading: boolean
  isExpensesLoading: boolean
  isBudgetsLoading: boolean
  isPaymentsLoading: boolean

  // Error states
  error: string | null
  invoicesError: string | null
  expensesError: string | null
  budgetsError: string | null
  paymentsError: string | null

  // Actions
  fetchInvoices: () => Promise<void>
  fetchExpenses: () => Promise<void>
  fetchBudgets: () => Promise<void>
  fetchPayments: () => Promise<void>
  fetchFinancialOverview: () => Promise<void>
  fetchAllFinancialData: () => Promise<void>

  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>
  deleteInvoice: (id: string) => Promise<void>

  createExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>

  createBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>
  deleteBudget: (id: string) => Promise<void>

  createPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updatePayment: (id: string, payment: Partial<Payment>) => Promise<void>
  deletePayment: (id: string) => Promise<void>

  // Utility actions
  clearError: () => void
  reset: () => void
}

const initialState = {
  invoices: [],
  expenses: [],
  budgets: [],
  payments: [],
  financialOverview: null,
  isLoading: false,
  isInvoicesLoading: false,
  isExpensesLoading: false,
  isBudgetsLoading: false,
  isPaymentsLoading: false,
  error: null,
  invoicesError: null,
  expensesError: null,
  budgetsError: null,
  paymentsError: null,
}

export const useFinancialStore = create<FinancialState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Invoice actions
      fetchInvoices: async () => {
        set({ isInvoicesLoading: true, invoicesError: null })
        try {
          const invoices = await financialService.getInvoices()
          set({ invoices, isInvoicesLoading: false })
        } catch (error) {
          console.error('Error fetching invoices:', error)
          set({ 
            invoicesError: error instanceof Error ? error.message : 'Failed to fetch invoices',
            isInvoicesLoading: false 
          })
        }
      },

      createInvoice: async (invoiceData) => {
        try {
          await financialService.createInvoice(invoiceData)
          await get().fetchInvoices() // Refresh the list
        } catch (error) {
          console.error('Error creating invoice:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to create invoice' })
          throw error
        }
      },

      updateInvoice: async (id, invoiceData) => {
        try {
          await financialService.updateInvoice(id, invoiceData)
          await get().fetchInvoices() // Refresh the list
        } catch (error) {
          console.error('Error updating invoice:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to update invoice' })
          throw error
        }
      },

      deleteInvoice: async (id) => {
        try {
          await financialService.deleteInvoice(id)
          await get().fetchInvoices() // Refresh the list
        } catch (error) {
          console.error('Error deleting invoice:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to delete invoice' })
          throw error
        }
      },

      // Expense actions
      fetchExpenses: async () => {
        set({ isExpensesLoading: true, expensesError: null })
        try {
          const expenses = await financialService.getExpenses()
          set({ expenses, isExpensesLoading: false })
        } catch (error) {
          console.error('Error fetching expenses:', error)
          set({ 
            expensesError: error instanceof Error ? error.message : 'Failed to fetch expenses',
            isExpensesLoading: false 
          })
        }
      },

      createExpense: async (expenseData) => {
        try {
          await financialService.createExpense(expenseData)
          await get().fetchExpenses() // Refresh the list
        } catch (error) {
          console.error('Error creating expense:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to create expense' })
          throw error
        }
      },

      updateExpense: async (id, expenseData) => {
        try {
          await financialService.updateExpense(id, expenseData)
          await get().fetchExpenses() // Refresh the list
        } catch (error) {
          console.error('Error updating expense:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to update expense' })
          throw error
        }
      },

      deleteExpense: async (id) => {
        try {
          await financialService.deleteExpense(id)
          await get().fetchExpenses() // Refresh the list
        } catch (error) {
          console.error('Error deleting expense:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to delete expense' })
          throw error
        }
      },

      // Budget actions
      fetchBudgets: async () => {
        set({ isBudgetsLoading: true, budgetsError: null })
        try {
          const budgets = await financialService.getBudgets()
          set({ budgets, isBudgetsLoading: false })
        } catch (error) {
          console.error('Error fetching budgets:', error)
          set({ 
            budgetsError: error instanceof Error ? error.message : 'Failed to fetch budgets',
            isBudgetsLoading: false 
          })
        }
      },

      createBudget: async (budgetData) => {
        try {
          await financialService.createBudget(budgetData)
          await get().fetchBudgets() // Refresh the list
        } catch (error) {
          console.error('Error creating budget:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to create budget' })
          throw error
        }
      },

      updateBudget: async (id, budgetData) => {
        try {
          await financialService.updateBudget(id, budgetData)
          await get().fetchBudgets() // Refresh the list
        } catch (error) {
          console.error('Error updating budget:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to update budget' })
          throw error
        }
      },

      deleteBudget: async (id) => {
        try {
          await financialService.deleteBudget(id)
          await get().fetchBudgets() // Refresh the list
        } catch (error) {
          console.error('Error deleting budget:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to delete budget' })
          throw error
        }
      },

      // Payment actions
      fetchPayments: async () => {
        set({ isPaymentsLoading: true, paymentsError: null })
        try {
          const payments = await financialService.getPayments()
          set({ payments, isPaymentsLoading: false })
        } catch (error) {
          console.error('Error fetching payments:', error)
          set({ 
            paymentsError: error instanceof Error ? error.message : 'Failed to fetch payments',
            isPaymentsLoading: false 
          })
        }
      },

      createPayment: async (paymentData) => {
        try {
          await financialService.createPayment(paymentData)
          await get().fetchPayments() // Refresh the list
        } catch (error) {
          console.error('Error creating payment:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to create payment' })
          throw error
        }
      },

      updatePayment: async (id, paymentData) => {
        try {
          await financialService.updatePayment(id, paymentData)
          await get().fetchPayments() // Refresh the list
        } catch (error) {
          console.error('Error updating payment:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to update payment' })
          throw error
        }
      },

      deletePayment: async (id) => {
        try {
          await financialService.deletePayment(id)
          await get().fetchPayments() // Refresh the list
        } catch (error) {
          console.error('Error deleting payment:', error)
          set({ error: error instanceof Error ? error.message : 'Failed to delete payment' })
          throw error
        }
      },

      // Financial overview
      fetchFinancialOverview: async () => {
        set({ isLoading: true, error: null })
        try {
          const financialOverview = await financialService.getFinancialOverview()
          set({ financialOverview, isLoading: false })
        } catch (error) {
          console.error('Error fetching financial overview:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch financial overview',
            isLoading: false 
          })
        }
      },

      // Fetch all financial data
      fetchAllFinancialData: async () => {
        set({ isLoading: true, error: null })
        try {
          await Promise.all([
            get().fetchInvoices(),
            get().fetchExpenses(),
            get().fetchBudgets(),
            get().fetchPayments(),
            get().fetchFinancialOverview()
          ])
          set({ isLoading: false })
        } catch (error) {
          console.error('Error fetching financial data:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch financial data',
            isLoading: false 
          })
        }
      },

      // Utility actions
      clearError: () => set({ 
        error: null, 
        invoicesError: null, 
        expensesError: null, 
        budgetsError: null, 
        paymentsError: null 
      }),

      reset: () => set(initialState)
    }),
    { name: 'financial-store' }
  )
)