import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-gray-900 dark:text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Enhanced background gradient effects with depth */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-cyan-400/10 dark:bg-cyan-400/5 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-500">
            Master GitHub Copilot CLI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Your interactive guide to becoming a command-line AI power user. Learn, practice, and master the tools of the future.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <button
            onClick={() => navigate('/learn')}
            className="group relative px-8 py-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 transform"
          >
            <span className="flex items-center gap-2">
              Start Learning
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
        >
          <div className="p-6 glass dark:glass-dark rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-glass dark:hover:shadow-glass-dark transition-all duration-300 hover:scale-105 transform">
            <div className="text-blue-500 text-2xl mb-3">📚</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Interactive Lessons</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Step-by-step guides to master every aspect of the CLI.</p>
          </div>
          <div className="p-6 glass dark:glass-dark rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-glass dark:hover:shadow-glass-dark transition-all duration-300 hover:scale-105 transform">
            <div className="text-purple-500 text-2xl mb-3">⌨️</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Command Reference</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Comprehensive documentation of all available commands.</p>
          </div>
          <div className="p-6 glass dark:glass-dark rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-glass dark:hover:shadow-glass-dark transition-all duration-300 hover:scale-105 transform">
            <div className="text-green-500 text-2xl mb-3">💡</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Real Examples</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Practical use cases to apply in your daily workflow.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
