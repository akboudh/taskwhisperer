# Task Whisperer 🎯

A beautiful Next.js application that analyzes your tasks and helps you improve your focus score by identifying actual tasks vs distractions.

## Features

- 📝 Simple task input interface
- 🤖 AI-powered task analysis using ChatGPT
- 📊 Interactive donut chart visualization
- 🎯 Focus score calculation
- 💡 Personalized recommendations
- 🌙 Dark mode support
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd taskwhisperepr
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Usage

1. Enter your tasks in the text area (one per line or separated by commas)
2. Click "Analyze Tasks"
3. View your focus analysis:
   - See how many actual tasks vs distractions you have
   - Check your current and potential focus scores
   - Review recommendations for improvement

## Project Structure

```
taskwhisperepr/
├── app/
│   ├── api/
│   │   └── analyze/        # API route for task analysis
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/
│   ├── TaskInput.tsx       # Task input form
│   ├── AnalysisResults.tsx # Results display
│   └── DonutChart.tsx      # Chart visualization
├── types/
│   └── index.ts            # TypeScript types
└── package.json
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Recharts** - Chart visualization
- **OpenAI API** - Task analysis

## Building for Production

```bash
npm run build
npm start
```

## License

MIT

