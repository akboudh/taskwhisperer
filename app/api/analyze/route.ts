import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { tasks } = await request.json()

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

    const prompt = `Analyze the following list of tasks and activities. Categorize them into:
1. Actual tasks (productive, goal-oriented work)
2. Distractions (non-essential activities, time-wasters, entertainment, social media, etc.)

Tasks to analyze:
${tasks}

Please respond with a JSON object in this exact format:
{
  "actualTasks": <number>,
  "distractions": <number>,
  "taskList": [<array of actual task strings>],
  "distractionList": [<array of distraction strings>],
  "recommendations": [<array of 2-3 recommendation strings>]
}

Calculate focus scores:
- Current Focus Score: (actualTasks / (actualTasks + distractions)) * 100, rounded to nearest integer
- Potential Focus Score: 100 (if distractions are removed)

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

    // Calculate focus scores
    const total = analysis.actualTasks + analysis.distractions
    const currentFocusScore =
      total > 0 ? Math.round((analysis.actualTasks / total) * 100) : 0
    const potentialFocusScore = 100

    const result = {
      actualTasks: analysis.actualTasks || 0,
      distractions: analysis.distractions || 0,
      currentFocusScore,
      potentialFocusScore,
      taskList: analysis.taskList || [],
      distractionList: analysis.distractionList || [],
      recommendations: analysis.recommendations || [],
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

