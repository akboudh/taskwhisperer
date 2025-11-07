'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface DonutChartProps {
  actualTasks: number
  distractions: number
  currentScore: number
  potentialScore: number
}

export default function DonutChart({
  actualTasks,
  distractions,
  currentScore,
  potentialScore,
}: DonutChartProps) {
  const data = [
    { name: 'Actual Tasks', value: actualTasks, color: '#10b981' },
    { name: 'Distractions', value: distractions, color: '#ef4444' },
  ]

  const total = actualTasks + distractions

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <div className="inline-block">
          <div className="text-5xl font-bold text-gray-900 dark:text-white mb-1">
            {currentScore}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Current Focus Score
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              `${value} ${value === 1 ? 'item' : 'items'}`,
              '',
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-gray-700 dark:text-gray-300">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      {total > 0 && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Total: {total} {total === 1 ? 'item' : 'items'}
        </div>
      )}
    </div>
  )
}

