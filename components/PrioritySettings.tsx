'use client'

import { PriorityWeights } from '@/types'

interface PrioritySettingsProps {
  priorities: PriorityWeights
  onPrioritiesChange: (priorities: PriorityWeights) => void
}

const priorityCategories = [
  { key: 'work' as keyof PriorityWeights, label: 'Work', icon: '💼', color: 'blue' },
  { key: 'education' as keyof PriorityWeights, label: 'Education', icon: '📚', color: 'green' },
  { key: 'health' as keyof PriorityWeights, label: 'Health', icon: '🏃', color: 'red' },
  { key: 'social' as keyof PriorityWeights, label: 'Social', icon: '👥', color: 'purple' },
  { key: 'personal' as keyof PriorityWeights, label: 'Personal', icon: '✨', color: 'yellow' },
  { key: 'entertainment' as keyof PriorityWeights, label: 'Entertainment', icon: '🎮', color: 'pink' },
]

export default function PrioritySettings({ priorities, onPrioritiesChange }: PrioritySettingsProps) {
  const handleSliderChange = (key: keyof PriorityWeights, value: number) => {
    onPrioritiesChange({
      ...priorities,
      [key]: value,
    })
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      red: 'from-red-500 to-red-600',
      purple: 'from-purple-500 to-purple-600',
      yellow: 'from-yellow-500 to-yellow-600',
      pink: 'from-pink-500 to-pink-600',
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Set Your Priorities
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Higher values = more important to you
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {priorityCategories.map((category) => (
          <div
            key={category.key}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {category.label}
                </span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                {priorities[category.key]}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={priorities[category.key]}
              onChange={(e) => handleSliderChange(category.key, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
              style={{
                background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${priorities[category.key]}%, rgb(229, 231, 235) ${priorities[category.key]}%, rgb(229, 231, 235) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

