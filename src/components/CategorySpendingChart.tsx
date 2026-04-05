import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { CategorySpending } from '../types'
import { useAppStore } from '../store/appStore'
import { formatCurrency, getCategoryLabel } from '../utils/formatting'

interface CategorySpendingChartProps {
  data: CategorySpending[]
}

const COLORS = [
  '#0066ff',
  '#f59e0b',
  '#10b981',
  '#8b5cf6',
  '#ec4899',
  '#ef4444',
  '#6366f1',
  '#14b8a6',
  '#a3a3a3',
]

const CustomTooltip: React.FC<any> = ({ active, payload, darkMode }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CategorySpending
    return (
      <div className={`px-3 py-2 rounded-lg shadow-md border ${
        darkMode
          ? 'bg-neutral-800 border-neutral-700'
          : 'bg-white border-neutral-200'
      }`}>
        <p className={`text-xs font-medium ${
          darkMode ? 'text-neutral-300' : 'text-neutral-700'
        }`}>
          {getCategoryLabel(data.category)}
        </p>
        <p className={`text-sm font-semibold ${
          darkMode ? 'text-neutral-100' : 'text-neutral-900'
        }`}>
          {formatCurrency(data.amount)}
        </p>
        <p className={`text-xs ${
          darkMode ? 'text-neutral-400' : 'text-neutral-500'
        }`}>
          {data.percentage.toFixed(1)}%
        </p>
      </div>
    )
  }
  return null
}

const CustomLegend: React.FC<any> = (props) => {
  const { payload } = props
  const darkMode = useAppStore((state) => state.darkMode)
  
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className={`text-xs ${
            darkMode ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            {getCategoryLabel(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

export const CategorySpendingChart: React.FC<CategorySpendingChartProps> = ({
  data,
}) => {
  const darkMode = useAppStore((state) => state.darkMode)
  
  const chartData = data.map((item) => ({
    ...item,
    name: getCategoryLabel(item.category),
    value: item.amount,
  }))

  return (
    <div className={`rounded-lg border p-6 ${
      darkMode
        ? 'bg-neutral-900 border-neutral-800'
        : 'bg-white border-neutral-200'
    }`}>
      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${
          darkMode ? 'text-neutral-100' : 'text-neutral-900'
        }`}>
          Spending by Category
        </h3>
        <p className={`text-sm mt-1 ${
          darkMode ? 'text-neutral-400' : 'text-neutral-500'
        }`}>
          Distribution of your expenses
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={true}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} cursor={false} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
