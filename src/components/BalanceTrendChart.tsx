import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { BalanceTrend } from '../types'
import { useAppStore } from '../store/appStore'
import { formatCurrency, formatShortDate } from '../utils/formatting'

interface BalanceTrendChartProps {
  data: BalanceTrend[]
}

const CustomTooltip: React.FC<any> = ({ active, payload, darkMode }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className={`px-3 py-2 rounded-lg shadow-md border ${
        darkMode 
          ? 'bg-neutral-800 border-neutral-700' 
          : 'bg-white border-neutral-200'
      }`}>
        <p className={`text-xs font-medium ${
          darkMode ? 'text-neutral-300' : 'text-neutral-700'
        }`}>
          {formatShortDate(data.date)}
        </p>
        <p className={`text-sm font-semibold ${
          darkMode ? 'text-neutral-100' : 'text-neutral-900'
        }`}>
          {formatCurrency(data.balance)}
        </p>
      </div>
    )
  }
  return null
}

export const BalanceTrendChart: React.FC<BalanceTrendChartProps> = ({ data }) => {
  const darkMode = useAppStore((state) => state.darkMode)
  const gridColor = darkMode ? '#404040' : '#f0f0f0'
  const textColor = darkMode ? '#a3a3a3' : '#a3a3a3'

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
          Balance Trend
        </h3>
        <p className={`text-sm mt-1 ${
          darkMode ? 'text-neutral-400' : 'text-neutral-500'
        }`}>
          Your balance over the last 45 days
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => formatShortDate(date)}
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            tick={{ fill: textColor, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} cursor={false} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#0066ff"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
