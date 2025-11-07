import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { tasks, priorities, timeAvailable } = await request.json()

    if (!tasks || typeof tasks !== 'string') {
      return NextResponse.json(
        { error: 'Tasks are required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    // Build priority context
    const priorityContext = priorities
      ? `User Priority Weights (0-100, higher = more important):
- Work: ${priorities.work}%
- Education: ${priorities.education}%
- Health: ${priorities.health}%
- Social: ${priorities.social}%
- Personal: ${priorities.personal}%
- Entertainment: ${priorities.entertainment}%

Use these priorities to determine if an activity is a task or distraction. For example, if "social" has high priority (80+), then social activities might be considered tasks rather than distractions.`
      : ''

    const timeContext = timeAvailable
      ? `\n\nUser has ${timeAvailable} minutes available. Provide time recommendations for each task.`
      : ''

    const prompt = `Analyze the following list of tasks and activities. Categorize them into:
1. Actual tasks (productive, goal-oriented work that aligns with user priorities)
2. Distractions (non-essential activities, time-wasters that don't align with user priorities)

${priorityContext}

Tasks to analyze:
${tasks}${timeContext}

Please respond with a JSON object in this exact format:
{
  "actualTasks": <number>,
  "distractions": <number>,
  "taskList": [<array of actual task strings>],
  "distractionList": [<array of distraction strings>],
  "recommendations": [<array of 2-3 recommendation strings>],
  "taskCategories": [<array of objects: {"category": "<Work|Education|Health|Social|Personal|Entertainment>", "tasks": [<array of task strings in this category>], "count": <number>}>]${timeAvailable ? ',\n  "timeRecommendations": [<array of objects with: {"task": "<task or distraction name>", "recommendedTime": <minutes>, "priority": "high"|"medium"|"low"|"unrealistic", "reason": "<brief explanation>", "isDistraction": <true|false>}>]' : ''}
}

Important: Consider user priorities when categorizing. If user values "social" highly, social activities may be tasks. If they value "entertainment" lowly, entertainment is likely a distraction.

${timeAvailable ? `Time Allocation Rules:
- High priority: Important tasks that should be prioritized (allocate more time)
- Medium priority: Tasks that can be done but with moderate time
- Low priority: Tasks that should get less time or can be deferred
- Unrealistic: Tasks that cannot be completed in the available ${timeAvailable} minutes

IMPORTANT: Distribute the ${timeAvailable} minutes across ALL items (both actual tasks AND distractions).
- If there's enough time, give distractions some time too (even if minimal)
- If there's not enough time, mark some tasks/distractions as unrealistic (0 minutes)
- Total allocated time should not exceed ${timeAvailable} minutes
- Be realistic about time needed for each item` : ''}

Only return the JSON object, no additional text.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using gpt-4o-mini for cost efficiency, can be changed to 'gpt-4' for better analysis
      messages: [
        {
          role: 'system',
          content:
            'You are a productivity analyst. Analyze tasks and categorize them accurately. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const analysis = JSON.parse(content)

    // Calculate focus scores based on realistic task completion
    const total = analysis.actualTasks + analysis.distractions
    let currentFocusScore = 0
    let potentialFocusScore = 0

    if (timeAvailable && analysis.timeRecommendations) {
      const totalTasks = analysis.actualTasks
      
      // Separate tasks and distractions from time recommendations
      const taskRecommendations = analysis.timeRecommendations.filter(
        (rec: any) => !rec.isDistraction
      )
      const distractionRecommendations = analysis.timeRecommendations.filter(
        (rec: any) => rec.isDistraction
      )
      
      // Calculate time needed for all tasks (including unrealistic ones)
      const totalTimeNeededForAllTasks = taskRecommendations.reduce(
        (sum: number, rec: any) => sum + (rec.recommendedTime || 0), 0
      )
      
      // Count tasks by priority
      const doableTasks = taskRecommendations.filter(
        (rec: any) => rec.priority !== 'unrealistic'
      ).length
      const unrealisticTasks = taskRecommendations.filter(
        (rec: any) => rec.priority === 'unrealistic'
      ).length
      
      // Time spent on doable tasks
      const timeSpentOnDoableTasks = taskRecommendations
        .filter((rec: any) => rec.priority !== 'unrealistic')
        .reduce((sum: number, rec: any) => sum + (rec.recommendedTime || 0), 0)
      
      // Time spent on distractions
      const timeSpentOnDistractions = distractionRecommendations
        .filter((rec: any) => rec.priority !== 'unrealistic')
        .reduce((sum: number, rec: any) => sum + (rec.recommendedTime || 0), 0)
      
      // CURRENT FOCUS SCORE: Without guidance - trying to do everything inefficiently
      // You waste time on distractions and try to do unrealistic tasks
      // Calculate how many tasks you can actually complete
      
      // Time wasted on distractions (this reduces your effective time)
      const timeWastedOnDistractions = timeSpentOnDistractions
      
      // Effective time for actual tasks (after wasting time on distractions)
      const effectiveTimeForTasks = Math.max(0, timeAvailable - timeWastedOnDistractions)
      
      // How many doable tasks can you complete with effective time?
      const avgTimePerDoableTask = doableTasks > 0
        ? timeSpentOnDoableTasks / doableTasks
        : 0
      
      let tasksPossibleWithoutGuidance = 0
      if (avgTimePerDoableTask > 0 && effectiveTimeForTasks > 0) {
        tasksPossibleWithoutGuidance = Math.floor(effectiveTimeForTasks / avgTimePerDoableTask)
      }
      
      // Current score: tasks you can do (after wasting time on distractions) / total tasks
      currentFocusScore = totalTasks > 0
        ? Math.round((Math.min(tasksPossibleWithoutGuidance, doableTasks) / totalTasks) * 100)
        : 0
      
      // Penalty: if you're wasting a lot of time on distractions, reduce score
      if (timeWastedOnDistractions > timeAvailable * 0.2) {
        const wastePenalty = Math.min(timeWastedOnDistractions / timeAvailable, 0.5)
        currentFocusScore = Math.round(currentFocusScore * (1 - wastePenalty))
      }
      
      // Penalty: if total time needed exceeds available, reduce score
      if (totalTimeNeededForAllTasks > timeAvailable) {
        const overloadPenalty = timeAvailable / totalTimeNeededForAllTasks
        currentFocusScore = Math.round(currentFocusScore * Math.min(overloadPenalty, 0.85))
      }
      
      // Cap current score at 90% max (always room for improvement)
      currentFocusScore = Math.min(currentFocusScore, 90)
      currentFocusScore = Math.max(currentFocusScore, 0)

      // POTENTIAL FOCUS SCORE: With Task Whisperer's guidance
      // You follow recommendations: remove distractions, drop unrealistic tasks, focus on priorities
      // This gives you MORE time to focus on actual tasks
      
      // Time freed by removing distractions (you don't waste time on them)
      const timeFreedFromDistractions = timeSpentOnDistractions
      
      // All your time is now available for actual tasks (no distractions)
      const optimizedTimeAvailable = timeAvailable // All time goes to tasks, not distractions
      
      // Focus only on doable tasks (unrealistic ones are dropped)
      const optimizedDoableTasks = doableTasks
      const optimizedTimeNeeded = timeSpentOnDoableTasks
      
      // Calculate how many doable tasks you can complete with all available time
      const avgTimePerDoableTaskOptimized = optimizedDoableTasks > 0
        ? optimizedTimeNeeded / optimizedDoableTasks
        : 0
      
      let tasksPossibleWithOptimizedTime = 0
      if (avgTimePerDoableTaskOptimized > 0 && optimizedTimeAvailable > 0) {
        tasksPossibleWithOptimizedTime = Math.floor(optimizedTimeAvailable / avgTimePerDoableTaskOptimized)
      }
      
      // Potential score: tasks you can do with optimization / total original tasks
      potentialFocusScore = totalTasks > 0
        ? Math.round((Math.min(tasksPossibleWithOptimizedTime, optimizedDoableTasks) / totalTasks) * 100)
        : 0
      
      // Cap at 100%
      potentialFocusScore = Math.min(potentialFocusScore, 100)
      
      // CRITICAL: Potential MUST always be better than current
      // If current wasted time on distractions, potential should be significantly better
      if (potentialFocusScore <= currentFocusScore) {
        // Calculate improvement based on time freed from distractions
        const improvementFromNoDistractions = timeFreedFromDistractions > 0
          ? Math.min(Math.round((timeFreedFromDistractions / timeAvailable) * 50), 30) // Max 30% improvement
          : 10 // At least 10% improvement even if no distractions
        
        potentialFocusScore = Math.min(currentFocusScore + improvementFromNoDistractions, 100)
      }
      
      // Additional boost: if you can complete all doable tasks, show that
      if (tasksPossibleWithOptimizedTime >= optimizedDoableTasks && optimizedDoableTasks > 0) {
        const completionRatio = optimizedDoableTasks / totalTasks
        potentialFocusScore = Math.max(potentialFocusScore, Math.round(completionRatio * 100))
      }
      
      // Final guarantee: potential is ALWAYS at least current + 5%
      potentialFocusScore = Math.max(potentialFocusScore, Math.min(currentFocusScore + 5, 100))
      
    } else {
      // Fallback: calculate based on task vs distraction ratio
      currentFocusScore =
        total > 0 ? Math.round((analysis.actualTasks / total) * 100) : 0
      
      // Potential score: if we remove distractions, we can focus on tasks
      // But be realistic - assume 75-85% completion is realistic
      const realisticCompletionRate = 0.80
      potentialFocusScore = Math.round(analysis.actualTasks * realisticCompletionRate / total * 100)
      potentialFocusScore = Math.min(potentialFocusScore, 90) // Cap at 90% to be realistic
      potentialFocusScore = Math.max(potentialFocusScore, currentFocusScore)
    }

    const result = {
      actualTasks: analysis.actualTasks || 0,
      distractions: analysis.distractions || 0,
      currentFocusScore,
      potentialFocusScore,
      taskList: analysis.taskList || [],
      distractionList: analysis.distractionList || [],
      recommendations: analysis.recommendations || [],
      timeRecommendations: analysis.timeRecommendations || undefined,
      priorityWeights: priorities || undefined,
      totalTimeAvailable: timeAvailable || undefined,
      taskCategories: analysis.taskCategories || undefined,
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error analyzing tasks:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze tasks',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}

