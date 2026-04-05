export type TransactionType = 'income' | 'expense'
export type UserRole = 'viewer' | 'admin'
export type Category = 'salary' | 'freelance' | 'food' | 'transport' | 'utilities' | 'entertainment' | 'shopping' | 'health' | 'other'

export interface Transaction {
  id: string
  date: string
  description: string
  category: Category
  amount: number
  type: TransactionType
}

export interface CategorySpending {
  category: Category
  amount: number
  percentage: number
  icon: string
}

export interface BalanceTrend {
  date: string
  balance: number
}

export interface Insight {
  label: string
  value: string | number
  description?: string
  color?: 'neutral' | 'emerald' | 'red' | 'blue'
}

export interface DashboardMetrics {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  savingsRate: number
  monthlyChange: number
}
