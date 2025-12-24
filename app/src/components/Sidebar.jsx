import React, { useState } from 'react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const modules = [
    {
      id: 1,
      title: 'Getting Started',
      lessons: ['Introduction', 'Installation', 'First Command']
    },
    {
      id: 2,
      title: 'Basic Commands',
      lessons: ['gh copilot suggest', 'gh copilot explain', 'Common Flags']
    },
    {
      id: 3,
      title: 'Advanced Topics',
      lessons: ['Workflow Integration', 'Custom Prompts', 'Best Practices']
    }
  ];

  return (
    <aside className={`bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      {/* Logo and toggle */}
      <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
        {!isCollapsed && (
          <div className="font-bold text-lg text-gray-900 dark:text-white">
            Copilot CLI
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {!isCollapsed ? (
          <div className="space-y-2">
            {modules.map((module) => (
              <div key={module.id} className="mb-4">
                <div className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                  {module.title}
                </div>
                <div className="space-y-1 ml-2">
                  {module.lessons.map((lesson, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {lesson}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module) => (
              <div
                key={module.id}
                className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm"
                title={module.title}
              >
                {module.title[0]}
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Quick links */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <a href="#" className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
              📚 Commands
            </a>
            <a href="#" className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
              💡 Examples
            </a>
            <a href="#" className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg">
              📊 Progress
            </a>
          </div>
        </div>
      )}
    </aside>
  );
}
