import { Transaction, Category } from '../types'

export interface MonthlyReport {
  month: string
  income: number
  expenses: number
  balance: number
  transactionCount: number
}

export interface CategoryTrend {
  category: Category
  total: number
  average: number
  transactionCount: number
  percentOfTotal: number
}

export interface BudgetAlert {
  category: Category
  spent: number
  budget: number
  percentUsed: number
  isAlert: boolean
}

/**
 * Generate monthly financial reports
 */
export const generateMonthlyReport = (transactions: Transaction[]): MonthlyReport[] => {
  const monthlyData: Record<string, MonthlyReport> = {}

  transactions.forEach((t) => {
    const date = new Date(t.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthKey,
        income: 0,
        expenses: 0,
        balance: 0,
        transactionCount: 0,
      }
    }

    const record = monthlyData[monthKey]
    if (t.type === 'income') {
      record.income += t.amount
    } else {
      record.expenses += t.amount
    }
    record.balance = record.income - record.expenses
    record.transactionCount += 1
  })

  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))
}

/**
 * Analyze spending trends by category
 */
export const analyzeCategoryTrends = (transactions: Transaction[]): CategoryTrend[] => {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)

  const categoryStats: Record<Category, { total: number; count: number }> = {} as any

  expenses.forEach((t) => {
    if (!categoryStats[t.category]) {
      categoryStats[t.category] = { total: 0, count: 0 }
    }
    categoryStats[t.category].total += t.amount
    categoryStats[t.category].count += 1
  })

  return Object.entries(categoryStats)
    .map(([category, data]) => ({
      category: category as Category,
      total: data.total,
      average: data.total / data.count,
      transactionCount: data.count,
      percentOfTotal: totalExpenses > 0 ? (data.total / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total)
}

/**
 * Calculate spending velocity (rate of spending)
 */
export const calculateSpendingVelocity = (transactions: Transaction[]) => {
  if (transactions.length === 0) return 0

  const sortedByDate = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const firstDate = new Date(sortedByDate[0].date).getTime()
  const lastDate = new Date(sortedByDate[sortedByDate.length - 1].date).getTime()
  const daysElapsed = (lastDate - firstDate) / (1000 * 60 * 60 * 24)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return daysElapsed > 0 ? totalExpenses / daysElapsed : 0
}

/**
 * Identify unusual spending patterns
 */
export const identifySpendingAnomalies = (
  transactions: Transaction[],
  threshold: number = 2
): Transaction[] => {
  const expenses = transactions.filter((t) => t.type === 'expense')

  if (expenses.length < 3) return []

  // Calculate average and standard deviation per category
  const categoryStats: Record<Category, { amounts: number[] }> = {} as any

  expenses.forEach((t) => {
    if (!categoryStats[t.category]) {
      categoryStats[t.category] = { amounts: [] }
    }
    categoryStats[t.category].amounts.push(t.amount)
  })

  const anomalies: Transaction[] = []

  expenses.forEach((t) => {
    const stats = categoryStats[t.category]
    const amounts = stats.amounts

    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length
    const variance = amounts.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / amounts.length
    const stdDev = Math.sqrt(variance)

    const zScore = Math.abs((t.amount - mean) / stdDev)

    if (zScore > threshold) {
      anomalies.push(t)
    }
  })

  return anomalies
}

/**
 * Calculate financial health score (0-100)
 */
export const calculateFinancialHealthScore = (transactions: Transaction[]): number => {
  if (transactions.length === 0) return 50

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  if (income === 0) return 0

  const savingsRate = ((income - expenses) / income) * 100

  // Score based on savings rate
  // Positive savings = higher score
  // Break-even = 50
  // Deficit = lower score

  const baseScore = Math.min(100, Math.max(0, 50 + (savingsRate / 2)))

  // Bonus for consistent positive balance
  const recentTransactions = transactions.slice(-30)
  const recentExpenses = recentTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const recentIncome = recentTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const recentBalance = recentIncome - recentExpenses
  const consistencyBonus = recentBalance > 0 ? 5 : 0

  return Math.min(100, baseScore + consistencyBonus)
}

/**
 * Forecast monthly expenses based on historical data
 */
export const forecastMonthlyExpenses = (
  transactions: Transaction[],
  monthsAhead: number = 3
): number[] => {
  const monthlyReports = generateMonthlyReport(transactions)

  if (monthlyReports.length === 0) return Array(monthsAhead).fill(0)

  // Use last 3 months for trend
  const recentMonths = monthlyReports.slice(-3)
  const recentExpenses = recentMonths.map((m) => m.expenses)

  // Calculate average growth rate
  const growthRates = []
  for (let i = 1; i < recentExpenses.length; i++) {
    if (recentExpenses[i - 1] > 0) {
      const rate = (recentExpenses[i] - recentExpenses[i - 1]) / recentExpenses[i - 1]
      growthRates.push(rate)
    }
  }

  const avgGrowthRate = growthRates.length > 0 ? growthRates.reduce((a, b) => a + b) / growthRates.length : 0

  const lastExpenses = recentExpenses[recentExpenses.length - 1]
  const forecast = []

  for (let i = 1; i <= monthsAhead; i++) {
    const projected = lastExpenses * Math.pow(1 + avgGrowthRate, i)
    forecast.push(Math.round(projected * 100) / 100)
  }

  return forecast
}

/**
 * Calculate key financial ratios
 */
export const calculateFinancialRatios = (transactions: Transaction[]) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expenses

  return {
    savingsRate: income > 0 ? (balance / income) * 100 : 0,
    expenseRatio: income > 0 ? (expenses / income) * 100 : 0,
    incomeToExpenseRatio: expenses > 0 ? income / expenses : 0,
    averageTransactionSize: transactions.length > 0 ? (income + expenses) / transactions.length : 0,
  }
}

/**
 * Identify top spending categories
 */
export const getTopSpendingCategories = (
  transactions: Transaction[],
  limit: number = 5
): CategoryTrend[] => {
  const trends = analyzeCategoryTrends(transactions)
  return trends.slice(0, limit)
}

/**
 * Calculate spending by day of week
 */
export const analyzeSpendingByDayOfWeek = (transactions: Transaction[]) => {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const daySpending: Record<string, { total: number; count: number }> = {}

  dayNames.forEach((day) => {
    daySpending[day] = { total: 0, count: 0 }
  })

  expenses.forEach((t) => {
    const date = new Date(t.date)
    const dayName = dayNames[date.getDay()]
    daySpending[dayName].total += t.amount
    daySpending[dayName].count += 1
  })

  return Object.entries(daySpending).map(([day, data]) => ({
    day,
    total: data.total,
    count: data.count,
    average: data.count > 0 ? data.total / data.count : 0,
  }))
}
