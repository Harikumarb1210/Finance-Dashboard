import { useAppStore } from '../store/appStore'
import { Transaction, Category } from '../types'

export const useTransactionMutations = () => {
  const addTransaction = useAppStore((state) => state.addTransaction)
  const deleteTransaction = useAppStore((state) => state.deleteTransaction)
  const updateTransaction = useAppStore((state) => state.updateTransaction)

  const handleAddTransaction = (
    description: string,
    category: Category,
    amount: number,
    type: 'income' | 'expense'
  ) => {
    if (!description.trim() || amount <= 0) return

    const newTransaction: Omit<Transaction, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      description: description.trim(),
      category,
      amount,
      type,
    }

    addTransaction(newTransaction)
  }

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id)
  }

  const handleUpdateTransaction = (
    id: string,
    updates: Partial<Omit<Transaction, 'id'>>
  ) => {
    updateTransaction(id, updates)
  }

  return {
    handleAddTransaction,
    handleDeleteTransaction,
    handleUpdateTransaction,
  }
}
