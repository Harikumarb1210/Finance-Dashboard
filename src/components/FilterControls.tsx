import React, { useState, useEffect } from 'react'
import { Search, X, Filter } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { Category } from '../types'
import { getCategoryLabel } from '../utils/formatting'

const categories: Category[] = [
  'salary',
  'freelance',
  'food',
  'transport',
  'utilities',
  'entertainment',
  'shopping',
  'health',
  'other',
]

interface FilterControlsProps {
  onSearch?: () => void
}

export const FilterControls: React.FC<FilterControlsProps> = ({ onSearch }) => {
  const darkMode = useAppStore((state) => state.darkMode)
  const searchQuery = useAppStore((state) => state.filters.searchQuery)
  const selectedCategory = useAppStore((state) => state.filters.selectedCategory)
  const selectedType = useAppStore((state) => state.filters.selectedType)

  const setSearchQuery = useAppStore((state) => state.setSearchQuery)
  const setSelectedCategory = useAppStore((state) => state.setSelectedCategory)
  const setSelectedType = useAppStore((state) => state.setSelectedType)
  const resetFilters = useAppStore((state) => state.resetFilters)
  
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const hasActiveFilters = searchQuery || selectedCategory || selectedType

  return (
    <div className={`rounded-lg border p-4 transition-all duration-300 ${
      darkMode
        ? 'bg-neutral-900 border-neutral-800'
        : 'bg-white border-neutral-200'
    } ${isScrolled ? 'shadow-lg' : ''}`}>
      <div className="space-y-4">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            darkMode ? 'text-neutral-600' : 'text-neutral-400'
          }`} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              onSearch?.()
            }}
            className={`w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 transition-colors ${
              darkMode
                ? 'bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500 focus:border-blue-500 focus:ring-blue-500'
                : 'border-neutral-200 text-neutral-900 placeholder-neutral-400 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('')
                onSearch?.()
              }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                darkMode
                  ? 'text-neutral-500 hover:text-neutral-300'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-semibold mb-2 ${
              darkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Category
            </label>
            <select
              value={selectedCategory || ''}
              onChange={(e) => {
                setSelectedCategory((e.target.value as Category) || null)
                onSearch?.()
              }}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 transition-colors ${
                darkMode
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-100 focus:border-blue-500 focus:ring-blue-500'
                  : 'border-neutral-200 text-neutral-900 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-2 ${
              darkMode ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              Type
            </label>
            <select
              value={selectedType || ''}
              onChange={(e) => {
                const value = e.target.value as 'income' | 'expense' | ''
                setSelectedType(value === '' ? null : value)
                onSearch?.()
              }}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 transition-colors ${
                darkMode
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-100 focus:border-blue-500 focus:ring-blue-500'
                  : 'border-neutral-200 text-neutral-900 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t gap-3 ${
            darkMode ? 'border-neutral-800' : 'border-neutral-100'
          }`}>
            <div className="flex items-center gap-2">
              <Filter className={`w-4 h-4 ${
                darkMode ? 'text-neutral-500' : 'text-neutral-500'
              }`} />
              <span className={`text-xs font-medium ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                {hasActiveFilters ? 'Filters active' : 'No filters'}
              </span>
            </div>
            <button
              onClick={() => {
                resetFilters()
                onSearch?.()
              }}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
