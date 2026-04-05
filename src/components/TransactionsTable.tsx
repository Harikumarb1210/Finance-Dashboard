import React, { useMemo, useState } from 'react'
import { ChevronUp, ChevronDown, Trash2, Edit2 } from 'lucide-react'
import { Transaction } from '../types'
import { formatCurrency, formatDate, getCategoryLabel } from '../utils/formatting'
import { useAppStore } from '../store/appStore'

interface TransactionsTableProps {
  transactions: Transaction[]
  onDelete?: (id: string) => void
  onEdit?: (transaction: Transaction) => void
}

type SortKey = 'date' | 'amount'
type SortOrder = 'asc' | 'desc'

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onDelete,
  onEdit,
}) => {
  const role = useAppStore((state) => state.role)
  const darkMode = useAppStore((state) => state.darkMode)
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const sortedTransactions = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      let aVal: any = a[sortKey]
      let bVal: any = b[sortKey]

      if (sortKey === 'date') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return sorted
  }, [transactions, sortKey, sortOrder])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const SortIcon: React.FC<{ active: boolean }> = ({ active }) => {
    if (!active) return <span className={darkMode ? 'text-neutral-600' : 'text-neutral-300'}>⇅</span>
    return sortOrder === 'desc' ? (
      <ChevronDown className="w-4 h-4" />
    ) : (
      <ChevronUp className="w-4 h-4" />
    )
  }

  if (transactions.length === 0) {
    return (
      <div className={`rounded-lg border p-12 ${
        darkMode
          ? 'bg-neutral-900 border-neutral-800'
          : 'bg-white border-neutral-200'
      }`}>
        <div className="text-center">
          <p className={`text-sm ${
            darkMode ? 'text-neutral-400' : 'text-neutral-500'
          }`}>
            No transactions found
          </p>
          <p className={`text-xs mt-1 ${
            darkMode ? 'text-neutral-500' : 'text-neutral-400'
          }`}>
            Try adjusting your filters or adding a new transaction
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border overflow-hidden ${
      darkMode
        ? 'bg-neutral-900 border-neutral-800'
        : 'bg-white border-neutral-200'
    }`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b ${
              darkMode
                ? 'border-neutral-800 bg-neutral-800'
                : 'border-neutral-200 bg-neutral-50'
            }`}>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('date')}
                  className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                    darkMode
                      ? 'text-neutral-400 hover:text-neutral-200'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Date <SortIcon active={sortKey === 'date'} />
                </button>
              </th>
              <th className={`px-6 py-3 text-left text-xs font-semibold ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Description
              </th>
              <th className={`px-6 py-3 text-left text-xs font-semibold ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Category
              </th>
              <th className="px-6 py-3 text-right">
                <button
                  onClick={() => handleSort('amount')}
                  className={`flex items-center justify-end gap-2 text-xs font-semibold transition-colors ml-auto ${
                    darkMode
                      ? 'text-neutral-400 hover:text-neutral-200'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Amount <SortIcon active={sortKey === 'amount'} />
                </button>
              </th>
              <th className={`px-6 py-3 text-left text-xs font-semibold ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Type
              </th>
              {role === 'admin' && (
                <th className={`px-6 py-3 text-center text-xs font-semibold ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={`border-b transition-colors ${
                  darkMode
                    ? 'border-neutral-800 hover:bg-neutral-800'
                    : 'border-neutral-100 hover:bg-neutral-50'
                }`}
              >
                <td className={`px-6 py-4 text-sm font-medium ${
                  darkMode ? 'text-neutral-100' : 'text-neutral-900'
                }`}>
                  {formatDate(transaction.date)}
                </td>
                <td className={`px-6 py-4 text-sm ${
                  darkMode ? 'text-neutral-300' : 'text-neutral-700'
                }`}>
                  {transaction.description}
                </td>
                <td className={`px-6 py-4 text-sm ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-600'
                }`}>
                  {getCategoryLabel(transaction.category)}
                </td>
                <td
                  className={`px-6 py-4 text-sm font-semibold text-right ${
                    transaction.type === 'income'
                      ? 'text-emerald-500'
                      : darkMode ? 'text-neutral-100' : 'text-neutral-900'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      transaction.type === 'income'
                        ? darkMode
                          ? 'bg-emerald-900 text-emerald-300'
                          : 'bg-emerald-50 text-emerald-700'
                        : darkMode
                        ? 'bg-amber-900 text-amber-300'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                  </span>
                </td>
                {role === 'admin' && (
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit?.(transaction)}
                        className={`p-1.5 rounded transition-colors ${
                          darkMode
                            ? 'text-blue-400 hover:bg-blue-900'
                            : 'text-blue-600 hover:bg-blue-100'
                        }`}
                        title="Edit transaction"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete?.(transaction.id)}
                        className={`p-1.5 rounded transition-colors ${
                          darkMode
                            ? 'text-red-400 hover:bg-red-900'
                            : 'text-red-600 hover:bg-red-100'
                        }`}
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
