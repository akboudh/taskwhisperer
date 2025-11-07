'use client'

import { AnalysisResult } from '@/types'
import DonutChart from './DonutChart'

interface AnalysisResultsProps {
  result: AnalysisResult
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const scoreImprovement = result.potentialFocusScore - result.currentFocusScore

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Focus Analysis
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what we found in your task list
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Donut Chart */}
        <div className="flex flex-col items-center justify-center">
          <DonutChart
            actualTasks={result.actualTasks}
            distractions={result.distractions}
            currentScore={result.currentFocusScore}
            potentialScore={result.potentialFocusScore}
          />
        </div>

        {/* Stats and Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Actual Tasks:
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {result.actualTasks}
                </span>
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
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Current Focus Score:
                  </span>
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {result.currentFocusScore}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Potential Focus Score:
                  </span>
                  <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {result.potentialFocusScore}%
                  </span>
                </div>
                {scoreImprovement > 0 && (
                  <div className="mt-3 p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      🎯 Dropping distractions could improve your score by{' '}
                      <span className="font-bold">{scoreImprovement}%</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Lists */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-4">
            ✅ Actual Tasks ({result.actualTasks})
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

        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-4">
            ⚠️ Distractions ({result.distractions})
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

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
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
    </div>
  )
}

