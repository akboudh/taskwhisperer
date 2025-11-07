'use client'

import { TimeRecommendation } from '@/types'

interface TimeBlockingTimelineProps {
  recommendations: TimeRecommendation[]
  totalTime: number
}

export default function TimeBlockingTimeline({
  recommendations,
  totalTime,
}: TimeBlockingTimelineProps) {
  const sortedRecs = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2, unrealistic: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  const totalRecommended = recommendations.reduce(
    (sum, rec) => sum + rec.recommendedTime,
    0
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          ⏱️ Time Blocking Timeline
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold">{totalRecommended} min</span> /{' '}
          <span>{totalTime} min</span> allocated
        </div>
      </div>

      <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg p-4 min-h-[200px] overflow-hidden">
        <div className="relative" style={{ height: `${sortedRecs.length * 60}px` }}>
          {sortedRecs.map((rec, index) => {
            const percentage = rec.recommendedTime > 0 
              ? Math.max((rec.recommendedTime / totalTime) * 100, 3)
              : 0
            const cumulativeTime = sortedRecs
              .slice(0, index)
              .reduce((sum, r) => sum + r.recommendedTime, 0)
            const leftOffset = (cumulativeTime / totalTime) * 100

            return (
              <div 
                key={index} 
                className="absolute"
                style={{
                  top: `${index * 60}px`,
                  left: `${leftOffset}%`,
                  width: `${percentage}%`,
                  height: '50px',
                }}
              >
                {rec.recommendedTime > 0 ? (
                  <div
                    className="h-full rounded-lg flex items-center justify-between px-3 text-white text-xs font-medium shadow-lg transition-all hover:scale-[1.05] hover:z-10 cursor-pointer animate-slide-in border-2 border-white/20"
                    style={{
                      backgroundColor:
                        rec.priority === 'high'
                          ? '#10b981'
                          : rec.priority === 'medium'
                          ? '#f59e0b'
                          : rec.priority === 'low'
                          ? '#f97316'
                          : '#ef4444',
                      animationDelay: `${index * 0.1}s`,
                    }}
                    title={rec.reason}
                  >
                    <span className="truncate flex-1 font-semibold">{rec.task}</span>
                    <span className="ml-2 font-bold whitespace-nowrap text-sm">
                      {rec.recommendedTime}m
                    </span>
                  </div>
                ) : (
                  <div
                    className="h-full rounded-lg flex items-center justify-center px-2 text-gray-500 dark:text-gray-400 text-xs font-medium border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 opacity-60"
                    title={`${rec.task} - No time allocated (unrealistic or low priority)`}
                  >
                    <span className="truncate text-xs">{rec.task}</span>
                    <span className="ml-1 text-xs">(0m)</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {/* Time scale */}
        <div className="mt-4 flex justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600 pt-2">
          <span>0 min</span>
          <span>{Math.round(totalTime / 2)} min</span>
          <span>{totalTime} min</span>
        </div>
      </div>

      {totalRecommended > totalTime && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-300">
            ⚠️ Total recommended time ({totalRecommended} min) exceeds available time (
            {totalTime} min). Consider removing some tasks or reducing time allocations.
          </p>
        </div>
      )}
    </div>
  )
}

