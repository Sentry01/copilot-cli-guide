import React from 'react';

export default function ErrorMessage({ 
  title = "Oops! Something went wrong",
  message = "We encountered an error while loading the content.",
  details = null,
  onRetry = null,
  showRetry = true 
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-lg shadow-lg p-6">
        {/* Error Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900">
          <svg 
            className="w-6 h-6 text-red-600 dark:text-red-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-white mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
          {message}
        </p>

        {/* Details (if provided) */}
        {details && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
              {details}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Reload Page
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-4 text-xs text-center text-gray-600 dark:text-gray-400">
          If the problem persists, please check your network connection or try again later.
        </p>
      </div>
    </div>
  );
}

// Specialized error messages for common scenarios
export function NetworkError({ onRetry }) {
  return (
    <ErrorMessage
      title="Connection Error"
      message="Unable to connect to the server. Please check your network connection."
      onRetry={onRetry}
    />
  );
}

export function NotFoundError({ resourceType = "content", onBack }) {
  return (
    <ErrorMessage
      title="Not Found"
      message={`The ${resourceType} you're looking for doesn't exist or has been removed.`}
      onRetry={onBack}
      showRetry={!!onBack}
    />
  );
}

export function ServerError({ onRetry }) {
  return (
    <ErrorMessage
      title="Server Error"
      message="Our server encountered an error. We're working to fix it."
      onRetry={onRetry}
    />
  );
}
