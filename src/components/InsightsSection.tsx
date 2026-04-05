import React from 'react'
import {
  TrendingDown,
  TrendingUp,
  PieChart as PieChartIcon,
  Target,
} from 'lucide-react'
import { Transaction, CategorySpending } from '../types'
import { useAppStore } from '../store/appStore'
import { formatCurrency, getCategoryLabel, calculateMetrics } from '../utils/formatting'

interface InsightsSectionProps {
  transactions: Transaction[]
  categorySpending: CategorySpending[]
}

export const InsightsSection: React.FC<InsightsSectionProps> = ({
  transactions,
  categorySpending,
}) => {
  const darkMode = useAppStore((state) => state.darkMode)
  const metrics = calculateMetrics(transactions)
  const highestCategory = categorySpending[0]

  const currentMonthExpenses = transactions
    .filter((t) => {
      const now = new Date()
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const txDate = new Date(t.date)
      return t.type === 'expense' && txDate >= currentMonth
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const previousMonthExpenses = transactions
    .filter((t) => {
      const now = new Date()
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const txDate = new Date(t.date)
      return t.type === 'expense' && txDate >= previousMonth && txDate < currentMonth
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const monthlyTrend = previousMonthExpenses > 0
    ? ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
    : 0

  const insights = [
    {
      icon: PieChartIcon,
      label: 'Highest Spending Category',
      value: highestCategory ? getCategoryLabel(highestCategory.category) : 'N/A',
      detail: highestCategory ? formatCurrency(highestCategory.amount) : 'No data',
      color: 'text-blue-600',
    },
    {
      icon: TrendingDown,
      label: 'Monthly Comparison',
      value: `${Math.abs(monthlyTrend).toFixed(1)}%`,
      detail: monthlyTrend > 0 ? 'Higher than last month' : 'Lower than last month',
      color: monthlyTrend > 0 ? 'text-red-600' : 'text-emerald-600',
    },
    {
      icon: Target,
      label: 'Total Savings',
      value: formatCurrency(metrics.totalBalance),
      detail: `${metrics.savingsRate.toFixed(1)}% savings rate`,
      color: 'text-emerald-600',
    },
    {
      icon: TrendingUp,
      label: 'Average Transaction',
      value: formatCurrency(
        transactions.length > 0
          ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
          : 0
      ),
      detail: `${transactions.length} total transactions`,
      color: 'text-blue-600',
    },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h3 className={`text-lg font-semibold ${
          darkMode ? 'text-neutral-100' : 'text-neutral-900'
        }`}>
          Insights
        </h3>
        <p className={`text-sm mt-1 ${
          darkMode ? 'text-neutral-400' : 'text-neutral-500'
        }`}>
          Key metrics and observations about your finances
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`rounded-lg border p-5 hover:shadow-md transition-all duration-200 ${
              darkMode
                ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                : 'bg-white border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                darkMode ? 'bg-neutral-800' : 'bg-neutral-100'
              } ${insight.color}`}>
                <insight.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold uppercase tracking-wider ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  {insight.label}
                </p>
                <p className={`text-xl font-display font-semibold mt-1 tracking-tight ${
                  darkMode ? 'text-neutral-100' : 'text-neutral-900'
                }`}>
                  {insight.value}
                </p>
                <p className={`text-xs mt-2 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  {insight.detail}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
