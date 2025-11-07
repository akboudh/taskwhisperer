'use client'

import { useState, useEffect } from 'react'
import PrioritySettings from './PrioritySettings'
import { PriorityWeights } from '@/types'

interface TaskInputProps {
  onAnalyze: (data: {
    tasks: string
    priorities: PriorityWeights
    timeAvailable?: number
  }) => void
  isLoading: boolean
  initialTasks?: string
}

const defaultPriorities: PriorityWeights = {
  work: 80,
  education: 70,
  health: 60,
  social: 40,
  personal: 50,
  entertainment: 20,
}

export default function TaskInput({ onAnalyze, isLoading, initialTasks = '' }: TaskInputProps) {
  const [tasks, setTasks] = useState(initialTasks)
  
  // Update tasks when initialTasks changes
  useEffect(() => {
    if (initialTasks) {
      setTasks(initialTasks)
    }
  }, [initialTasks])
  const [priorities, setPriorities] = useState<PriorityWeights>(defaultPriorities)
  const [timeAvailable, setTimeAvailable] = useState<string>('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tasks.trim()) {
      onAnalyze({
        tasks,
        priorities,
        timeAvailable: timeAvailable ? parseInt(timeAvailable) : undefined,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="tasks"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Enter your tasks (one per line or separated by commas)
        </label>
        <textarea
          id="tasks"
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
          placeholder="e.g., Finish the quarterly report, Check social media, Review project proposal, Watch YouTube videos, Call client..."
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
          rows={6}
          disabled={isLoading}
        />
      </div>

      {/* Advanced Settings Toggle */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>⚙️</span>
            <span>Advanced Settings (Priorities & Time)</span>
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-6 animate-in slide-in-from-top-2">
            <PrioritySettings
              priorities={priorities}
              onPrioritiesChange={setPriorities}
            />

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4">
              <label
                htmlFor="timeAvailable"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                ⏰ Time Available (Optional - in minutes)
              </label>
              <input
                id="timeAvailable"
                type="number"
                value={timeAvailable}
                onChange={(e) => setTimeAvailable(e.target.value)}
                placeholder="e.g., 120 (for 2 hours)"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Leave empty if you don't want time-based recommendations
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !tasks.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Analyzing...
          </span>
        ) : (
          '✨ Analyze Tasks'
        )}
      </button>
    </form>
  )
}

