import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Master GitHub Copilot CLI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
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
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.8)]"
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
          <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
            <div className="text-blue-400 text-2xl mb-3">📚</div>
            <h3 className="text-lg font-semibold mb-2">Interactive Lessons</h3>
            <p className="text-gray-400 text-sm">Step-by-step guides to master every aspect of the CLI.</p>
          </div>
          <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
            <div className="text-purple-400 text-2xl mb-3">⌨️</div>
            <h3 className="text-lg font-semibold mb-2">Command Reference</h3>
            <p className="text-gray-400 text-sm">Comprehensive documentation of all available commands.</p>
          </div>
          <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
            <div className="text-green-400 text-2xl mb-3">💡</div>
            <h3 className="text-lg font-semibold mb-2">Real Examples</h3>
            <p className="text-gray-400 text-sm">Practical use cases to apply in your daily workflow.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
