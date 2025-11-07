export interface PriorityWeights {
  work: number
  education: number
  health: number
  social: number
  personal: number
  entertainment: number
}

export interface TimeRecommendation {
  task: string
  recommendedTime: number // in minutes
  priority: 'high' | 'medium' | 'low' | 'unrealistic'
  reason: string
  isDistraction?: boolean
}

export interface TaskCategory {
  category: string
  tasks: string[]
  count: number
}

export interface AnalysisResult {
  actualTasks: number
  distractions: number
  currentFocusScore: number
  potentialFocusScore: number
  taskList: string[]
  distractionList: string[]
  recommendations: string[]
  timeRecommendations?: TimeRecommendation[]
  priorityWeights?: PriorityWeights
  totalTimeAvailable?: number
  taskCategories?: TaskCategory[]
  timestamp?: string
}

