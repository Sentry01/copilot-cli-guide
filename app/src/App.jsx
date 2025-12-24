import { useState } from 'react'
import MainLayout from './layouts/MainLayout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <MainLayout>
      <div className="p-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to GitHub Copilot CLI Guide
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            An interactive learning platform to master the GitHub Copilot CLI
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Setup Status
            </h2>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Vite + React configured
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Tailwind CSS configured
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Express + SQLite backend running
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Main layout structure implemented
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Test Counter: {count}
          </button>
          
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p className="font-semibold mb-2">Progress: 4/100 features implemented (4%)</p>
            <p>Next: Implement collapsible sidebar, breadcrumb navigation, and content rendering</p>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default App
