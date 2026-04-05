import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Transaction, UserRole, Category } from '../types'
import { mockTransactions } from '../data/mockData'

interface FilterState {
  searchQuery: string
  selectedCategory: Category | null
  selectedType: 'income' | 'expense' | null
  dateRange: [string, string] | null
}

interface AppStore {
  transactions: Transaction[]
  role: UserRole
  filters: FilterState
  darkMode: boolean

  setTransactions: (transactions: Transaction[]) => void
  setRole: (role: UserRole) => void
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void

  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: Category | null) => void
  setSelectedType: (type: 'income' | 'expense' | null) => void
  setDateRange: (range: [string, string] | null) => void
  resetFilters: () => void

  toggleDarkMode: () => void

  getFilteredTransactions: () => Transaction[]
}

const initialFilters: FilterState = {
  searchQuery: '',
  selectedCategory: null,
  selectedType: null,
  dateRange: null,
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      role: 'viewer',
      filters: initialFilters,
      darkMode: false,

      setTransactions: (transactions) =>
        set({ transactions }),

      setRole: (role) =>
        set({ role }),

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            {
              ...transaction,
              id: `${Date.now()}`,
            },
            ...state.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      setSearchQuery: (query) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery: query },
        })),

      setSelectedCategory: (category) =>
        set((state) => ({
          filters: { ...state.filters, selectedCategory: category },
        })),

      setSelectedType: (type) =>
        set((state) => ({
          filters: { ...state.filters, selectedType: type },
        })),

      setDateRange: (range) =>
        set((state) => ({
          filters: { ...state.filters, dateRange: range },
        })),

      resetFilters: () =>
        set({ filters: initialFilters }),

      toggleDarkMode: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),

      getFilteredTransactions: () => {
        const state = get()
        const { transactions, filters } = state
        const {
          searchQuery,
          selectedCategory,
          selectedType,
          dateRange,
        } = filters

        return transactions.filter((transaction) => {
          if (
            searchQuery &&
            !transaction.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          ) {
            return false
          }

          if (selectedCategory && transaction.category !== selectedCategory) {
            return false
          }

          if (selectedType && transaction.type !== selectedType) {
            return false
          }

          if (dateRange) {
            const [startDate, endDate] = dateRange
            const txDate = transaction.date
            if (txDate < startDate || txDate > endDate) {
              return false
            }
          }

          return true
        })
      },
    }),
    {
      name: 'finance-dashboard-store',
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        darkMode: state.darkMode,
      }),
    }
  )
)
