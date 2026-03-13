import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

export default function ProgressDashboard() {
  const { completedLessons, sessionId } = useUser();
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState(new Set());
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    totalModules: 0,
    completedModules: 0,
    estimatedTimeSpent: 0,
  });

  useEffect(() => {
    const safeFetch = async (url, options) => {
      try {
        const res = await fetch(url, options);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    };

    Promise.all([
      safeFetch('/api/modules'),
      safeFetch('/api/lessons'),
      safeFetch('/api/achievements'),
      safeFetch('/api/achievements/user', {
        headers: { 'x-session-id': sessionId }
      }),
    ]).then(([modulesData, lessonsData, achievementsData, unlockedData]) => {
      const safeModules = modulesData || [];
      const safeLessons = lessonsData || [];
      const safeAchievements = achievementsData || [];
      const safeUnlocked = unlockedData || [];

      setModules(safeModules);
      setLessons(safeLessons);
      setAchievements(safeAchievements);
      setUnlockedAchievements(new Set(safeUnlocked.map(a => a.id)));

      // Calculate statistics
      const totalLessons = safeLessons.length;
      const completed = safeLessons.filter(l => completedLessons.has(l.id)).length;
      
      // Calculate completed modules (all lessons in module complete)
      const completedModulesCount = safeModules.filter(module => {
        const moduleLessons = safeLessons.filter(l => l.module_id === module.id);
        return moduleLessons.length > 0 && 
               moduleLessons.every(l => completedLessons.has(l.id));
      }).length;

      // Estimate time spent (5 min per lesson completed)
      const timeSpent = completed * 5;

      setStats({
        totalLessons,
        completedLessons: completed,
        totalModules: safeModules.length,
        completedModules: completedModulesCount,
        estimatedTimeSpent: timeSpent,
      });
    });
  }, [completedLessons, sessionId]);

  const completionPercentage = stats.totalLessons > 0 
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100)
    : 0;

  // Get module-wise progress
  const moduleProgress = modules.map(module => {
    const moduleLessons = lessons.filter(l => l.module_id === module.id);
    const completed = moduleLessons.filter(l => completedLessons.has(l.id)).length;
    const total = moduleLessons.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return {
      ...module,
      completed,
      total,
      percentage,
    };
  });

  // Get recently completed lessons
  const recentlyCompleted = lessons
    .filter(l => completedLessons.has(l.id))
    .slice(-5)
    .reverse();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Your Progress Dashboard
      </h1>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gh-dark-surface rounded-lg p-6 shadow-md">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Lessons Completed
          </div>
          <div className="text-3xl font-bold text-primary">
            {stats.completedLessons}/{stats.totalLessons}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {completionPercentage}% complete
          </div>
        </div>

        <div className="bg-white dark:bg-gh-dark-surface rounded-lg p-6 shadow-md">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Modules Completed
          </div>
          <div className="text-3xl font-bold text-green-600">
            {stats.completedModules}/{stats.totalModules}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {stats.totalModules - stats.completedModules} remaining
          </div>
        </div>

        <div className="bg-white dark:bg-gh-dark-surface rounded-lg p-6 shadow-md">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Time Spent
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {stats.estimatedTimeSpent}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            minutes
          </div>
        </div>

        <div className="bg-white dark:bg-gh-dark-surface rounded-lg p-6 shadow-md">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Overall Progress
          </div>
          <div className="relative w-20 h-20 mx-auto">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-300 dark:text-gray-700"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - completionPercentage / 100)}`}
                className="text-primary transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                {completionPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Progress Chart */}
      <div className="bg-white dark:bg-gh-dark-surface rounded-lg p-6 shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Progress by Module
        </h2>
        <div className="space-y-4">
          {moduleProgress.map(module => (
            <div key={module.id}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {module.title}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {module.completed}/{module.total} ({module.percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gh-dark-surface rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-primary h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${module.percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gh-dark-surface rounded-lg p-6 shadow-md mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        {recentlyCompleted.length > 0 ? (
          <div className="space-y-3">
            {recentlyCompleted.map(lesson => (
              <div
                key={lesson.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {lesson.title}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Module {lesson.module_id} • {lesson.duration} min
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No completed lessons yet. Start learning to see your progress!
          </div>
        )}
      </div>

      {/* Achievements Section */}
      <div className="bg-white dark:bg-gh-dark-surface rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Achievements
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {achievements.map(achievement => {
            const isUnlocked = unlockedAchievements.has(achievement.id);
            return (
              <div
                key={achievement.id}
                className={`relative p-4 rounded-lg border-2 transition-all ${
                  isUnlocked
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-300 dark:border-gh-dark-border opacity-50 grayscale'
                }`}
                title={achievement.description}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <div className={`text-sm font-medium ${
                    isUnlocked 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {achievement.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {achievement.description}
                  </div>
                  {isUnlocked && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {achievements.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No achievements available yet.
          </div>
        )}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gh-dark-border">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              Progress
            </span>
            <span className="font-medium text-gray-900 dark:text-white">
              {unlockedAchievements.size} / {achievements.length} unlocked
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gh-dark-surface rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${achievements.length > 0 ? (unlockedAchievements.size / achievements.length) * 100 : 0}%`
              }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
