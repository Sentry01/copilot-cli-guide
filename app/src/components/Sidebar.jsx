import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

export default function Sidebar({ onLessonSelect, onViewChange, currentView }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState(1);
  const [activeLessonId, setActiveLessonId] = useState(3);
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState({});
  const { completedLessons } = useUser();

  const handleProgressClick = (e) => {
    e.preventDefault();
    if (onViewChange) {
      onViewChange('progress');
    }
  };

  const handleLessonClickInternal = (lessonId) => {
    setActiveLessonId(lessonId);
    if (onLessonSelect) {
      onLessonSelect(lessonId);
    }
    if (onViewChange) {
      onViewChange('lesson');
    }
  };

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
    handleLessonClickInternal(lessonId);
  };

  // Calculate module progress
  const getModuleProgress = (moduleId) => {
    const moduleLessons = lessons[moduleId] || [];
    if (moduleLessons.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = moduleLessons.filter(lesson => 
      completedLessons.has(lesson.id)
    ).length;
    
    const total = moduleLessons.length;
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
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
            {modules.map((module) => {
              const progress = getModuleProgress(module.id);
              return (
                <div key={module.id} className="mb-2">
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <span>{module.title}</span>
                      {progress.total > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                          {progress.completed}/{progress.total}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {progress.total > 0 && (
                        <div className="relative w-10 h-10">
                          {/* Background circle */}
                          <svg className="w-10 h-10 transform -rotate-90">
                            <circle
                              cx="20"
                              cy="20"
                              r="16"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              className="text-gray-300 dark:text-gray-700"
                            />
                            {/* Progress circle */}
                            <circle
                              cx="20"
                              cy="20"
                              r="16"
                              stroke="currentColor"
                              strokeWidth="3"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 16}`}
                              strokeDashoffset={`${2 * Math.PI * 16 * (1 - progress.percentage / 100)}`}
                              className="text-primary transition-all duration-300"
                              strokeLinecap="round"
                            />
                          </svg>
                          {/* Percentage text */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">
                              {progress.percentage}%
                            </span>
                          </div>
                        </div>
                      )}
                      <svg
                        className={`w-4 h-4 transition-transform ${expandedModuleId === module.id ? 'rotate-90' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                  {expandedModuleId === module.id && lessons[module.id] && (
                    <div className="space-y-1 ml-2 mt-1">
                      {lessons[module.id].map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson.id)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${
                            activeLessonId === lesson.id
                              ? 'bg-primary text-white'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span>{lesson.title}</span>
                          {completedLessons.has(lesson.id) && (
                            <span className="text-green-500">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
            <a 
              href="#" 
              onClick={handleProgressClick}
              className={`block px-3 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg ${
                currentView === 'progress' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              📊 Progress
            </a>
          </div>
        </div>
      )}
    </aside>
  );
}
