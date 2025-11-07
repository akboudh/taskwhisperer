'use client'

import { PriorityWeights } from '@/types'

interface StatsModalProps {
  isOpen: boolean
  onClose: () => void
  priorityWeights?: PriorityWeights
}

export default function StatsModal({
  isOpen,
  onClose,
  priorityWeights,
}: StatsModalProps) {
  if (!isOpen) return null

  const priorityCategories = [
    { key: 'work' as keyof PriorityWeights, label: 'Work', icon: '💼' },
    { key: 'education' as keyof PriorityWeights, label: 'Education', icon: '📚' },
    { key: 'health' as keyof PriorityWeights, label: 'Health', icon: '🏃' },
    { key: 'social' as keyof PriorityWeights, label: 'Social', icon: '👥' },
    { key: 'personal' as keyof PriorityWeights, label: 'Personal', icon: '✨' },
    { key: 'entertainment' as keyof PriorityWeights, label: 'Entertainment', icon: '🎮' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            📊 Analysis Weights & Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {priorityWeights ? (
            <>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Your Priority Weights
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  These weights determine how tasks are categorized. Higher values mean
                  activities in that category are more likely to be considered "tasks"
                  rather than "distractions".
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {priorityCategories.map((category) => (
                    <div
                      key={category.key}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{category.icon}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {category.label}
                          </span>
                        </div>
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {priorityWeights[category.key]}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                          style={{ width: `${priorityWeights[category.key]}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  How It Works
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Tasks matching high-priority categories (70%+) are more likely to
                      be considered "actual tasks"
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Activities in low-priority categories (30% or less) are more
                      likely to be marked as "distractions"
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>
                      Medium priorities (40-60%) depend on context and task
                      characteristics
                    </span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                No priority weights were used in this analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

