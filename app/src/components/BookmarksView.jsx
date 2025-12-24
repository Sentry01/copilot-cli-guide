import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { CardLoadingSkeleton } from './LoadingStates';
import ErrorMessage, { NetworkError } from './ErrorMessage';

export default function BookmarksView({ onLessonSelect }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('date'); // date, title, module
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState('');
  const { sessionId } = useUser();

  const fetchBookmarks = async () => {
    if (!sessionId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/bookmarks/${sessionId}`);
      
      if (!response.ok) {
        throw new Error('FETCH_ERROR');
      }

      const data = await response.json();
      setBookmarks(data.bookmarks || []);
      setError(null);
    } catch (err) {
      if (err.name === 'TypeError' || err.message === 'Failed to fetch') {
        setError('NETWORK_ERROR');
      } else {
        setError('FETCH_ERROR');
      }
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, [sessionId]);

  const handleUpdateNotes = async (bookmarkId, notes) => {
    try {
      const response = await fetch(`http://localhost:3000/api/bookmarks/${bookmarkId}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      
      if (response.ok) {
        setBookmarks(prev => prev.map(b => 
          b.id === bookmarkId ? { ...b, notes } : b
        ));
        setEditingNoteId(null);
      }
    } catch (err) {
      console.error('Error updating notes:', err);
    }
  };

  const startEditingNote = (bookmark) => {
    setEditingNoteId(bookmark.id);
    setNoteText(bookmark.notes || '');
  };

  const saveNote = (bookmarkId) => {
    handleUpdateNotes(bookmarkId, noteText);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
    setNoteText('');
  };

  const getSortedBookmarks = () => {
    const sorted = [...bookmarks];
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'module':
        return sorted.sort((a, b) => a.module_name.localeCompare(b.module_name));
      case 'date':
      default:
        return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Bookmarks
          </h1>
        </div>
        <div className="space-y-4">
          <CardLoadingSkeleton count={5} />
        </div>
      </div>
    );
  }

  if (error) {
    if (error === 'NETWORK_ERROR') {
      return <NetworkError onRetry={fetchBookmarks} />;
    }
    return (
      <ErrorMessage
        title="Error Loading Bookmarks"
        message="We couldn't load your bookmarks."
        onRetry={fetchBookmarks}
      />
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Your Bookmarks
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="date">Date Added</option>
            <option value="title">Title</option>
            <option value="module">Module</option>
          </select>
        </div>
      </div>
      <div className="space-y-4">
        {getSortedBookmarks().map(bookmark => (
          <div
            key={bookmark.id}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors"
          >
            <div 
              onClick={() => onLessonSelect(bookmark.lesson_id)}
              className="flex items-start justify-between cursor-pointer"
            >
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
            
            {/* Notes section */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {editingNoteId === bookmark.id ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add your notes here..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                    rows="3"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => saveNote(bookmark.id)}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      aria-label="Save bookmark notes"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      aria-label="Cancel editing notes"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div onClick={(e) => e.stopPropagation()}>
                  {bookmark.notes ? (
                    <div className="flex items-start justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                        {bookmark.notes}
                      </p>
                      <button
                        onClick={() => startEditingNote(bookmark)}
                        className="ml-4 text-primary hover:text-primary/80 text-sm font-medium"
                        aria-label="Edit bookmark notes"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditingNote(bookmark)}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                      aria-label="Add notes to bookmark"
                    >
                      + Add notes
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
