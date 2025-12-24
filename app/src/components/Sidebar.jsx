import React, { useState, useEffect } from 'react';

export default function Sidebar({ onLessonSelect }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState(1);
  const [activeLessonId, setActiveLessonId] = useState(3);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({});

  useEffect(() => {
    // Fetch modules
    fetch('http://localhost:3000/api/modules')
      .then(res => res.json())
      .then(data => {
        setModules(data);
        // Fetch lessons for each module
        data.forEach(module => {
          fetch(`http://localhost:3000/api/lessons?module_id=${module.id}`)
            .then(res => res.json())
            .then(lessonData => {
              setLessons(prev => ({ ...prev, [module.id]: lessonData }));
            });
        });
      })
      .catch(err => console.error('Error fetching modules:', err));
  }, []);

  const toggleModule = (moduleId) => {
    setExpandedModuleId(expandedModuleId === moduleId ? null : moduleId);
  };

  const handleLessonClick = (lessonId) => {
    setActiveLessonId(lessonId);
    if (onLessonSelect) {
      onLessonSelect(lessonId);
    }
  };

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
              <div key={module.id} className="mb-2">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <span>{module.title}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedModuleId === module.id ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                {expandedModuleId === module.id && lessons[module.id] && (
                  <div className="space-y-1 ml-2 mt-1">
                    {lessons[module.id].map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          activeLessonId === lesson.id
                            ? 'bg-primary text-white'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                        }`}
                      >
                        {lesson.title}
                      </button>
                    ))}
                  </div>
                )}
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
