import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

export default function AchievementNotification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleAchievementUnlocked = (event) => {
      const achievement = event.detail;
      const id = Date.now();
      
      setNotifications(prev => [...prev, { id, ...achievement }]);
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    };

    window.addEventListener('achievement-unlocked', handleAchievementUnlocked);
    
    return () => {
      window.removeEventListener('achievement-unlocked', handleAchievementUnlocked);
    };
  }, []);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ 
              opacity: 0, 
              scale: 0.3, 
              x: 100,
              rotate: -10 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: 0,
              rotate: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              x: 100,
              transition: { duration: 0.2 }
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              duration: 0.6
            }}
            className="pointer-events-auto bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg shadow-2xl p-4 min-w-[320px] max-w-[400px]"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <motion.div 
                className="text-4xl flex-shrink-0"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, -10, 0]
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                  ease: 'easeInOut'
                }}
              >
                {notification.icon || '🏆'}
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
                    Achievement Unlocked!
                  </span>
                </div>
                <div className="font-bold text-lg mb-1">
                  {notification.title}
                </div>
                <div className="text-sm opacity-90">
                  {notification.description}
                </div>
              </div>
              <button
                onClick={() => dismissNotification(notification.id)}
                className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
                aria-label="Dismiss notification"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs opacity-90">
                View all achievements in your Progress Dashboard
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
