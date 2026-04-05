import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Transaction, Category } from '../types'
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

interface TransactionModalProps {
  isOpen: boolean
  transaction?: Transaction
  onClose: () => void
  onSubmit: (data: {
    description: string
    category: Category
    amount: number
    type: 'income' | 'expense'
    date?: string
  }) => void
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  transaction,
  onClose,
  onSubmit,
}) => {
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<Category>('food')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [date, setDate] = useState('')

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description)
      setCategory(transaction.category)
      setAmount(transaction.amount.toString())
      setType(transaction.type)
      setDate(transaction.date)
    } else {
      resetForm()
    }
  }, [transaction, isOpen])

  const resetForm = () => {
    setDescription('')
    setCategory('food')
    setAmount('')
    setType('expense')
    setDate(new Date().toISOString().split('T')[0])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim() || !amount) {
      alert('Please fill in all required fields')
      return
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    onSubmit({
      description: description.trim(),
      category,
      amount: parsedAmount,
      type,
      date: date || new Date().toISOString().split('T')[0],
    })

    resetForm()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded transition-colors text-neutral-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Grocery shopping"
              className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Type
            </label>
            <div className="flex gap-3">
              {(['income', 'expense'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    type === t
                      ? t === 'income'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-amber-100 text-amber-700 border border-amber-300'
                      : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {t === 'income' ? 'Income' : 'Expense'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {getCategoryLabel(cat)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-7 pr-3 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-neutral-200 rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {transaction ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
