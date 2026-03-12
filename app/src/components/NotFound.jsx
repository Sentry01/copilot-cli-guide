import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gh-dark-bg text-gray-900 dark:text-gh-dark-text">
      <div className="text-center px-6 max-w-2xl">
        {/* 404 Icon */}
        <div className="mb-8">
          <svg
            className="mx-auto h-48 w-48 text-primary opacity-20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={0.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* 404 Heading */}
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>

        {/* Message */}
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn't find the page you're looking for. The lesson or resource you're trying to access may have been moved or doesn't exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Go to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 border-2 border-gray-300 dark:border-gh-dark-border text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gh-dark-border">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Here are some helpful links:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-primary hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm"
            >
              Browse Lessons
            </button>
            <button
              onClick={() => {
                navigate('/');
                // Small delay to ensure navigation completes before triggering view change
                setTimeout(() => {
                  const commandsLink = document.querySelector('a[href="#"]');
                  commandsLink?.click();
                }, 100);
              }}
              className="text-primary hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm"
            >
              Commands Reference
            </button>
            <button
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  const searchInput = document.querySelector('input[type="text"]');
                  searchInput?.focus();
                }, 100);
              }}
              className="text-primary hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
