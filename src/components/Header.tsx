import React from 'react'
import { Moon, Sun, Plus, LogOut } from 'lucide-react'
import { useAppStore } from '../store/appStore'

interface HeaderProps {
  onAddTransaction?: () => void
}

export const Header: React.FC<HeaderProps> = ({ onAddTransaction }) => {
  const role = useAppStore((state) => state.role)
  const darkMode = useAppStore((state) => state.darkMode)
  const setRole = useAppStore((state) => state.setRole)
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode)

  const handleRoleSwitch = () => {
    setRole(role === 'viewer' ? 'admin' : 'viewer')
  }

  const handleToggleDarkMode = () => {
    toggleDarkMode()
    if (!darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <header className={`${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'} border-b sticky top-0 z-40 transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className={`text-xl sm:text-2xl font-display font-bold tracking-tight ${
              darkMode ? 'text-neutral-100' : 'text-neutral-900'
            }`}>
              Finance Dashboard
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${
              darkMode ? 'text-neutral-400' : 'text-neutral-500'
            }`}>
              Track and analyze your financial activity
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {role === 'admin' && (
              <button
                onClick={onAddTransaction}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap flex-1 sm:flex-none justify-center sm:justify-start"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Add Transaction</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}

            <div className={`flex items-center gap-2 px-2 sm:px-3 py-2 border rounded-md ${
              darkMode
                ? 'border-neutral-700 bg-neutral-800'
                : 'border-neutral-200 bg-neutral-50'
            }`}>
              <span className={`text-xs font-medium hidden sm:inline ${
                darkMode ? 'text-neutral-400' : 'text-neutral-600'
              }`}>Role:</span>
              <button
                onClick={handleRoleSwitch}
                className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                  role === 'admin'
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                    : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
                }`}
              >
                {role === 'admin' ? 'Admin' : 'Viewer'}
              </button>
            </div>

            <button
              onClick={handleToggleDarkMode}
              className={`p-2 rounded-md transition-colors ${
                darkMode 
                  ? 'bg-neutral-800 text-yellow-400 hover:bg-neutral-700' 
                  : 'hover:bg-neutral-100 text-neutral-600'
              }`}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
