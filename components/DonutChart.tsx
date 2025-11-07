'use client'

import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { TimeRecommendation } from '@/types'

interface DonutChartProps {
  actualTasks: number
  distractions: number
  currentScore: number
  potentialScore: number
  timeRecommendations?: TimeRecommendation[]
}

export default function DonutChart({
  actualTasks,
  distractions,
  currentScore,
  potentialScore,
  timeRecommendations,
}: DonutChartProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  // Animate score on mount
  useEffect(() => {
    setIsAnimating(true)
    const duration = 1500
    const steps = 60
    const increment = currentScore / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= currentScore) {
        setAnimatedScore(currentScore)
        setIsAnimating(false)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.round(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [currentScore])

  // Build data based on priority if time recommendations exist
  let data: any[] = []
  if (timeRecommendations && timeRecommendations.length > 0) {
    const taskRecs = timeRecommendations.filter((rec) => !rec.isDistraction)
    const highPriority = taskRecs.filter((rec) => rec.priority === 'high').length
    const mediumPriority = taskRecs.filter((rec) => rec.priority === 'medium').length
    const lowPriority = taskRecs.filter((rec) => rec.priority === 'low').length
    const distractionsCount = distractions

    data = [
      { name: 'High Priority', value: highPriority, color: '#10b981' },
      { name: 'Medium Priority', value: mediumPriority, color: '#f59e0b' },
      { name: 'Low Priority', value: lowPriority, color: '#f97316' },
      { name: 'Distractions', value: distractionsCount, color: '#ef4444' },
    ].filter((item) => item.value > 0)
  } else {
    // Fallback to simple tasks vs distractions
    data = [
      { name: 'Actual Tasks', value: actualTasks, color: '#10b981' },
      { name: 'Distractions', value: distractions, color: '#ef4444' },
    ].filter((item) => item.value > 0)
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-bold drop-shadow-lg"
        style={{ animation: 'fadeIn 0.5s ease-in' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <div className="inline-block relative">
          <div
            className={`text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 transition-all duration-1000 ${
              isAnimating ? 'scale-110' : 'scale-100'
            }`}
            style={{
              animation: isAnimating ? 'pulse 1.5s ease-in-out infinite' : 'none',
            }}
          >
            {animatedScore}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Current Focus Score
          </div>
          {potentialScore > currentScore && (
            <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 animate-pulse">
              Potential: {potentialScore}% if distractions removed
            </div>
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <defs>
            {data.map((entry, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`gradient-${index}`}
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor={entry.color}
                  stopOpacity={0.7}
                />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={120}
            innerRadius={70}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#gradient-${index})`}
                style={{
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e: any) => {
                  e.target.style.opacity = 0.8
                  e.target.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e: any) => {
                  e.target.style.opacity = 1
                  e.target.style.transform = 'scale(1)'
                }}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value} ${value === 1 ? 'item' : 'items'}`,
              name,
            ]}
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={50}
            formatter={(value) => (
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {value}
              </span>
            )}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
      {total > 0 && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
          Total: {total} {total === 1 ? 'item' : 'items'}
        </div>
      )}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
