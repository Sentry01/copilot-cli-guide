import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

export default function BookmarksView({ onLessonSelect }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sessionId } = useUser();

  useEffect(() => {
    if (!sessionId) return;

    setLoading(true);
    fetch(`http://localhost:3000/api/bookmarks/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        setBookmarks(data.bookmarks || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading bookmarks:', err);
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading bookmarks...</div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Your Bookmarks
        </h1>
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            No bookmarks yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Start bookmarking lessons to see them here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Your Bookmarks
      </h1>
      <div className="space-y-4">
        {bookmarks.map(bookmark => (
          <div
            key={bookmark.id}
            onClick={() => onLessonSelect(bookmark.lesson_id)}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {bookmark.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {bookmark.duration} min
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bookmark.difficulty === 'beginner' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : bookmark.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {bookmark.difficulty}
                  </span>
                  <span className="text-gray-500">
                    {bookmark.module_name}
                  </span>
                </div>
              </div>
              <svg 
                className="w-6 h-6 fill-yellow-500 text-yellow-500 flex-shrink-0 ml-4"
                fill="currentColor"
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
