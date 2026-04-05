import React, { useState, useMemo, useEffect } from 'react'
import { Header } from './components/Header'
import { SummaryCard } from './components/SummaryCard'
import { BalanceTrendChart } from './components/BalanceTrendChart'
import { CategorySpendingChart } from './components/CategorySpendingChart'
import { FilterControls } from './components/FilterControls'
import { TransactionsTable } from './components/TransactionsTable'
import { InsightsSection } from './components/InsightsSection'
import { TransactionModal } from './components/TransactionModal'
import { useAppStore } from './store/appStore'
import { useTransactionMutations } from './hooks/useTransactionMutations'
import {
  formatCurrency,
  calculateMetrics,
  calculateCategorySpending,
} from './utils/formatting'
import { balanceTrendData } from './data/mockData'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

export const App: React.FC = () => {
  const role = useAppStore((state) => state.role)
  const transactions = useAppStore((state) => state.transactions)
  const darkMode = useAppStore((state) => state.darkMode)
  const getFilteredTransactions = useAppStore(
    (state) => state.getFilteredTransactions
  )

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const { handleAddTransaction, handleDeleteTransaction } =
    useTransactionMutations()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)

  const filteredTransactions = getFilteredTransactions()
  const metrics = useMemo(
    () => calculateMetrics(transactions),
    [transactions]
  )
  const categorySpending = useMemo(
    () => calculateCategorySpending(filteredTransactions),
    [filteredTransactions]
  )

  const handleOpenModal = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const handleEditTransaction = (transaction: any) => {
    if (role === 'admin') {
      setEditingTransaction(transaction)
      setIsModalOpen(true)
    }
  }

  const handleModalSubmit = (data: any) => {
    if (editingTransaction) {
      // Update logic would go here
      // For now, we'll just add a new transaction
    } else {
      handleAddTransaction(
        data.description,
        data.category,
        data.amount,
        data.type
      )
    }
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  const handleDeleteClick = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      handleDeleteTransaction(id)
    }
  }

  return (
    <div className={`${darkMode ? 'dark' : ''} bg-neutral-50 dark:bg-neutral-950 min-h-screen transition-colors`}>
      <Header onAddTransaction={handleOpenModal} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Summary Cards */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <SummaryCard
                icon={<DollarSign className="w-5 h-5" />}
                title="Total Balance"
                value={formatCurrency(metrics.totalBalance)}
                subtitle="Current balance across all accounts"
                trend={{
                  value: metrics.savingsRate,
                  isPositive: metrics.totalBalance >= 0,
                }}
              />
              <SummaryCard
                icon={<TrendingUp className="w-5 h-5" />}
                title="Total Income"
                value={formatCurrency(metrics.totalIncome)}
                subtitle="All income sources combined"
                trend={{
                  value: 12.5,
                  isPositive: true,
                }}
              />
              <SummaryCard
                icon={<TrendingDown className="w-5 h-5" />}
                title="Total Expenses"
                value={formatCurrency(metrics.totalExpenses)}
                subtitle="All expenses combined"
                trend={{
                  value: Math.abs(metrics.monthlyChange),
                  isPositive: metrics.monthlyChange <= 0,
                }}
              />
            </div>
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <BalanceTrendChart data={balanceTrendData} />
            <CategorySpendingChart data={categorySpending} />
          </section>

          {/* Insights */}
          <section>
            <InsightsSection
              transactions={transactions}
              categorySpending={categorySpending}
            />
          </section>

          {/* Transactions Section */}
          <section>
            <div className="space-y-4">
              <div>
                <h2 className={`text-lg font-semibold ${
                  darkMode ? 'text-neutral-100' : 'text-neutral-900'
                }`}>
                  Transactions
                </h2>
                <p className={`text-sm mt-1 ${
                  darkMode ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  View and manage all your transactions
                </p>
              </div>

              <FilterControls />

              <TransactionsTable
                transactions={filteredTransactions}
                onDelete={role === 'admin' ? handleDeleteClick : undefined}
                onEdit={role === 'admin' ? handleEditTransaction : undefined}
              />
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-neutral-200 pt-8 pb-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500">
              <p>© 2024 Finance Dashboard. All data is simulated.</p>
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <span className="px-2 py-1 bg-neutral-100 rounded text-neutral-600 font-medium">
                  {role === 'admin' ? '👤 Admin Mode' : '👁️ Viewer Mode'}
                </span>
                <p>
                  {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} displayed
                </p>
              </div>
            </div>
          </footer>
        </div>
      </main>

      <TransactionModal
        isOpen={isModalOpen}
        transaction={editingTransaction}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTransaction(null)
        }}
        onSubmit={handleModalSubmit}
      />
    </div>
  )
}

export default App
