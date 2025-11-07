'use client'

import { useState } from 'react'
import { AnalysisResult } from '@/types'
import DonutChart from './DonutChart'
import StatsModal from './StatsModal'
import QuickActions from './QuickActions'
import TimeBlockingTimeline from './TimeBlockingTimeline'
import CategoryBreakdown from './CategoryBreakdown'

interface AnalysisResultsProps {
  result: AnalysisResult
  onFocusMode?: (tasks: string[]) => void
  onRemoveDistractions?: () => void
}

export default function AnalysisResults({
  result,
  onFocusMode,
  onRemoveDistractions,
}: AnalysisResultsProps) {
  const [showStats, setShowStats] = useState(false)
  const [copied, setCopied] = useState(false)
  const scoreImprovement = result.potentialFocusScore - result.currentFocusScore

  const handleExport = () => {
    const dataStr = JSON.stringify(result, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `task-whisperer-analysis-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyTasks = async () => {
    const tasksText = result.taskList.join('\n')
    try {
      await navigator.clipboard.writeText(tasksText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleFocusMode = () => {
    if (result.timeRecommendations) {
      const highPriorityTasks = result.timeRecommendations
        .filter((rec) => rec.priority === 'high')
        .map((rec) => rec.task)
      if (onFocusMode) {
        onFocusMode(highPriorityTasks)
      }
    } else if (onFocusMode) {
      onFocusMode(result.taskList)
    }
  }

  const handleRemoveDistractions = () => {
    if (onRemoveDistractions) {
      onRemoveDistractions()
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700'
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
      case 'low':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700'
      case 'unrealistic':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-8 animate-in">
      <div className="text-center animate-fade-in">
        <div className="flex items-center justify-center gap-4 mb-2 flex-wrap">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-scale-in">
            Your Focus Analysis
          </h2>
          {result.priorityWeights && (
            <button
              onClick={() => setShowStats(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg text-sm font-medium"
            >
              📊 View Stats
            </button>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Here's what we found in your task list
        </p>
        <QuickActions
          result={result}
          onFocusMode={handleFocusMode}
          onRemoveDistractions={handleRemoveDistractions}
          onExport={handleExport}
          onCopyTasks={handleCopyTasks}
        />
        {copied && (
          <div className="mt-2 text-sm text-green-600 dark:text-green-400">
            ✓ Copied to clipboard!
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Donut Chart */}
        <div className="flex flex-col items-center justify-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <DonutChart
            actualTasks={result.actualTasks}
            distractions={result.distractions}
            currentScore={result.currentFocusScore}
            potentialScore={result.potentialFocusScore}
            timeRecommendations={result.timeRecommendations}
          />
        </div>

        {/* Stats and Info */}
        <div className="space-y-6 animate-slide-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Actual Tasks:
                </span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {result.actualTasks}
                  </span>
                  {result.timeRecommendations && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {result.timeRecommendations.filter(
                        (rec) => rec.priority !== 'unrealistic'
                      ).length}{' '}
                      doable
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Distractions:
                </span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {result.distractions}
                </span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-500 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium block">
                      Current Focus Score:
                    </span>
                    {result.timeRecommendations && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Without guidance (trying to do everything)
                      </span>
                    )}
                  </div>
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {result.currentFocusScore}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium block">
                      Potential Focus Score:
                    </span>
                    {result.timeRecommendations && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        With Task Whisperer's guidance
                      </span>
                    )}
                  </div>
                  <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {result.potentialFocusScore}%
                  </span>
                </div>
                {scoreImprovement > 0 && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                      🎯 Following Task Whisperer's recommendations could improve your score by{' '}
                      <span className="font-bold text-lg">{scoreImprovement}%</span>
                    </p>
                    {result.timeRecommendations && (
                      <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                        By dropping unrealistic tasks, removing distractions, and focusing on priorities
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Lists */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
            <span className="text-2xl animate-bounce">✅</span>
            Actual Tasks ({result.actualTasks})
          </h3>
          <ul className="space-y-2">
            {result.taskList.length > 0 ? (
              result.taskList.map((task, index) => (
                <li
                  key={index}
                  className="text-gray-700 dark:text-gray-300 flex items-start"
                >
                  <span className="mr-2">•</span>
                  <span>{task}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 dark:text-gray-400 italic">
                No actual tasks identified
              </li>
            )}
          </ul>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
            <span className="text-2xl animate-pulse">⚠️</span>
            Distractions ({result.distractions})
          </h3>
          <ul className="space-y-2">
            {result.distractionList.length > 0 ? (
              result.distractionList.map((distraction, index) => (
                <li
                  key={index}
                  className="text-gray-700 dark:text-gray-300 flex items-start"
                >
                  <span className="mr-2">•</span>
                  <span>{distraction}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 dark:text-gray-400 italic">
                No distractions identified
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Category Breakdown */}
      {result.taskCategories && result.taskCategories.length > 0 && (
        <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-xl p-6">
          <CategoryBreakdown
            categories={result.taskCategories}
            taskList={result.taskList}
          />
        </div>
      )}

      {/* Time Recommendations */}
      {result.timeRecommendations && result.timeRecommendations.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300">
              ⏰ Time Allocation Recommendations
            </h3>
            {result.totalTimeAvailable && (
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                Total: {result.totalTimeAvailable} min
              </span>
            )}
          </div>
          {result.totalTimeAvailable && (
            <div className="mb-6">
              <TimeBlockingTimeline
                recommendations={result.timeRecommendations}
                totalTime={result.totalTimeAvailable}
              />
            </div>
          )}
          <div className="space-y-3">
            {result.timeRecommendations.map((rec, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 ${getPriorityColor(rec.priority)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{rec.task}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.priority === 'high'
                            ? 'bg-green-200 dark:bg-green-800'
                            : rec.priority === 'medium'
                            ? 'bg-yellow-200 dark:bg-yellow-800'
                            : rec.priority === 'low'
                            ? 'bg-orange-200 dark:bg-orange-800'
                            : 'bg-red-200 dark:bg-red-800'
                        }`}
                      >
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm opacity-90">{rec.reason}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-2xl font-bold">{rec.recommendedTime}</div>
                    <div className="text-xs opacity-75">minutes</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-4">
            💡 Recommendations
          </h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <li
                key={index}
                className="text-gray-700 dark:text-gray-300 flex items-start"
              >
                <span className="mr-2">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        priorityWeights={result.priorityWeights}
      />
    </div>
  )
}

