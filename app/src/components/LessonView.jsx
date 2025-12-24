import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Code block component with syntax highlighting and copy button
function CodeBlock({ inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className="bg-gray-100 dark:bg-gray-800 text-primary px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
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
        }}
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default function LessonView({ lessonId }) {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lessonId) return;

    setLoading(true);
    fetch(`http://localhost:3000/api/lessons/${lessonId}`)
      .then(res => res.json())
      .then(data => {
        setLesson(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [lessonId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading lesson...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading lesson: {error}</div>
      </div>
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
    <div className="max-w-4xl mx-auto px-8 py-8">
      {/* Lesson header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {lesson.title}
        </h1>
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
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2" {...props} />,
            p: ({node, children, ...props}) => {
              // Check if this paragraph only contains a code block
              const hasOnlyCode = node?.children?.length === 1 && node.children[0].tagName === 'code';
              if (hasOnlyCode) {
                return <div {...props}>{children}</div>;
              }
              return <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4" {...props}>{children}</p>;
            },
            ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4" {...props} />,
            li: ({node, ...props}) => <li className="ml-4" {...props} />,
            code: CodeBlock,
            pre: ({node, ...props}) => <div {...props} />,
            a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 dark:text-gray-400 my-4" {...props} />,
            strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </div>

      {/* Lesson footer with navigation */}
      <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous Lesson
          </button>
          <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
            Mark as Complete
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            Next Lesson
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
