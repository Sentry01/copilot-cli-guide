import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Quiz from './Quiz';
import Breadcrumbs from './Breadcrumbs';
import { useUser } from '../contexts/UserContext';
import { LessonLoadingSkeleton } from './LoadingStates';
import { delay, LOADING_DELAY } from '../utils/delay';
import ErrorMessage, { NetworkError } from './ErrorMessage';

// Code block component with syntax highlighting and copy button
function CodeBlock({ node: _node, inline: _inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect if this is inline code (no language class and no newlines in content)
  const isInline = !className && !code.includes('\n');

  if (isInline) {
    return (
      <code style={{ display: 'inline' }} className="bg-gray-100 dark:bg-gh-dark-surface text-primary dark:text-blue-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative group mb-4">
      {language && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
          <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded font-mono">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition-colors opacity-0 group-hover:opacity-100"
            title="Copy code"
            aria-label="Copy code to clipboard"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      )}
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          padding: '1rem',
          paddingTop: language ? '2.5rem' : '1rem',
          backgroundColor: '#1e1e1e', // Force consistent dark background in both themes
        }}
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function LessonView({ lessonId, onNavigateToLesson }) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { markLessonComplete, isLessonComplete, sessionId, user } = useUser();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [_allLessons, setAllLessons] = useState([]);
  const [prevLesson, setPrevLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);

  const isComplete = lessonId ? isLessonComplete(lessonId) : false;

  // Scroll to top when lesson changes or on initial mount
  useEffect(() => {
    // Use requestAnimationFrame to ensure scroll happens after render
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [lessonId]);

  // Fetch lesson data
  const fetchLesson = async () => {
    if (!lessonId) return;

    setLoading(true);
    setError(null);
    
    try {
      const [response] = await Promise.all([
        fetch(`/api/lessons?lesson_id=${lessonId}`),
        delay(LOADING_DELAY)
      ]);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('LESSON_NOT_FOUND');
        } else if (response.status >= 500) {
          throw new Error('SERVER_ERROR');
        } else {
          throw new Error('FETCH_ERROR');
        }
      }

      const data = await response.json();
      setLesson(data);
      setError(null);
    } catch (err) {
      if (err.name === 'TypeError' || err.message === 'Failed to fetch') {
        setError('NETWORK_ERROR');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // Fetch all lessons to determine next/previous
  useEffect(() => {
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => {
        // Sort by module_id then order_index
        const sorted = [...data].sort((a, b) => {
          if (a.module_id !== b.module_id) return a.module_id - b.module_id;
          return a.order_index - b.order_index;
        });
        setAllLessons(sorted);
        
        // Find current lesson index and set prev/next
        if (lessonId) {
          const currentIndex = sorted.findIndex(l => l.id === parseInt(lessonId));
          if (currentIndex > 0) {
            setPrevLesson(sorted[currentIndex - 1]);
          } else {
            setPrevLesson(null);
          }
          if (currentIndex < sorted.length - 1 && currentIndex >= 0) {
            setNextLesson(sorted[currentIndex + 1]);
          } else {
            setNextLesson(null);
          }
        }
      })
      .catch(err => console.error('Error fetching lessons:', err));
  }, [lessonId]);

  // Check if lesson is bookmarked
  useEffect(() => {
    if (!lessonId || !sessionId) return;

    fetch(`/api/bookmarks/${sessionId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch bookmarks');
        return res.json();
      })
      .then(data => {
        const bookmarked = data.bookmarks?.some(b => b.lesson_id === parseInt(lessonId));
        setIsBookmarked(bookmarked);
      })
      .catch(err => console.error('Error checking bookmark:', err));
  }, [lessonId, sessionId]);

  // Toggle bookmark
  const toggleBookmark = async () => {
    if (!sessionId) return;
    
    setIsBookmarking(true);
    try {
      if (isBookmarked) {
        // Remove bookmark
        await fetch(`/api/bookmarks/${sessionId}?lesson_id=${lessonId}`, {
          method: 'DELETE',
        });
        setIsBookmarked(false);
      } else {
        // Add bookmark
        await fetch(`/api/bookmarks/${sessionId}?lesson_id=${lessonId}`, {
          method: 'POST',
        });
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
    setIsBookmarking(false);
  };

  if (loading) {
    return <LessonLoadingSkeleton />;
  }

  if (error) {
    if (error === 'NETWORK_ERROR') {
      return <NetworkError onRetry={fetchLesson} />;
    }
    
    if (error === 'LESSON_NOT_FOUND') {
      return (
        <ErrorMessage
          title="Lesson Not Found"
          message="This lesson doesn't exist or has been removed."
          onRetry={() => window.location.reload()}
          showRetry={false}
        />
      );
    }
    
    if (error === 'SERVER_ERROR') {
      return (
        <ErrorMessage
          title="Server Error"
          message="Our server encountered an error. Please try again."
          onRetry={fetchLesson}
        />
      );
    }

    return (
      <ErrorMessage
        title="Error Loading Lesson"
        message="We encountered an unexpected error."
        details={error}
        onRetry={fetchLesson}
      />
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Select a lesson to get started</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-6 lg:py-8">
      {/* Breadcrumb navigation */}
      <Breadcrumbs
        items={[
          { label: 'Home', link: true, onClick: () => window.location.reload() },
          { label: lesson.module_name || 'Module', link: false },
          { label: lesson.title, link: false },
        ]}
      />

      {/* Lesson header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {lesson.title}
          </h1>
          <button
            onClick={toggleBookmark}
            disabled={isBookmarking}
            className="ml-4 p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
          >
            <svg 
              className={`w-6 h-6 ${isBookmarked ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`}
              fill={isBookmarked ? 'currentColor' : 'none'}
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {lesson.duration} min
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            lesson.difficulty === 'beginner' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : lesson.difficulty === 'intermediate'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {lesson.difficulty}
          </span>
        </div>
      </div>

      {/* Lesson content with markdown rendering */}
      <div className="lesson-content max-w-none space-y-2">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node: _node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4" {...props} />,
            h2: ({node: _node, ...props}) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3" {...props} />,
            h3: ({node: _node, ...props}) => <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2" {...props} />,
            p: ({node, children, ...props}) => {
              // Check if this paragraph only contains a code block
              const hasOnlyCode = node?.children?.length === 1 && node.children[0].tagName === 'code';
              if (hasOnlyCode) {
                return <div {...props}>{children}</div>;
              }
              return <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props}>{children}</p>;
            },
            ul: ({node: _node, ...props}) => <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4" {...props} />,
            ol: ({node: _node, ...props}) => <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4" {...props} />,
            li: ({node: _node, ...props}) => <li className="ml-4" {...props} />,
            code: CodeBlock,
            pre: ({node: _node, ...props}) => <div {...props} />,
            a: ({node: _node, ...props}) => <a className="text-primary hover:underline" {...props} />,
            blockquote: ({node: _node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 dark:text-gray-400 my-4" {...props} />,
            strong: ({node: _node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
            table: ({node: _node, ...props}) => (
              <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm lesson-table" {...props} />
              </div>
            ),
            thead: ({node: _node, ...props}) => <thead className="bg-gray-100 dark:bg-gray-800" {...props} />,
            tbody: ({node: _node, ...props}) => <tbody className="divide-y divide-gray-100 dark:divide-gray-800" {...props} />,
            tr: ({node: _node, ...props}) => <tr className="even:bg-gray-50/50 dark:even:bg-gray-800/30 hover:bg-blue-50/50 dark:hover:bg-gray-700/30 transition-colors" {...props} />,
            th: ({node: _node, ...props}) => <th scope="col" className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props} />,
            td: ({node: _node, ...props}) => <td className="px-5 py-3.5 text-gray-700 dark:text-gray-300 align-top" {...props} />,
          }}
        >
          {lesson.content.replace(/^#\s+[^\n]+\n*/, '')}
        </ReactMarkdown>
      </div>

      {/* Quiz Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6">
          📝 Test Your Knowledge
        </h3>
        <Quiz lessonId={lessonId} userId={user?.id || 1} />
      </div>

      {/* Lesson footer with navigation */}
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gh-dark-border">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => prevLesson && onNavigateToLesson && onNavigateToLesson(prevLesson.id)}
            disabled={!prevLesson}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              prevLesson 
                ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50'
            }`}
            aria-label={prevLesson ? `Go to previous lesson: ${prevLesson.title}` : 'No previous lesson'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous Lesson
          </button>
          <button 
            onClick={async () => {
              setIsCompleting(true);
              await markLessonComplete(lessonId);
              setIsCompleting(false);
            }}
            disabled={isCompleting || isComplete}
            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isComplete 
                ? 'bg-green-600 text-white cursor-default' 
                : 'bg-primary text-white hover:bg-blue-600'
            }`}
            aria-label={isComplete ? 'Lesson marked as complete' : 'Mark lesson as complete'}
          >
            {isComplete && <span aria-hidden="true">✓</span>}
            {isComplete ? 'Completed' : isCompleting ? 'Marking...' : 'Mark as Complete'}
          </button>
          <button 
            onClick={() => nextLesson && onNavigateToLesson && onNavigateToLesson(nextLesson.id)}
            disabled={!nextLesson}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              nextLesson 
                ? 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'text-gray-500 dark:text-gray-500 cursor-not-allowed opacity-50'
            }`}
            aria-label={nextLesson ? `Go to next lesson: ${nextLesson.title}` : 'No next lesson'}
          >
            Next Lesson
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
