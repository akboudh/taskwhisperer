'use client'

import { AnalysisResult } from '@/types'

interface QuickActionsProps {
  result: AnalysisResult
  onFocusMode: () => void
  onRemoveDistractions: () => void
  onExport: () => void
  onCopyTasks: () => void
}

export default function QuickActions({
  result,
  onFocusMode,
  onRemoveDistractions,
  onExport,
  onCopyTasks,
}: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={onFocusMode}
        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
      >
        <span>🎯</span>
        Focus on High Priority
      </button>
      {result.distractions > 0 && (
        <button
          onClick={onRemoveDistractions}
          className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
        >
          <span>🚫</span>
          Remove Distractions
        </button>
      )}
      <button
        onClick={onCopyTasks}
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
      >
        <span>📋</span>
        Copy Tasks
      </button>
      <button
        onClick={onExport}
        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
      >
        <span>💾</span>
        Export Results
      </button>
    </div>
  )
}

