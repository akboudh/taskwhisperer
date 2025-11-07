'use client'

import { useState } from 'react'

interface TaskInputProps {
  onAnalyze: (tasks: string) => void
  isLoading: boolean
}

export default function TaskInput({ onAnalyze, isLoading }: TaskInputProps) {
  const [tasks, setTasks] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tasks.trim()) {
      onAnalyze(tasks)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <button
        type="submit"
        disabled={isLoading || !tasks.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
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
          'Analyze Tasks'
        )}
      </button>
    </form>
  )
}

