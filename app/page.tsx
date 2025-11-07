'use client'

import { useState } from 'react'
import TaskInput from '@/components/TaskInput'
import AnalysisResults from '@/components/AnalysisResults'
import { AnalysisResult } from '@/types'

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [taskInput, setTaskInput] = useState('')

  const handleAnalyze = async (inputData: {
    tasks: string
    priorities: any
    timeAvailable?: number
  }) => {
    setIsLoading(true)
    setTaskInput(inputData.tasks)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze tasks')
      }

      const result = await response.json()
      result.timestamp = new Date().toISOString()
      
      // Save to history
      if (typeof window !== 'undefined') {
        const history = JSON.parse(localStorage.getItem('taskHistory') || '[]')
        history.unshift({
          ...result,
          originalTasks: inputData.tasks,
        })
        // Keep only last 10 analyses
        const limitedHistory = history.slice(0, 10)
        localStorage.setItem('taskHistory', JSON.stringify(limitedHistory))
      }
      
      setAnalysisResult(result)
    } catch (error) {
      console.error('Error analyzing tasks:', error)
      alert('Failed to analyze tasks. Please check your API key and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFocusMode = (tasks: string[]) => {
    // Pre-fill input with high priority tasks
    const tasksText = tasks.join('\n')
    setTaskInput(tasksText)
    // Scroll to input
    document.getElementById('tasks')?.focus()
    // You could also trigger a new analysis here if desired
  }

  const handleRemoveDistractions = () => {
    // Filter out distractions from original input
    if (analysisResult) {
      const filteredTasks = taskInput
        .split('\n')
        .filter((task) => !analysisResult.distractionList.includes(task.trim()))
        .join('\n')
      setTaskInput(filteredTasks)
      document.getElementById('tasks')?.focus()
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🎯 Task Whisperer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Analyze your tasks and boost your focus score
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700">
          <TaskInput onAnalyze={handleAnalyze} isLoading={isLoading} initialTasks={taskInput} />
        </div>

        {analysisResult && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4">
            <AnalysisResults
              result={analysisResult}
              onFocusMode={handleFocusMode}
              onRemoveDistractions={handleRemoveDistractions}
            />
          </div>
        )}
      </div>
    </main>
  )
}

