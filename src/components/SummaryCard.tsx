import React from 'react'
import { LucideIcon } from 'lucide-react'
import { useAppStore } from '../store/appStore'

interface SummaryCardProps {
  icon: React.ReactNode
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  className = '',
}) => {
  const darkMode = useAppStore((state) => state.darkMode)

  return (
    <div
      className={`rounded-lg p-4 sm:p-6 border transition-all duration-200 hover:shadow-md ${
        darkMode
          ? 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
          : 'bg-white border-neutral-200 hover:border-neutral-300'
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={darkMode ? 'text-neutral-500' : 'text-neutral-500'}>{icon}</span>
            <p className={`text-xs sm:text-sm font-medium ${
              darkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              {title}
            </p>
          </div>
          <p className={`text-lg sm:text-2xl font-display font-semibold tracking-tight ${
            darkMode ? 'text-neutral-100' : 'text-neutral-900'
          }`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs mt-2 ${
              darkMode ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              {subtitle}
            </p>
          )}
        </div>
        {trend && (
          <div
            className={`text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ml-2 ${
              trend.isPositive
                ? darkMode
                  ? 'bg-emerald-900 text-emerald-300'
                  : 'bg-emerald-50 text-emerald-700'
                : darkMode
                ? 'bg-red-900 text-red-300'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {trend.isPositive ? '+' : ''}{trend.value.toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  )
}
