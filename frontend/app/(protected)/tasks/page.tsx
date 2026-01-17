import { TaskList } from '@/components/tasks/TaskList'
import { Header } from '@/components/layout/Header'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Task Journal - Your Daily Achievements',
  description: 'Transform tasks into triumphs',
}

export default function TasksPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Editorial Header */}
          <div className="mb-12 animate-slide-up">
            <div className="flex items-baseline gap-4 mb-3">
              <h1 className="text-display text-warm-gray-900">Today's Focus</h1>
              <span className="text-sm text-warm-gray-600 italic">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="text-lg text-warm-gray-700 max-w-2xl">
              Small steps forward, one task at a time. What will you accomplish today?
            </p>
          </div>

          {/* Task List */}
          <TaskList />
        </div>
      </main>
    </div>
  )
}
