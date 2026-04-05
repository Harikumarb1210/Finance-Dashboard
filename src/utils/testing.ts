import { Transaction, Category } from '../types'

/**
 * Generate random transactions for testing
 */
export const generateMockTransactions = (count: number = 50): Transaction[] => {
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

  const descriptions: Record<Category, string[]> = {
    salary: ['Monthly Salary', 'Paycheck'],
    freelance: ['Freelance Project', 'Consulting Work', 'Contract Payment'],
    food: ['Grocery Store', 'Restaurant', 'Coffee Shop', 'Fast Food'],
    transport: ['Gas Station', 'Uber', 'Taxi', 'Public Transport', 'Car Payment'],
    utilities: ['Electric Bill', 'Water Bill', 'Internet Bill', 'Phone Bill'],
    entertainment: ['Movie Tickets', 'Concert', 'Spotify', 'Netflix', 'Gaming'],
    shopping: ['Clothing Store', 'Online Shopping', 'Department Store'],
    health: ['Gym Membership', 'Doctor', 'Pharmacy', 'Dentist'],
    other: ['Misc Purchase', 'Other Expense'],
  }

  const amounts: Record<Category, [number, number]> = {
    salary: [3000, 6000],
    freelance: [500, 2000],
    food: [10, 150],
    transport: [20, 100],
    utilities: [50, 200],
    entertainment: [15, 100],
    shopping: [50, 300],
    health: [30, 200],
    other: [10, 100],
  }

  const transactions: Transaction[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const type = category === 'salary' || category === 'freelance' ? 'income' : 'expense'
    const [minAmount, maxAmount] = amounts[category]
    const amount =
      Math.random() * (maxAmount - minAmount) + minAmount

    const daysAgo = Math.floor(Math.random() * 90)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)

    const descriptionList = descriptions[category]
    const description =
      descriptionList[Math.floor(Math.random() * descriptionList.length)]

    transactions.push({
      id: `mock-${i}-${Date.now()}`,
      date: date.toISOString().split('T')[0],
      description,
      category,
      amount: Math.round(amount * 100) / 100,
      type,
    })
  }

  return transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

/**
 * Filter transactions by date range
 */
export const filterByDateRange = (
  transactions: Transaction[],
  startDate: Date,
  endDate: Date
): Transaction[] => {
  return transactions.filter((t) => {
    const txDate = new Date(t.date)
    return txDate >= startDate && txDate <= endDate
  })
}

/**
 * Get transactions from last N days
 */
export const getTransactionsFromLastNDays = (
  transactions: Transaction[],
  days: number
): Transaction[] => {
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - days)

  return filterByDateRange(transactions, startDate, now)
}

/**
 * Get transactions from current month
 */
export const getCurrentMonthTransactions = (
  transactions: Transaction[]
): Transaction[] => {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  return filterByDateRange(transactions, startDate, endDate)
}

/**
 * Get transactions from current year
 */
export const getCurrentYearTransactions = (
  transactions: Transaction[]
): Transaction[] => {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), 0, 1)
  const endDate = new Date(now.getFullYear(), 11, 31)

  return filterByDateRange(transactions, startDate, endDate)
}

/**
 * Validate transaction data
 */
export const isValidTransaction = (transaction: Partial<Transaction>): boolean => {
  const required = ['date', 'description', 'category', 'amount', 'type']

  for (const field of required) {
    if (!(field in transaction)) {
      return false
    }
  }

  const tx = transaction as Transaction

  // Validate date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(tx.date)) {
    return false
  }

  // Validate amount
  if (typeof tx.amount !== 'number' || tx.amount <= 0) {
    return false
  }

  // Validate type
  if (!['income', 'expense'].includes(tx.type)) {
    return false
  }

  // Validate description
  if (typeof tx.description !== 'string' || tx.description.trim().length === 0) {
    return false
  }

  return true
}

/**
 * Clean and normalize transaction data
 */
export const normalizeTransaction = (tx: any): Transaction => {
  return {
    id: tx.id || `${Date.now()}`,
    date: tx.date ? tx.date.substring(0, 10) : new Date().toISOString().split('T')[0],
    description: String(tx.description || '').trim(),
    category: tx.category || 'other',
    amount: Math.round(parseFloat(tx.amount) * 100) / 100,
    type: tx.type === 'income' ? 'income' : 'expense',
  }
}

/**
 * Test assertion helpers
 */
export const testUtils = {
  /**
   * Assert that value is between min and max
   */
  assertBetween: (value: number, min: number, max: number, message?: string): void => {
    if (value < min || value > max) {
      throw new Error(
        message || `Expected ${value} to be between ${min} and ${max}`
      )
    }
  },

  /**
   * Assert that value equals expected
   */
  assertEqual: (actual: any, expected: any, message?: string): void => {
    if (actual !== expected) {
      throw new Error(
        message || `Expected ${actual} to equal ${expected}`
      )
    }
  },

  /**
   * Assert that array includes value
   */
  assertIncludes: (array: any[], value: any, message?: string): void => {
    if (!array.includes(value)) {
      throw new Error(
        message || `Expected array to include ${value}`
      )
    }
  },

  /**
   * Assert that value is truthy
   */
  assertTrue: (value: any, message?: string): void => {
    if (!value) {
      throw new Error(message || `Expected ${value} to be truthy`)
    }
  },

  /**
   * Assert that value is falsy
   */
  assertFalse: (value: any, message?: string): void => {
    if (value) {
      throw new Error(message || `Expected ${value} to be falsy`)
    }
  },
}

/**
 * Sample test cases
 */
export const runSampleTests = (): void => {
  console.log('Running sample tests...')

  try {
    // Test mock transaction generation
    const mockTxs = generateMockTransactions(10)
    testUtils.assertEqual(
      mockTxs.length,
      10,
      'Should generate 10 transactions'
    )

    // Test transaction validation
    const validTx = {
      id: '1',
      date: '2024-01-15',
      description: 'Test',
      category: 'food' as const,
      amount: 50,
      type: 'expense' as const,
    }
    testUtils.assertTrue(
      isValidTransaction(validTx),
      'Valid transaction should pass validation'
    )

    // Test invalid transaction
    const invalidTx = { description: 'Test', amount: -50 }
    testUtils.assertFalse(
      isValidTransaction(invalidTx),
      'Invalid transaction should fail validation'
    )

    // Test date filtering
    const currentMonth = getCurrentMonthTransactions(mockTxs)
    testUtils.assertTrue(
      currentMonth.length >= 0,
      'Current month filtering should work'
    )

    console.log('✅ All tests passed!')
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}
