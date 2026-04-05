import { Transaction, DashboardMetrics, CategorySpending, Category } from '../types'

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export const calculateMetrics = (transactions: Transaction[]): DashboardMetrics => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses
  const savingsRate = income > 0 ? (balance / income) * 100 : 0

  // Calculate month-over-month change
  const now = new Date()
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const currentMonthExpenses = transactions
    .filter((t) => {
      const txDate = new Date(t.date)
      return t.type === 'expense' && txDate >= currentMonth
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const previousMonthExpenses = transactions
    .filter((t) => {
      const txDate = new Date(t.date)
      return t.type === 'expense' && txDate >= previousMonth && txDate < currentMonth
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyChange =
    previousMonthExpenses > 0
      ? ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
      : 0

  return {
    totalBalance: balance,
    totalIncome: income,
    totalExpenses: expenses,
    savingsRate: Math.max(0, savingsRate),
    monthlyChange,
  }
}

export const calculateCategorySpending = (
  transactions: Transaction[]
): CategorySpending[] => {
  const categoryTotals: Record<Category, number> = {
    salary: 0,
    freelance: 0,
    food: 0,
    transport: 0,
    utilities: 0,
    entertainment: 0,
    shopping: 0,
    health: 0,
    other: 0,
  }

  const expenses = transactions.filter((t) => t.type === 'expense')

  expenses.forEach((transaction) => {
    categoryTotals[transaction.category] += transaction.amount
  })

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)

  return Object.entries(categoryTotals)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      category: category as Category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      icon: getCategoryIcon(category as Category),
    }))
    .sort((a, b) => b.amount - a.amount)
}

export const getCategoryIcon = (category: Category): string => {
  const icons: Record<Category, string> = {
    salary: '💼',
    freelance: '🎯',
    food: '🍔',
    transport: '🚗',
    utilities: '💡',
    entertainment: '🎬',
    shopping: '🛍️',
    health: '🏥',
    other: '📌',
  }
  return icons[category] || '📌'
}

export const getCategoryColor = (category: Category): string => {
  const colors: Record<Category, string> = {
    salary: 'bg-blue-600',
    freelance: 'bg-blue-500',
    food: 'bg-amber-500',
    transport: 'bg-emerald-500',
    utilities: 'bg-gray-500',
    entertainment: 'bg-purple-500',
    shopping: 'bg-pink-500',
    health: 'bg-red-500',
    other: 'bg-neutral-400',
  }
  return colors[category]
}

export const getCategoryLabel = (category: Category): string => {
  const labels: Record<Category, string> = {
    salary: 'Salary',
    freelance: 'Freelance',
    food: 'Food & Dining',
    transport: 'Transport',
    utilities: 'Utilities',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    health: 'Health',
    other: 'Other',
  }
  return labels[category]
}

export const getHighestSpendingCategory = (
  categorySpending: CategorySpending[]
): CategorySpending | null => {
  return categorySpending.length > 0 ? categorySpending[0] : null
}
