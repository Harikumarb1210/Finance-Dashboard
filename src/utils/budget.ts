import { Category, Transaction } from '../types'

export interface Budget {
  id: string
  category: Category
  limit: number
  period: 'monthly' | 'yearly'
  createdAt: string
  isActive: boolean
}

export interface FinancialGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category?: Category
  priority: 'low' | 'medium' | 'high'
  createdAt: string
  isCompleted: boolean
}

export interface BudgetStatus {
  category: Category
  spent: number
  limit: number
  remaining: number
  percentUsed: number
  status: 'on-track' | 'warning' | 'exceeded'
  daysRemaining?: number
}

/**
 * Calculate budget status for a category
 */
export const calculateBudgetStatus = (
  spent: number,
  limit: number,
  daysRemaining?: number
): BudgetStatus['status'] => {
  const percentUsed = (spent / limit) * 100

  if (percentUsed > 100) {
    return 'exceeded'
  } else if (percentUsed > 80) {
    return 'warning'
  } else {
    return 'on-track'
  }
}

/**
 * Get spending amount for a category in current month
 */
export const getCategoryMonthlySpending = (
  transactions: Transaction[],
  category: Category
): number => {
  const now = new Date()
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  return transactions
    .filter((t) => {
      const txDate = new Date(t.date)
      return (
        t.type === 'expense' &&
        t.category === category &&
        txDate >= currentMonth
      )
    })
    .reduce((sum, t) => sum + t.amount, 0)
}

/**
 * Get spending amount for a category in current year
 */
export const getCategoryYearlySpending = (
  transactions: Transaction[],
  category: Category
): number => {
  const now = new Date()
  const currentYear = new Date(now.getFullYear(), 0, 1)

  return transactions
    .filter((t) => {
      const txDate = new Date(t.date)
      return (
        t.type === 'expense' &&
        t.category === category &&
        txDate >= currentYear
      )
    })
    .reduce((sum, t) => sum + t.amount, 0)
}

/**
 * Check budget status against transactions
 */
export const checkBudgetStatus = (
  budget: Budget,
  transactions: Transaction[]
): BudgetStatus => {
  const spent =
    budget.period === 'monthly'
      ? getCategoryMonthlySpending(transactions, budget.category)
      : getCategoryYearlySpending(transactions, budget.category)

  const remaining = Math.max(0, budget.limit - spent)
  const percentUsed = (spent / budget.limit) * 100

  return {
    category: budget.category,
    spent,
    limit: budget.limit,
    remaining,
    percentUsed: Math.min(100, percentUsed),
    status: calculateBudgetStatus(spent, budget.limit),
  }
}

/**
 * Get all budgets status
 */
export const getAllBudgetStatus = (
  budgets: Budget[],
  transactions: Transaction[]
): BudgetStatus[] => {
  return budgets
    .filter((b) => b.isActive)
    .map((budget) => checkBudgetStatus(budget, transactions))
}

/**
 * Calculate days remaining in budget period
 */
export const getDaysRemainingInPeriod = (period: 'monthly' | 'yearly'): number => {
  const now = new Date()

  if (period === 'monthly') {
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return Math.ceil(
      (nextMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
  } else {
    const nextYear = new Date(now.getFullYear() + 1, 0, 1)
    return Math.ceil(
      (nextYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )
  }
}

/**
 * Estimate daily spending to reach budget limit
 */
export const estimateDailySpendingLimit = (
  budget: Budget,
  spent: number
): number => {
  const remaining = Math.max(0, budget.limit - spent)
  const daysRemaining = getDaysRemainingInPeriod(budget.period)

  return daysRemaining > 0 ? remaining / daysRemaining : 0
}

/**
 * Get budget alerts (budgets that need attention)
 */
export const getBudgetAlerts = (
  budgets: Budget[],
  transactions: Transaction[],
  alertThreshold: number = 80
): BudgetStatus[] => {
  return getAllBudgetStatus(budgets, transactions).filter(
    (status) => status.percentUsed >= alertThreshold
  )
}

/**
 * Calculate goal progress
 */
export const calculateGoalProgress = (goal: FinancialGoal): number => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100
  return Math.min(100, Math.max(0, progress))
}

/**
 * Estimate days to reach goal
 */
export const estimateDaysToGoal = (
  goal: FinancialGoal,
  monthlyContribution: number
): number => {
  if (monthlyContribution <= 0) return -1

  const remaining = goal.targetAmount - goal.currentAmount
  const monthsNeeded = remaining / monthlyContribution

  return Math.ceil(monthsNeeded * 30.44) // Average days per month
}

/**
 * Check if goal is on track
 */
export const isGoalOnTrack = (goal: FinancialGoal): boolean => {
  const now = new Date()
  const deadline = new Date(goal.deadline)
  const totalDays = (deadline.getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  const daysElapsed = (now.getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24)

  if (totalDays <= 0) return false

  const expectedProgress = (daysElapsed / totalDays) * 100
  const actualProgress = calculateGoalProgress(goal)

  return actualProgress >= expectedProgress * 0.9 // 90% of expected is on track
}

/**
 * Calculate required monthly contribution for goal
 */
export const calculateRequiredMonthlyContribution = (goal: FinancialGoal): number => {
  const now = new Date()
  const deadline = new Date(goal.deadline)
  const remaining = goal.targetAmount - goal.currentAmount
  const monthsRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44)

  return monthsRemaining > 0 ? remaining / monthsRemaining : 0
}

/**
 * Get goals sorted by priority and deadline
 */
export const sortGoalsByPriority = (goals: FinancialGoal[]): FinancialGoal[] => {
  const priorityValue = { high: 3, medium: 2, low: 1 }

  return [...goals]
    .filter((g) => !g.isCompleted)
    .sort((a, b) => {
      const priorityDiff =
        priorityValue[b.priority] - priorityValue[a.priority]
      if (priorityDiff !== 0) return priorityDiff

      return (
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      )
    })
}

/**
 * Get spending recommendations based on budget
 */
export const getSpendingRecommendations = (
  budgets: Budget[],
  transactions: Transaction[]
): string[] => {
  const recommendations: string[] = []
  const alerts = getBudgetAlerts(budgets, transactions, 80)

  if (alerts.length === 0) {
    recommendations.push(
      'Your spending is well under control. Keep up the good financial habits!'
    )
  }

  alerts.forEach((alert) => {
    const percentRemaining = 100 - alert.percentUsed
    if (alert.percentUsed > 100) {
      recommendations.push(
        `⚠️ You have exceeded your ${alert.category} budget by ${(alert.percentUsed - 100).toFixed(1)}%`
      )
    } else if (alert.percentUsed > 90) {
      recommendations.push(
        `📌 You have only ${percentRemaining.toFixed(1)}% of your ${alert.category} budget remaining`
      )
    } else if (alert.percentUsed > 80) {
      recommendations.push(
        `💡 Consider reducing ${alert.category} spending. You've used ${alert.percentUsed.toFixed(1)}% of your budget`
      )
    }
  })

  // Find categories with highest spending
  const topCategories = transactions
    .filter((t) => t.type === 'expense')
    .reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>
    )

  const maxCategory = Object.entries(topCategories).sort(([, a], [, b]) => b - a)[0]
  if (maxCategory && maxCategory[1] > 0) {
    recommendations.push(
      `📊 Your highest spending category is ${maxCategory[0]} at $${maxCategory[1].toFixed(2)}`
    )
  }

  return recommendations
}
