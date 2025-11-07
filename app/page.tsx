'use client'

import { useState } from 'react'
import TaskInput from '@/components/TaskInput'
import AnalysisResults from '@/components/AnalysisResults'
import { AnalysisResult } from '@/types'

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async (tasks: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze tasks')
      }

      const data = await response.json()
      setAnalysisResult(data)
    } catch (error) {
      console.error('Error analyzing tasks:', error)
      alert('Failed to analyze tasks. Please check your API key and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Task Whisperer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Analyze your tasks and boost your focus score
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <TaskInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>

        {analysisResult && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <AnalysisResults result={analysisResult} />
          </div>
        )}
      </div>
    </main>
  )
}

