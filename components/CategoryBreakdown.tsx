'use client'

import { TaskCategory } from '@/types'

interface CategoryBreakdownProps {
  categories?: TaskCategory[]
  taskList: string[]
}

export default function CategoryBreakdown({
  categories,
  taskList,
}: CategoryBreakdownProps) {
  if (!categories || categories.length === 0) {
    // Fallback: show simple list if no categories
    return null
  }

  const categoryColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-yellow-500 to-amber-500',
    'from-indigo-500 to-blue-500',
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        📂 Tasks by Category
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {category.category}
              </h4>
              <span className="px-3 py-1 bg-gradient-to-r bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 font-bold">
                {category.count}
              </span>
            </div>
            <ul className="space-y-1">
              {category.tasks.slice(0, 5).map((task, taskIndex) => (
                <li
                  key={taskIndex}
                  className="text-sm text-gray-700 dark:text-gray-300 flex items-start"
                >
                  <span className="mr-2">•</span>
                  <span className="truncate">{task}</span>
                </li>
              ))}
              {category.tasks.length > 5 && (
                <li className="text-xs text-gray-500 dark:text-gray-400 italic">
                  +{category.tasks.length - 5} more
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

